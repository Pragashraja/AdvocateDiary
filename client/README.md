# Advocate Diary - Frontend (React + Vite)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Project Structure

```
client/
├── public/                  # Static assets
├── src/
│   ├── assets/             # Images, fonts
│   ├── components/         # React components
│   │   ├── common/         # Reusable components
│   │   ├── auth/           # Auth components
│   │   ├── cases/          # Case components
│   │   ├── clients/        # Client components
│   │   ├── calendar/       # Calendar components
│   │   └── documents/      # Document components
│   ├── pages/              # Page components
│   ├── context/            # React Context
│   ├── services/           # API services
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utility functions
│   ├── styles/             # CSS files
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── router.jsx          # Routes configuration
├── index.html
├── vite.config.js
└── package.json
```

## Environment Variables

Edit `.env.development` for local development:
```
VITE_API_URL=http://localhost:5000/api
```

For production, edit `.env.production` with your production API URL.
