import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ImageUploader = () => {
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // for skeleton

    const fetchFiles = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('http://localhost:5000/list-files');
            const fileNames = res.data.fileNames;

            const urls = await Promise.all(
                fileNames.map(async (fileName) => {
                    const urlRes = await axios.post('http://localhost:5000/get-image-url', { fileName });
                    return urlRes.data.url;
                })
            );

            setImages(urls);
        } catch (err) {
            console.error("Failed to fetch files:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [isUploading]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!image) return toast.error("Please select an image");

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', image);

        try {
            await axios.post('http://localhost:5000/upload', formData);
            toast.success("Image uploaded successfully");

            setTimeout(() => {
                fetchFiles();
                setIsUploading(false);
            }, 1500);
        } catch (err) {
            console.error("Upload failed:", err);
            toast.error("Upload failed");
        }
    };

    return (
        <div>
            <h2>Upload Image</h2>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button type="submit" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Upload"}
                </button>
            </form>

            <h2 style={{ marginTop: '2rem' }}>Uploaded Files</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {isLoading ? (
                    // Skeletons (static gray boxes)
                    Array.from({ length: 8 }).map((_, idx) => (
                        <div
                            key={idx}
                            style={{
                                width: '300px',
                                height: '200px',
                                backgroundColor: '#ccc',
                                borderRadius: '8px',
                                animation: 'pulse 1.5s infinite'
                            }}
                        ></div>
                    ))
                ) : (
                    images.map((url, idx) => (
                        <img key={idx} src={url} alt={`file-${idx}`} width="300" />
                    ))
                )}
            </div>

            {/* Pulse animation for skeleton */}
            <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
            <Toaster />
        </div>
    );
};

export default ImageUploader;
