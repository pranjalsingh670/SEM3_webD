const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Path to uploads directory
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Generate unique filename preserving original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  }
});

// Multer upload instance (supports up to 50MB per file, up to 50 files per request)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit per file
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static assets
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files statically for direct viewing/downloading
app.use('/uploads', express.static(UPLOAD_DIR));

/**
 * Helper to format file size in human-readable format
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * API Route: Upload single or multiple files
 * upload.any() allows both single ('file') and multiple ('files') fields
 */
app.post('/api/upload', (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size exceeds maximum allowed limit (50MB).' });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(500).json({ error: `Server error: ${err.message}` });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please select at least one file to upload.' });
    }

    const uploadedFiles = req.files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      sizeFormatted: formatBytes(file.size),
      mimetype: file.mimetype,
      url: `/uploads/${encodeURIComponent(file.filename)}`
    }));

    return res.status(200).json({
      message: `${uploadedFiles.length} file(s) uploaded successfully!`,
      count: uploadedFiles.length,
      files: uploadedFiles
    });
  });
});

/**
 * API Route: Get list of all uploaded files on the server
 */
app.get('/api/files', (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, filenames) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to scan uploads directory.' });
    }

    const fileList = filenames
      .filter(filename => !filename.startsWith('.'))
      .map(filename => {
      const filePath = path.join(UPLOAD_DIR, filename);
      try {
        const stats = fs.statSync(filePath);
        return {
          filename: filename,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size),
          createdAt: stats.birthtime || stats.ctime,
          modifiedAt: stats.mtime,
          url: `/uploads/${encodeURIComponent(filename)}`
        };
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    // Sort by latest modified date first
    fileList.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));

    res.json({ files: fileList });
  });
});

/**
 * API Route: Delete an uploaded file
 */
app.delete('/api/files/:filename', (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(UPLOAD_DIR, safeFilename);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).json({ error: 'File not found on server.' });
    }

    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        return res.status(500).json({ error: 'Failed to delete file from server.' });
      }
      return res.json({ message: `"${safeFilename}" was deleted successfully.` });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` File Upload Server is running!`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(` Upload Directory: ${UPLOAD_DIR}`);
  console.log(`===============================================`);
});
