# Task Manager

A small full-stack task manager built as a practical assignment. The application lets a user create, view, update, filter, and delete tasks through a React frontend and a FastAPI backend.

## Overview

This project was intentionally kept compact so the focus stays on core full-stack fundamentals:

- clean component structure
- simple REST API design
- validation and error handling
- basic persistence trade-offs
- a usable, responsive interface

The backend stores tasks in memory, while the frontend mirrors the list in `localStorage` so the UI stays useful after a refresh during development.

## Tech Stack

### Frontend

- React 19
- Vite
- Plain CSS
- Browser `localStorage` for local cache

### Backend

- FastAPI
- Pydantic
- Uvicorn

### Testing and Tooling

- Pytest for backend tests
- Docker and Docker Compose for containerized startup

## Features

### Core Features

- Create tasks with validation
- View all tasks in a task list
- Mark a task as completed or active
- Delete tasks with confirmation
- Show loading and error states
- Return structured JSON responses from the API

### Bonus Features Included

- Filter tasks by all, active, or completed
- Edit a task title inline
- Persist task state in `localStorage` for reloads
- Backend tests for API behavior
- Docker support for both frontend and backend

## Project Structure

```text
TaskManager/
├── backend/
│   ├── main.py
│   ├── tests/
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

## How It Works

### Frontend Flow

The React app fetches the task list on load, renders it in a clean card layout, and sends API calls for task creation, completion toggles, deletion, and title editing. It also keeps a cached copy in `localStorage` so tasks remain visible immediately on refresh while the API reconnects.

### Backend Flow

The FastAPI app exposes a simple REST API with validation on incoming data. Each task includes:

- `id`
- `title`
- `completed`
- `createdAt`

The backend returns clear JSON responses and handles common error cases like missing tasks or invalid update payloads.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/tasks` | Return all tasks |
| POST | `/tasks` | Create a new task |
| PATCH | `/tasks/{id}` | Update completion status or title |
| DELETE | `/tasks/{id}` | Delete a task |

## Setup Instructions

### Prerequisites

- Python 3.13+
- Node.js 22+
- npm
- uv
- Docker and Docker Compose if you want containerized startup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd TaskManager
```

### 2. Run the backend locally

```bash
cd backend
uv run uvicorn main:app --reload
```

Backend URL:

- http://localhost:8000

API docs:

- http://localhost:8000/docs

### 3. Run the frontend locally

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

- http://localhost:5173

## Testing

Run backend tests with:

```bash
cd backend
uv run pytest
```

Current test coverage includes:

- task creation and listing
- empty title validation
- patching task completion and title
- rejecting empty patch payloads
- deleting tasks

## Docker

You can run both services together with Docker Compose:

```bash
docker compose up --build
```

This starts:

- backend on port `8000`
- frontend on port `5173`

## Configuration Notes

- The frontend reads the API URL from `VITE_API_URL` when provided.
- The default API fallback is `http://127.0.0.1:8000` for local development.
- The backend allows localhost and `127.0.0.1` origins for Vite development.

## Trade-offs

- Task storage is in memory, so data resets when the backend restarts.
- Frontend persistence uses `localStorage`, which is enough for this assignment but not a substitute for a real database.
- The UI is intentionally simple and focused on usability rather than visual complexity.

## Assumptions

- The assignment is meant to stay small and practical.
- A database is not required.
- Bonus items were added only where they fit the scope without making the project unnecessarily heavy.

## Useful Links

- Frontend app: http://localhost:5173
- Backend API: http://localhost:8000
- Backend docs: http://localhost:8000/docs
