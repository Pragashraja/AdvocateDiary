# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All endpoints except `/auth/register` and `/auth/login` require JWT authentication.

Include the token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Auth Endpoints

### Register
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "advocate@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "bar_council_id": "BC12345",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "advocate@example.com",
    "full_name": "John Doe"
  }
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "advocate@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJ0eXAiOiJKV1...",
  "refresh_token": "eyJ0eXAiOiJKV1...",
  "user": {
    "id": 1,
    "email": "advocate@example.com",
    "full_name": "John Doe",
    "bar_council_id": "BC12345"
  }
}
```

### Get Current User
```http
GET /api/auth/me
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "advocate@example.com",
  "full_name": "John Doe",
  "bar_council_id": "BC12345",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

---

## Client Endpoints

### Get All Clients
```http
GET /api/clients
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Client Name",
    "email": "client@example.com",
    "phone": "9876543210",
    "created_at": "2024-01-01T00:00:00"
  }
]
```

### Get Client by ID
```http
GET /api/clients/:id
```

### Create Client
```http
POST /api/clients
```

**Request Body:**
```json
{
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "9876543210",
  "address": "456 Client St",
  "notes": "Important client notes"
}
```

### Update Client
```http
PUT /api/clients/:id
```

### Delete Client
```http
DELETE /api/clients/:id
```

---

## Case Endpoints

### Get All Cases
```http
GET /api/cases
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "case_number": "CASE001",
    "title": "Case Title",
    "case_type": "Civil",
    "court_name": "District Court",
    "status": "Active",
    "filing_date": "2024-01-01",
    "client": {
      "id": 1,
      "name": "Client Name"
    },
    "created_at": "2024-01-01T00:00:00"
  }
]
```

### Get Case by ID
```http
GET /api/cases/:id
```

### Create Case
```http
POST /api/cases
```

**Request Body:**
```json
{
  "client_id": 1,
  "case_number": "CASE001",
  "title": "Case Title",
  "case_type": "Civil",
  "court_name": "District Court",
  "filing_date": "2024-01-01",
  "status": "Active",
  "description": "Case description",
  "notes": "Case notes"
}
```

### Update Case
```http
PUT /api/cases/:id
```

### Delete Case
```http
DELETE /api/cases/:id
```

---

## Document Endpoints

### Get Documents for Case
```http
GET /api/documents/case/:case_id
```

### Upload Document
```http
POST /api/documents/upload
```

**Request Body:** (multipart/form-data)
- `file`: Document file
- `case_id`: Case ID
- `title`: Document title
- `description`: Document description (optional)

### Delete Document
```http
DELETE /api/documents/:id
```

---

## Calendar Endpoints

### Get All Events
```http
GET /api/calendar
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Court Hearing",
    "description": "Hearing description",
    "event_type": "Hearing",
    "event_date": "2024-01-15T10:00:00",
    "location": "Court Room 5",
    "is_completed": false,
    "case": {
      "id": 1,
      "case_number": "CASE001",
      "title": "Case Title"
    }
  }
]
```

### Get Event by ID
```http
GET /api/calendar/:id
```

### Create Event
```http
POST /api/calendar
```

**Request Body:**
```json
{
  "title": "Court Hearing",
  "description": "Hearing description",
  "event_type": "Hearing",
  "event_date": "2024-01-15T10:00:00",
  "location": "Court Room 5",
  "reminder_time": 30,
  "case_id": 1
}
```

### Update Event
```http
PUT /api/calendar/:id
```

### Delete Event
```http
DELETE /api/calendar/:id
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "An unexpected error occurred"
}
```
