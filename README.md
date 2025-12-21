# Basic Interview Case

Case for interviewing frontend developers

## Project Structure

```
basic_interview_case/
├── backend/          # Express.js API server
├── frontend/         # React + TypeScript (Vite)
└── package.json      # Root package with helper scripts
```

## Setup

### Install all dependencies
```bash
npm run install:all
```

Or install individually:
```bash
npm install              # Root dependencies
npm install --prefix backend
npm install --prefix frontend
```

## Running the Application

### Development Mode (Both servers)
```bash
npm run dev
```

### Run servers individually
```bash
npm run dev:backend    # Backend on port 5000
npm run dev:frontend   # Frontend on port 5173
```

### Production Mode
```bash
npm run start:backend
npm run start:frontend
```

## Backend (Express.js)

- **Port**: 5000 (default)
- **API Endpoints**:
  - `GET /api` - Welcome message
  - `GET /api/health` - Health check

### Environment Variables
Copy `.env.example` to `.env` in the backend folder and configure as needed.

## Frontend (React + TypeScript)

- **Port**: 5173 (Vite default)
- **Template**: React with TypeScript
- **Build Tool**: Vite

## Technologies

- **Backend**: Express.js, CORS, dotenv
- **Frontend**: React, TypeScript, Vite
- **Dev Tools**: Nodemon, Concurrently
