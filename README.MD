<<<<<<< HEAD
# 🚑 Smart Resource Allocation — Backend API

Production-ready Node.js + Express + MongoDB backend for an AI-powered disaster/resource allocation system.

---

## 📦 Tech Stack

| Layer        | Technology             |
|--------------|------------------------|
| Runtime      | Node.js 18+            |
| Framework    | Express.js 4           |
| Database     | MongoDB + Mongoose 8   |
| ML Bridge    | Axios                  |
| Config       | dotenv                 |

---

## 🚀 Quick Start

```bash
# 1. Clone & enter directory
cd smart-resource-allocation

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Start server
npm start          # production
npm run dev        # development (nodemon)
```

---

## ⚙️ Environment Variables

| Variable       | Default                                              | Description                      |
|----------------|------------------------------------------------------|----------------------------------|
| `PORT`         | `5000`                                               | HTTP server port                 |
| `MONGO_URI`    | `mongodb://localhost:27017/smart_resource_allocation`| MongoDB connection string        |
| `ML_BASE_URL`  | `http://127.0.0.1:8000`                              | Base URL of the ML microservice  |
| `ML_TIMEOUT_MS`| `30000`                                              | ML request timeout in ms         |

---

## 📁 Project Structure

```
smart-resource-allocation/
├── server.js                  # Entry point
├── .env.example               # Environment template
├── config/
│   └── db.js                  # MongoDB connection
├── models/
│   ├── Report.js
│   ├── Volunteer.js
│   └── Assignment.js
├── routes/
│   ├── reportRoutes.js
│   ├── volunteerRoutes.js
│   └── dashboardRoutes.js
├── controllers/
│   ├── reportController.js
│   ├── volunteerController.js
│   └── dashboardController.js
└── services/
    └── mlService.js           # ML /ai-agent integration
```

---

## 🌐 API Reference

### `GET /health`
Health check endpoint.

```json
{ "status": "ok", "service": "Smart Resource Allocation API", "timestamp": "..." }
```

---

### `POST /upload-report`
Submit an NGO field report for AI processing.

**Request body:**
```json
{
  "ngo_name": "ABC NGO",
  "location": "Kolkata",
  "report_text": "Flood situation — 500 families displaced",
  "people_affected": 500
}
```

**Flow:** Save → Fetch volunteers → Call ML `/ai-agent` → Store `ai_result` → Create assignments → Respond

**Response `200`:**
```json
{
  "message": "Report processed successfully",
  "report_id": "<ObjectId>",
  "ai_result": { ... }
}
```

**Errors:** `400 validation_error` | `500 internal_server_error`

---

### `POST /register-volunteer`
Register a new volunteer.

**Request body:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "skills": ["medical", "logistics"],
  "location": "Kolkata",
  "availability": "weekends"
}
```

**Response `201`:**
```json
{ "message": "Volunteer registered successfully" }
```

**Errors:** `400 validation_error` | `409 duplicate_volunteer`

---

### `GET /community-needs`
Aggregated need analysis from all AI-processed reports.

**Response `200`:**
```json
[
  {
    "need_type": "Food",
    "location": "Kolkata",
    "urgency": "high",
    "people_affected": 200,
    "lat": 22.5726,
    "lng": 88.3639
  }
]
```

---

### `GET /assignments`
All task assignments, sorted by urgency (critical → high → medium → low).

**Response `200`:**
```json
[
  {
    "title": "Food Distribution Support",
    "location": "West Bengal",
    "urgency": "high"
  }
]
```

---

## 🤖 ML Service Integration

The ML microservice is called at `POST {ML_BASE_URL}/ai-agent` with:

```json
{
  "text": "<report_text>",
  "volunteers": [ ...sortedByScore ]
}
```

Expected response shape (fields used by backend):

```json
{
  "need_analysis": [
    { "need_type": "Food", "location": "...", "urgency": "high", "people_affected": 200 }
  ],
  "tasks": [
    { "title": "...", "location": "...", "urgency": "...", "assigned_volunteers": [] }
  ],
  "decision_trace": { ... }
}
```

If the ML service is unavailable, the report is still saved with a degraded `ai_result` and a single fallback assignment is created — the system **never hard-fails** on ML errors.

---

## ⚠️ Error Response Format

All errors follow this shape:

```json
{
  "error": "error_type_slug",
  "message": "Human readable description"
}
```

| Error type            | HTTP | When                                      |
|-----------------------|------|-------------------------------------------|
| `validation_error`    | 400  | Missing / invalid request fields          |
| `duplicate_volunteer` | 409  | Phone already registered                  |
| `not_found`           | 404  | Unknown endpoint                          |
| `ml_timeout`          | —    | ML service exceeded timeout               |
| `ml_unreachable`      | —    | ML service connection refused             |
| `ml_error`            | —    | ML returned non-2xx response              |
| `internal_server_error`| 500 | Unexpected server error                   |
=======
# Smart-Resour-Allocation
>>>>>>> 07cc5767d106e3e0fe62d921bdaf7362bd0cefcf
