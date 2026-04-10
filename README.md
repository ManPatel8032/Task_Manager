# Task Manager

A small full-stack task list app for learning or technical assignments: **FastAPI** (Python) backend, **React + Vite** frontend, REST over **`fetch`**, in-memory storage, optional **Docker** and **pytest** tests.

---

## Prerequisites

Install these before running locally (versions are what this repo is tested against; slightly older Node may work but is not guaranteed).

| Tool | Version | Used for |
| --- | --- | --- |
| **Python** | 3.11+ (`requires-python` in `backend/pyproject.toml`) | Backend API |
| **[uv](https://docs.astral.sh/uv/)** | Latest | Install Python deps and run Uvicorn / pytest |
| **Node.js** | 20 LTS or newer recommended | Frontend dev server and build |
| **npm** | Comes with Node | Install frontend packages |
| **Docker Desktop** (optional) | Recent | `docker compose` workflow |
| **Git** | Any recent | Clone the repository |

**Notes**

- **Windows / macOS / Linux**: Backend and frontend commands below assume a normal shell (`PowerShell`, `bash`, or `zsh`).
- **Python versions**: The backend supports **3.11, 3.12, or 3.13** (see `requires-python` in `backend/pyproject.toml`). Use whichever you have installed; `uv` will create `.venv` with that interpreter.
- First time in `backend/`, run `uv sync` (or rely on `uv run`, which can sync on demand) so dependencies from `pyproject.toml` / `uv.lock` are installed.
- First time in `frontend/`, run `npm install`.
- **OneDrive / synced folders**: If `uv sync` or `uv run` fails with **Access is denied** under `backend/.venv`, Windows may be locking files. Close terminals/IDE using that folder, delete `backend/.venv`, and run `uv sync` again—or move the repo to a non-synced path (for example `C:\dev\TaskManager`).
- **`failed to locate pyvenv.cfg`**: Your `backend/.venv` is incomplete (sync or install was interrupted). From `backend/`, delete the `.venv` folder, then run `uv sync` again. This repo sets `link-mode = "copy"` in `pyproject.toml` so `uv` is less likely to leave a half-written venv on Windows.

---

## Clone and install

```bash
git clone <repository-url>
cd TaskManager
```

**Backend dependencies**

```bash
cd backend
uv sync
```

**Frontend dependencies**

```bash
cd ../frontend
npm install
```

---

## Run locally

Start the **backend** first, then the **frontend** (the UI calls `http://127.0.0.1:8000` by default).

### Backend

From the `backend` folder:

```bash
uv run uvicorn main:app --reload
```

- **API base URL:** http://127.0.0.1:8000  
- **Interactive docs:** http://127.0.0.1:8000/docs  

### Frontend

From the `frontend` folder:

```bash
npm run dev
```

- **App:** http://localhost:5173 (Vite may print a different port if 5173 is busy—use the URL shown in the terminal.)

### Troubleshooting

- **“Could not load tasks” / Failed to fetch:** Ensure the backend is running and reachable at the URL in `VITE_API_URL` (see Configuration). Check the browser **Network** tab for `/tasks` and any CORS errors.
- **Wrong API host:** Set `VITE_API_URL` before starting Vite if the API is not on `127.0.0.1:8000`.
- **`failed to locate pyvenv.cfg` when running `uv run`:** The virtualenv under `backend/.venv` is broken. In PowerShell from `backend/`:

  ```powershell
  Remove-Item -Recurse -Force .venv
  uv sync
  uv run uvicorn main:app --reload
  ```

  If removal fails, close Cursor/VS Code and any terminal using that folder, then retry (OneDrive often locks files).

---

## Configuration

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Frontend (env file or shell) | Base URL for API calls. If unset, defaults to `http://127.0.0.1:8000`. |

Example (PowerShell):

```powershell
cd frontend
$env:VITE_API_URL="http://127.0.0.1:8000"; npm run dev
```

Example (bash):

```bash
cd frontend
VITE_API_URL=http://127.0.0.1:8000 npm run dev
```

---

## Docker (optional)

Requires **Docker** and **Docker Compose** (included with Docker Desktop).

From the repository root:

```bash
docker compose up --build
```

- **Frontend:** http://localhost:5173  
- **Backend:** http://localhost:8000  

`docker-compose.yml` sets `VITE_API_URL=http://127.0.0.1:8000` so the **browser on your machine** talks to the backend through the published host port (not the internal Docker service name).

---

## API reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/tasks` | List all tasks |
| `POST` | `/tasks` | Create a task (JSON body: `{ "title": "..." }`, non-empty after trim) |
| `PATCH` | `/tasks/{id}` | Update `completed` and/or `title` (at least one field required) |
| `DELETE` | `/tasks/{id}` | Delete a task |

Task shape: `id`, `title`, `completed`, `createdAt` (ISO timestamp).

---

## Features

- Create, list, toggle completion, edit title, delete (with confirm)
- Filters: All / Active / Completed and a remaining count
- Loading and error states with **Retry**
- `localStorage` cache for a smoother reload (server remains source of truth when online)
- CORS configured for `localhost` / `127.0.0.1` on any port (typical Vite dev)

---

## Tests

Backend API tests use **pytest**:

```bash
cd backend
uv run pytest
```

Coverage includes create/list, empty title validation, patch completion and title, empty patch rejection, and delete.

---

## Production build (frontend)

```bash
cd frontend
npm run build
```

Output is in `frontend/dist/`. Serve it with any static host; point `VITE_API_URL` at your deployed API when **building** (Vite bakes env at build time).

---

## Project structure

```text
TaskManager/
├── backend/
│   ├── main.py           # FastAPI app
│   ├── tests/            # pytest
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/
│   ├── src/              # React app (App, api, components)
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```
