const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dedicated directory for stored files
const FILES_DIR = path.resolve(__dirname, 'files');

// Ensure files directory exists
if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'File Search & Download API is running' });
});

/**
 * GET /api/files/search?q=keyword
 * Searches for files in the backend files directory.
 * Case-insensitive partial matching.
 * Returns { files: [ { name, size, type } ] }
 */
app.get('/api/files/search', async (req, res) => {
  try {
    const query = (req.query.q || '').trim().toLowerCase();

    if (!fs.existsSync(FILES_DIR)) {
      return res.json({ files: [] });
    }

    const dirents = await fs.promises.readdir(FILES_DIR, { withFileTypes: true });

    // Filter only files (ignore any subdirectories)
    const fileList = dirents.filter((dirent) => dirent.isFile());

    // Filter by query (case-insensitive partial match)
    // If query is empty, return all available files
    const matchedFiles = fileList.filter((dirent) => {
      if (!query) return true;
      return dirent.name.toLowerCase().includes(query);
    });

    // Gather file metadata (name, size, type)
    const filesData = await Promise.all(
      matchedFiles.map(async (dirent) => {
        const filePath = path.join(FILES_DIR, dirent.name);
        const stats = await fs.promises.stat(filePath);
        const ext = path.extname(dirent.name).toLowerCase() || 'unknown';

        return {
          name: dirent.name,
          size: stats.size,
          type: ext
        };
      })
    );

    return res.json({ files: filesData });
  } catch (error) {
    console.error('Error in /api/files/search:', error);
    return res.status(500).json({ error: 'Internal server error while searching files' });
  }
});

/**
 * GET /api/files/download/:filename
 * Safely downloads a file from the files directory.
 * Prevents path traversal vulnerabilities.
 */
app.get('/api/files/download/:filename', (req, res) => {
  try {
    const rawFilename = req.params.filename;
    if (!rawFilename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = path.basename(rawFilename);

    // Resolve full path to the requested file
    const resolvedPath = path.resolve(FILES_DIR, sanitizedFilename);
    const resolvedFilesDir = path.resolve(FILES_DIR);

    // Security check: ensure resolvedPath resides strictly within FILES_DIR
    if (!resolvedPath.startsWith(resolvedFilesDir + path.sep)) {
      return res.status(403).json({ error: 'Access denied: Invalid file path' });
    }

    // Verify file exists
    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Trigger file download using Express's res.download
    res.download(resolvedPath, sanitizedFilename, (err) => {
      if (err) {
        if (!res.headersSent) {
          console.error('Download error:', err);
          res.status(500).json({ error: 'Failed to download file' });
        }
      }
    });
  } catch (error) {
    console.error('Error in /api/files/download:', error);
    return res.status(500).json({ error: 'Internal server error while processing download' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Backend Server running on port ${PORT}`);
  console.log(`Files directory: ${FILES_DIR}`);
  console.log(`API Search:   http://localhost:${PORT}/api/files/search?q=math`);
  console.log(`API Download: http://localhost:${PORT}/api/files/download/<filename>`);
  console.log(`=========================================`);
});
