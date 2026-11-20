# 📁 File Upload Web Application (HTML, CSS, Node.js)

A full-stack web application built with **Node.js, Express, HTML5, and CSS3** that allows uploading both **single** and **multiple** files from your device to the server with real-time progress tracking, file previews, and server file management.

---

## ✨ Features

- **Single & Multiple File Support:**
  - Toggle between *Single File* mode and *Multiple Files* mode or drag multiple files simultaneously.
  - Handles any file type (Images, PDFs, Documents, Archives, Audio, Video, Code, etc.).
- **Drag & Drop Interface:**
  - Interactive dropzone with visual feedback and file picker fallback.
- **Pre-Upload Staging & Previews:**
  - Live image thumbnail previews.
  - File format badges and formatted file sizes.
  - Remove individual files or clear all before uploading.
- **Real-Time Upload Progress:**
  - Live percentage progress bar using AJAX (`XMLHttpRequest.upload.onprogress`).
- **Server File Management:**
  - View all uploaded files stored on the server.
  - Direct download / preview links.
  - Delete files directly from the server.
  - Automatic collision prevention (unique timestamps added to filenames).

---

## 🛠️ Project Structure

```
upload_file/
├── public/               # Frontend Client Files
│   ├── index.html        # Clean, modern UI layout
│   ├── style.css         # Responsive styling & themes
│   └── app.js            # Drag-and-drop, AJAX & upload logic
├── uploads/              # Server directory where files are stored
│   └── .gitkeep
├── server.js             # Node.js Express server with Multer upload engine
├── package.json          # Dependencies (express, multer)
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Install Dependencies
Run the following command in the project directory:
```bash
npm install
```

### 3. Start the Server
Run:
```bash
npm start
```
Or:
```bash
node server.js
```

### 4. Open in Browser
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload single or multiple files (field: `files`) |
| `GET` | `/api/files` | Get list of all uploaded files with metadata |
| `GET` | `/uploads/:filename` | Download or view an uploaded file |
| `DELETE` | `/api/files/:filename` | Delete a file from the server |
