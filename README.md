# Project Setup

This repository has two parts:

- `backend/` for the Flask API and analysis services
- `frontend/` for the Vite React app

## Prerequisites

- Python 3.10+ recommended
- Node.js 18+ recommended
- npm (included with Node.js)

## Install Dependencies

### Backend

```powershell
cd backend
..\venv\Scripts\python.exe -m pip install -r requirements.txt
```

If you do not already have a virtual environment, create one from the project root:

```powershell
python -m venv venv
cd backend
..\venv\Scripts\python.exe -m pip install -r requirements.txt
```

Copy `backend/.env.example` to `backend/.env` and set a `SECRET_KEY`. Tokens are optional for public repositories, but required for private repositories.

### Frontend

```powershell
cd frontend
npm ci
```

## Run the Project

### Backend

```powershell
cd backend
..\venv\Scripts\python.exe app.py
```

### Frontend

```powershell
cd frontend
npm run dev
```

## Notes

- The backend creates `backend/data/app.db` automatically on first startup.
- Copy `frontend/.env.example` to `frontend/.env.local` if the API is not running at `http://localhost:5000/api`.
- The frontend dependencies are defined in [frontend/package.json](frontend/package.json).
- The backend dependencies are defined in [backend/requirements.txt](backend/requirements.txt).