# Task Manager

Small full-stack assignment: React (Vite) + FastAPI, in-memory tasks, `fetch` API, optional local cache and Docker.

## Quick start (local)

**Backend** (from repo root):

```bash
cd backend
uv run uvicorn main:app --reload
```

- API: http://127.0.0.1:8000  
- Docs: http://127.0.0.1:8000/docs  

**Frontend**:

```bash
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173  

The UI defaults to `http://127.0.0.1:8000` if `VITE_API_URL` is unset. If tasks fail to load, start the backend first and check the browser devtools Network tab for `/tasks`.

## Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:8000  

`docker-compose.yml` sets `VITE_API_URL=http://127.0.0.1:8000` so the **browser** (on your host) talks to the published backend port, not the internal Docker hostname.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/tasks` | List tasks |
| POST | `/tasks` | Create task (`title`, validated) |
| PATCH | `/tasks/{id}` | Update `completed` and/or `title` |
| DELETE | `/tasks/{id}` | Delete task |

## Features

- CRUD tasks, loading and error UI with retry  
- Filters: All / Active / Completed  
- Inline title edit  
- Delete confirmation  
- `localStorage` cache (UI convenience; server is source of truth when online)  
- Backend tests (`pytest`)  
- CORS allows `localhost` / `127.0.0.1` on any port (fixes preflight failures when Vite uses a non-5173 port)  

## Tests

```bash
cd backend
uv run pytest
```

## Trade-offs

- Tasks live in memory: restarting the backend clears server data.  
- `localStorage` only helps the UI between reloads; it does not replace a database.  

## Project layout

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
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```
