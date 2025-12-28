# Advocate Diary - Backend (Flask API)

## Setup

1. Create virtual environment:
```bash
python -m venv venv
```

2. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Setup environment variables:
```bash
copy .env.example .env
```
Edit `.env` with your database credentials.

5. Initialize database:
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

6. Run server:
```bash
python run.py
```

Server runs on `http://localhost:5000`

## API Documentation

See `/docs/API.md` in the project root for complete API documentation.

## Project Structure

```
server/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── config.py            # Configuration
│   ├── extensions.py        # Flask extensions
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── schemas/             # Marshmallow schemas
│   ├── services/            # Business logic
│   ├── middleware/          # Middleware
│   └── utils/               # Helper functions
├── migrations/              # Database migrations
├── tests/                   # Unit tests
├── uploads/                 # File uploads
├── run.py                   # Entry point
└── requirements.txt         # Dependencies
```
