# Project Setup

This repository has two parts:

- `backend/` for the Flask API and analysis services
- `frontend/` for the Vite React app

## Prerequisites

- Python 3.10+ recommended
- Node.js 18+ recommended
- `pnpm` for the frontend dependencies

## Install Dependencies

### Backend

```powershell
cd backend
pip install -r requirements.txt
```

### Frontend

```powershell
cd frontend
pnpm install
```

## Run the Project

### Backend

```powershell
cd backend
python app.py
```

### Frontend

```powershell
cd frontend
pnpm dev
```

## Notes

- If you do not have `pnpm` installed, install it first with `npm install -g pnpm`.
- The frontend dependencies are defined in [frontend/package.json](frontend/package.json).
- The backend dependencies are defined in [backend/requirements.txt](backend/requirements.txt).