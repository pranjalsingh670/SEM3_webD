# Assignment 5: Campus Help Desk (Mini Project)

A complete full-stack web application developed for students to submit, track, update, and manage campus-related problems and service requests.

---

## 📋 Features

- **Responsive Frontend Interface**:
  - **Submission Form**:
    - Student Name
    - Email Address
    - Category (Hostel, Academic, IT & Wi-Fi, Infrastructure, Mess & Canteen, Library, Sports, Other)
    - Problem Description
    - Priority (Low, Medium, High, Urgent)
  - **Live Request Feed**: Displays all submitted requests below the form.
  - **Dynamic Statistics**: Total, Pending, In Progress, and Resolved request counters.
  - **Filter & Search**: Real-time filtering by category, status, and free-text search.
  - **Edit & Update Modal**: Update request details, priority, or status in real time.
  - **Quick Status Selector**: Change status directly from each card.
  - **Delete Request**: Remove requests with safety confirmation.
  - **Interactive Feedback**: Toast notifications for user actions.

- **RESTful Express.js Backend**:
  - `GET /api/requests` - Fetch all submitted requests.
  - `GET /api/requests/:id` - Fetch details for a specific request.
  - `POST /api/requests` - Submit and store a new request.
  - `PUT /api/requests/:id` - Update an existing request.
  - `DELETE /api/requests/:id` - Delete a request by ID.

- **Node.js `fs` Module Data Persistence**:
  - All requests are persistently stored in `requests.json`.

- **Pure JavaScript `fetch()` API**:
  - Asynchronous HTTP calls for GET, POST, PUT, and DELETE operations without page reload.

---

## 📁 Project Structure

```
Campus help desk/
├── node_modules/             # Installed dependencies (Express, CORS)
├── public/
│   ├── index.html            # Main UI (Form + Requests Feed + Edit Modal)
│   ├── style.css             # Responsive styling with modern color-coded badges
│   └── app.js                # Frontend logic using fetch() API
├── requests.json             # Persistent JSON database (managed via Node.js fs)
├── server.js                 # Express server with RESTful API routes
├── package.json              # Project configuration and start scripts
├── package-lock.json         # Dependency lockfile
└── README.md                 # Project documentation
```

---

## 🚀 How to Run the Project

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start the Express server**:
   ```bash
   npm start
   ```
   *(or `node server.js`)*

3. **Open the application**:
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `GET` | `/api/requests` | *None* | Retrieves all campus requests from `requests.json` |
| `GET` | `/api/requests/:id` | *None* | Retrieves a specific request by its unique ID |
| `POST` | `/api/requests` | `{ studentName, email, category, priority, description }` | Validates and appends a new request to `requests.json` |
| `PUT` | `/api/requests/:id` | `{ studentName?, email?, category?, priority?, status?, description? }` | Updates fields of an existing request |
| `DELETE` | `/api/requests/:id` | *None* | Deletes a request from `requests.json` |
