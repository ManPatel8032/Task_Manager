from datetime import datetime, timezone
import uuid

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

app = FastAPI()

# CORS: allow any local dev port (Vite may use 5173, 5174, etc.). Browser preflight must succeed.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_methods=["*"],
    allow_headers=["*"],
)

tasks: dict[str, dict] = {}


class Task(BaseModel):
    id: str
    title: str
    completed: bool
    createdAt: str


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1)

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        title = value.strip()
        if not title:
            raise ValueError("Title cannot be empty")
        return title


class TaskUpdate(BaseModel):
    completed: bool | None = None
    title: str | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str | None) -> str | None:
        if value is None:
            return value
        title = value.strip()
        if not title:
            raise ValueError("Title cannot be empty")
        return title


@app.get("/")
def root():
    return {"message": "Task Manager API is running", "endpoints": ["/tasks", "/docs"]}


@app.get("/tasks", response_model=list[Task])
def get_tasks() -> list[Task]:
    return sorted(tasks.values(), key=lambda t: t["createdAt"], reverse=True)


@app.post("/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate) -> Task:
    task_id = str(uuid.uuid4())
    new_task = {
        "id": task_id,
        "title": task.title,
        "completed": False,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    tasks[task_id] = new_task
    return new_task


@app.patch("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, update: TaskUpdate) -> Task:
    if task_id not in tasks:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    if update.completed is None and update.title is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide at least one field to update",
        )

    if update.completed is not None:
        tasks[task_id]["completed"] = update.completed
    if update.title is not None:
        tasks[task_id]["title"] = update.title

    return tasks[task_id]


@app.delete("/tasks/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    del tasks[task_id]
    return {"message": "Task deleted"}
