const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'requests.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper: Ensure requests.json exists and read data
function readRequests() {
  return new Promise((resolve, reject) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // File does not exist, initialize with empty array
          fs.writeFile(DATA_FILE, '[]', 'utf8', (writeErr) => {
            if (writeErr) return reject(writeErr);
            return resolve([]);
          });
        } else {
          return reject(err);
        }
      } else {
        try {
          const parsed = JSON.parse(data || '[]');
          resolve(parsed);
        } catch (parseErr) {
          reject(parseErr);
        }
      }
    });
  });
}

// Helper: Write data to requests.json
function writeRequests(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// Routes

// 1. GET /api/requests - Get all requests
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await readRequests();
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error reading requests:', error);
    res.status(500).json({ error: 'Failed to retrieve requests' });
  }
});

// 2. GET /api/requests/:id - Get a single request by ID
app.get('/api/requests/:id', async (req, res) => {
  try {
    const requests = await readRequests();
    const requestId = req.params.id;
    const request = requests.find((r) => String(r.id) === String(requestId));

    if (!request) {
      return res.status(404).json({ error: `Request with ID ${requestId} not found` });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// 3. POST /api/requests - Submit a new request
app.post('/api/requests', async (req, res) => {
  try {
    const { studentName, email, category, description, priority } = req.body;

    // Validation
    if (!studentName || !email || !category || !description || !priority) {
      return res.status(400).json({
        error: 'All fields are required: studentName, email, category, description, priority'
      });
    }

    const requests = await readRequests();

    const newRequest = {
      id: Date.now().toString(),
      studentName: studentName.trim(),
      email: email.trim(),
      category: category.trim(),
      description: description.trim(),
      priority: priority.trim(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    requests.unshift(newRequest); // Add to beginning of list
    await writeRequests(requests);

    res.status(201).json({
      message: 'Request submitted successfully',
      request: newRequest
    });
  } catch (error) {
    console.error('Error saving request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// 4. PUT /api/requests/:id - Update an existing request
app.put('/api/requests/:id', async (req, res) => {
  try {
    const requestId = req.params.id;
    const requests = await readRequests();
    const index = requests.findIndex((r) => String(r.id) === String(requestId));

    if (index === -1) {
      return res.status(404).json({ error: `Request with ID ${requestId} not found` });
    }

    const current = requests[index];
    const { studentName, email, category, description, priority, status } = req.body;

    // Update allowable fields if provided
    requests[index] = {
      ...current,
      studentName: studentName !== undefined ? studentName.trim() : current.studentName,
      email: email !== undefined ? email.trim() : current.email,
      category: category !== undefined ? category.trim() : current.category,
      description: description !== undefined ? description.trim() : current.description,
      priority: priority !== undefined ? priority.trim() : current.priority,
      status: status !== undefined ? status.trim() : current.status,
      updatedAt: new Date().toISOString()
    };

    await writeRequests(requests);

    res.status(200).json({
      message: 'Request updated successfully',
      request: requests[index]
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// 5. DELETE /api/requests/:id - Delete a request
app.delete('/api/requests/:id', async (req, res) => {
  try {
    const requestId = req.params.id;
    const requests = await readRequests();
    const index = requests.findIndex((r) => String(r.id) === String(requestId));

    if (index === -1) {
      return res.status(404).json({ error: `Request with ID ${requestId} not found` });
    }

    const deletedRequest = requests.splice(index, 1)[0];
    await writeRequests(requests);

    res.status(200).json({
      message: 'Request deleted successfully',
      request: deletedRequest
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

// Fallback route to serve index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` Campus Help Desk Server running at:`);
  console.log(` http://localhost:${PORT}`);
  console.log(` Data storage: ${DATA_FILE}`);
  console.log(`=============================================`);
});
