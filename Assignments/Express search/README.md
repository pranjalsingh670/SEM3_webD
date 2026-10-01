# Full-Stack File Search and Download Application

A complete, modern full-stack web application designed for a college assignment demonstration. The system features a responsive **React.js** frontend communicating with a **Node.js + Express.js** backend that searches and serves files stored locally in the backend's `files/` directory.

---

## Architecture & Technology Stack

- **Frontend:** React.js (JavaScript, Vite), Modern CSS (Dark/Light Mode, CSS variables, responsive grid).
- **Backend:** Node.js, Express.js (`cors`, `fs`, `path`).
- **Storage:** Local files stored strictly inside `backend/files/` (No external database like MongoDB/Firebase).
- **Security:** Directory traversal protection using `path.basename` and `path.resolve` boundary verification.

---

## Project Structure

```
Express search/
├── backend/
│   ├── files/                        # Local file storage
│   │   ├── assignment.docx
│   │   ├── data_structures_notes.txt
│   │   ├── math.pdf
│   │   ├── math_assignment.pdf
│   │   ├── math_assignment.txt
│   │   ├── mathematics.docx
│   │   ├── notes.txt
│   │   ├── sample.pdf
│   │   └── web_development_guide.txt
│   ├── server.js                     # Express server, search & download routes
│   └── package.json                  # Express & CORS dependencies
│
├── frontend/
│   ├── index.html                    # HTML entry point
│   ├── vite.config.js                # Vite build configuration
│   ├── package.json                  # React & Vite dependencies
│   └── src/
│       ├── App.jsx                   # Main UI component (Search, Grid, Download)
│       ├── App.css                   # Component styles & animations
│       ├── index.css                 # Theme variables & base typography
│       ├── config.js                 # Centralized API base URL config
│       └── main.jsx                  # React application mount
│
├── .gitignore
└── README.md
```

---

## How to Run the Project

### 1. Start the Backend Server

Open your first terminal window:

```bash
cd backend
npm install
node server.js
```

The Express server will start on port `5000`:
- Search API: `http://localhost:5000/api/files/search?q=math`
- Download API: `http://localhost:5000/api/files/download/:filename`
- Health check: `http://localhost:5000/api/health`

---

### 2. Start the React Frontend

Open a second terminal window:

```bash
cd frontend
npm install
npm run dev
```

Open your browser and navigate to the local Vite URL displayed (typically `http://localhost:3000` or `http://localhost:5173`).

---

## Features & College Assignment Requirements

1. **Search Functionality:**
   - Case-insensitive, partial filename matching.
   - Searching `"math"` finds `math.pdf`, `mathematics.docx`, `math_assignment.pdf`, `math_assignment.txt`.
   - Pressing **Enter** or clicking the **Search** button triggers the search query.
   - Quick search chips allow 1-click filtering (`All Files`, `math`, `assignment`, `.pdf`, `.docx`, `.txt`).

2. **File Download:**
   - Clicking **Download** requests the file from `GET /api/files/download/:filename`.
   - Streaming download handled safely by Express `res.download()`.
   - Path traversal prevention blocks unauthorized access outside the `backend/files` directory.

3. **Modern UI & UX:**
   - **Theme Switcher:** Toggle between Dark and Light mode.
   - **File Badges:** Color-coded badges for `.pdf`, `.docx`, `.txt`, etc.
   - **Size Formatter:** Converts raw byte sizes into human-readable units (`KB`, `MB`).
   - **Feedback States:** Loading spinner, error alert banner with retry button, and "No files found" state.
