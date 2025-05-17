# 🖼️ React + Node.js Image Uploader Example

This project demonstrates a full-stack image uploader app using React for frontend (with Vite) and Node.js + Express for backend. Users can upload images from the browser and view uploaded images dynamically fetched from the backend.

## Features

- React frontend using Vite for fast development and hot reload  
- Image upload with preview and fetch functionality  
- Skeleton loader while images load  
- Node.js + Express backend handles uploads and serves images  
- Simple local file storage (uploads folder)  
- API base URL configurable via environment variables  

## Setup & Usage

1. Clone the repository:  
git clone <your-repo-url>  
cd <your-repo-folder>

2. Backend Setup:  
Go to backend folder (cd backend), install dependencies (npm install), and start the server (node server.js).  
Backend runs at http://localhost:5000  
Backend API endpoints:  
- POST /upload to upload image  
- GET /list-files to get uploaded file names  
- POST /get-image-url to get image URLs

3. Frontend Setup:  
Go to frontend folder (cd frontend), install dependencies (npm install), and start the dev server (npm run dev).  
Frontend runs at http://localhost:5173

4. Environment Variables (optional):  
Create .env file in frontend root with:  
VITE_API_BASE_URL=http://localhost:5000  
Restart servers after adding environment variables.

## How It Works

User selects image → clicks upload → backend saves file → frontend fetches list & URLs → images display with skeleton loader

## Folder Structure

image-uploader/  
├── backend/  
│   ├── server.js  
│   └── uploads/  
├── frontend/  
│   ├── public/  
│   └── src/  
│       └── ImageUploader.jsx  
├── README.md

## Developer

Momin Hussain — Frontend Developer n

## License

MIT License
