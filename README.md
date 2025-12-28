# Advocate Daily Case Diary

A full-stack web application for advocates (lawyers) to manage their daily case diary, clients, documents, and calendar events.

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Context API for state management

### Backend
- Python Flask REST API
- MySQL database
- SQLAlchemy ORM
- Flask-JWT-Extended for authentication
- Flask-CORS for cross-origin requests

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Case Management**: Create, update, delete, and track legal cases
- **Client Management**: Maintain detailed client records
- **Hearing History**: Track all hearing updates with dates and court orders
- **Hearings Dashboard**: View all hearings across cases in a centralized table
- **Calendar Integration**: Automatic calendar events for upcoming hearings
- **Document Management**: Upload and manage case-related documents
- **Responsive Design**: Works on desktop and mobile devices
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Project Structure

```
advdiary/
├── client/          # React frontend
├── server/          # Flask backend
├── database/        # Database migrations
└── docs/            # Documentation
```

## Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/advdiary.git
   cd advdiary
   ```

2. **Set up environment variables**
   ```bash
   cd server && cp .env.example .env && cd ..
   cd client && cp .env.example .env && cd ..
   ```

3. **Start with Docker**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

See [DOCKER.md](DOCKER.md) for detailed Docker documentation.

### Manual Setup

#### Backend
```bash
cd server
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
cp .env.example .env
flask db upgrade
python run.py
```

#### Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

## Documentation

- [DOCKER.md](DOCKER.md) - Docker setup and deployment guide
- Database schema available in `database/schema.sql`
- API endpoints documented in code comments

## License

MIT
