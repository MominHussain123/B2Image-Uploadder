# 🖼️ React + Node.js Image Uploader Example

This project demonstrates a full-stack image uploader app using React for frontend (with Vite) and Node.js + Express for backend. Users can upload images from the browser and view uploaded images dynamically fetched from the backend.

## Features


- React frontend using Vite for fast development and hot reload  
- Image upload with preview and fetch functionality  
- Skeleton loader while images load  
- Node.js + Express backend handles uploads and serves images  
- Simple local file storage (uploads folder)  
- API base URL configurable via environment variables  
- **Optional: Cloud storage support with Backblaze B2**

## Setup & Usage

1. Clone the repository:  
git clone <your-repo-url>  
cd <your-repo-folder>

2. Backend Setup:  
Go to backend folder (cd backend b2Uploader), install dependencies (npm install), and start the server (node server.js).  
Backend runs at http://localhost:5000  
Backend API endpoints:  
- POST /upload to upload image  
- GET /list-files to get uploaded file names  
- POST /get-image-url to get image URLs

3. Frontend Setup:  
Go to frontend folder (cd b2Uploader), install dependencies (npm install), and start the dev server (npm run dev).  
Frontend runs at http://localhost:5173

4. Environment Variables (optional):  
Create .env file in frontend root with:  
VITE_API_BASE_URL=http://localhost:5000  
Restart servers after adding environment variables.

## How It Works

User selects image → clicks upload → backend saves file → frontend fetches list & URLs → images display with skeleton loader

## Folder Structure

b2Uploader/  
├── backend b2Uploader/  
│   ├── server.js  
│   └── uploads/  
├── b2Uploader/  
│   ├── public/  
│   └── src/  
│       └── ImageUploader.jsx  
├── README.md


## Backblaze B2 Cloud Storage Integration

Backblaze B2 is a cost-effective, high-performance cloud storage service ideal for storing files like images and videos. Instead of saving files locally on the backend, you can upload and fetch images directly from Backblaze B2 buckets.

### Why Backblaze B2?

- Affordable and scalable cloud storage  
- Easy to integrate with Node.js backend via official SDK or REST API  
- Provides secure, publicly accessible URLs for stored files  
- Great alternative to AWS S3 or Google Cloud Storage  

### Basic Integration Steps

1. Create a Backblaze B2 account and create a bucket for your images.  
2. Generate Application Key and Key ID from Backblaze dashboard.  
3. Use `backblaze-b2` npm package or REST API in your backend to:  
   - Authenticate with B2  
   - Upload images to your bucket  
   - Generate download URLs to serve images on frontend  
4. Update your backend API endpoints (`/upload`, `/get-image-url`) to use B2 instead of local storage.

For example, install the SDK:

```bash
npm install backblaze-b2

## Developer

Momin Hussain — Web Developer n

## License

MIT License
