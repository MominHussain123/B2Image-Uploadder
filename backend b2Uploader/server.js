const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const dotenv = require('dotenv');
const B2 = require('backblaze-b2');
const fs = require('fs');

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

const B2_KEY_ID = process.env.B2_KEY_ID;
const B2_APP_KEY = process.env.B2_APP_KEY;
const B2_BUCKET_ID = process.env.B2_BUCKET_ID;
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;

let authToken, apiUrl, downloadUrl;

const getAuth = async () => {
    const credentials = Buffer.from(`${B2_KEY_ID}:${B2_APP_KEY}`).toString('base64');

    const response = await axios.get('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
        headers: {
            Authorization: `Basic ${credentials}`,
        },
    });

    authToken = response.data.authorizationToken;
    apiUrl = response.data.apiUrl;
    downloadUrl = response.data.downloadUrl;
    return response.data;
};

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'No file uploaded' });

        const fileBuffer = fs.readFileSync(file.path);
        const fileName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');

        const auth = await getAuth();

        const uploadUrlResponse = await axios.post(`${apiUrl}/b2api/v2/b2_get_upload_url`, {
            bucketId: B2_BUCKET_ID,
        }, {
            headers: {
                Authorization: auth.authorizationToken,
            },
        });

        const uploadUrl = uploadUrlResponse.data.uploadUrl;
        const uploadAuthToken = uploadUrlResponse.data.authorizationToken;

        const uploadResponse = await axios.post(uploadUrl, fileBuffer, {
            headers: {
                Authorization: uploadAuthToken,
                'X-Bz-File-Name': fileName,
                'Content-Type': 'b2/x-auto',
                'Content-Length': file.size,
                'X-Bz-Content-Sha1': 'do_not_verify',
            },
        });

        fs.unlinkSync(file.path);

        res.json({ success: true, fileName });
    } catch (error) {
        console.error("Upload failed:", error?.response?.data || error.message);
        res.status(500).json({ success: false, error: error?.response?.data || error.message });
    }
});


const b2 = new B2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_APP_KEY,
});


app.post('/get-image-url', async (req, res) => {
    const { fileName } = req.body;

    try {
        await b2.authorize(); // make sure fresh token

        const { data } = await b2.getDownloadAuthorization({
            bucketId: process.env.B2_BUCKET_ID,
            fileNamePrefix: fileName,
            validDurationInSeconds: 3600, // 1 hour validity
        });

        const signedUrl = `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}?Authorization=${data.authorizationToken}`;

        res.json({ url: signedUrl });
    } catch (err) {
        console.error("Signed URL error:", err);
        res.status(500).json({ error: 'Failed to get signed URL' });
    }
});
  
// List all files from the bucket
app.get('/list-files', async (req, res) => {
    try {
        const auth = await getAuth();

        const listResponse = await axios.post(`${apiUrl}/b2api/v2/b2_list_file_names`, {
            bucketId: B2_BUCKET_ID,
            maxFileCount: 100,
        }, {
            headers: {
                Authorization: auth.authorizationToken,
                'Content-Type': 'application/json',
            },
          });

        const fileNames = listResponse.data.files.map(file => file.fileName);
        res.json({ success: true, fileNames });
    } catch (error) {
        console.error("List files error:", error?.response?.data || error.message);
        res.status(500).json({ success: false, error: error?.response?.data || error.message });
    }
});


app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});