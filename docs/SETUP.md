# Setup Guide

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Git

## Backend Setup

### 1. Navigate to server directory
```bash
cd server
```

### 2. Create virtual environment
```bash
python -m venv venv
```

### 3. Activate virtual environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 4. Install dependencies
```bash
pip install -r requirements.txt
```

### 5. Setup MySQL Database

Create a new MySQL database:
```sql
CREATE DATABASE advdiary_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6. Configure environment variables

Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

Edit `.env` and update the following:
```
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/advdiary_db
```

### 7. Initialize database migrations
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 8. Run the Flask server
```bash
python run.py
```

Backend should now be running on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to client directory
```bash
cd client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

The `.env.development` file is already configured for local development.

### 4. Run the development server
```bash
npm run dev
```

Frontend should now be running on `http://localhost:5173`

## Verify Installation

1. Open browser and go to `http://localhost:5173`
2. You should see the login page
3. Click "Register" to create a new account
4. After registration, login with your credentials

## Database Migrations

When you make changes to models:

```bash
cd server
flask db migrate -m "Description of changes"
flask db upgrade
```

## Production Build

### Backend
```bash
cd server
# Use gunicorn or uwsgi
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

### Frontend
```bash
cd client
npm run build
# Serve the dist/ folder with nginx or any static file server
```

## Troubleshooting

### Database connection error
- Verify MySQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### CORS errors
- Check CORS configuration in server/app/__init__.py
- Verify frontend URL matches CORS allowed origins

### JWT authentication errors
- Ensure JWT_SECRET_KEY is set in .env
- Check token expiration settings
