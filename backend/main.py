from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

tasks = {}

class TaskCreate(BaseModel):
    title: str

class TaskUpdate(BaseModel):
    completed: bool

@app.get("/")
def root():
    return {"message": "Task Manager API is running", "endpoints": ["/tasks", "/docs"]}

@app.get("/tasks")
def get_tasks():
    return sorted(tasks.values(), key=lambda t: t["createdAt"], reverse=True)

@app.post("/tasks", status_code=201)
def create_task(task: TaskCreate):
    if not task.title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    task_id = str(uuid.uuid4())
    new_task = {
        "id": task_id,
        "title": task.title.strip(),
        "completed": False,
        "createdAt": datetime.now().isoformat()
    }
    tasks[task_id] = new_task
    return new_task

@app.patch("/tasks/{task_id}")
def update_task(task_id: str, update: TaskUpdate):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    tasks[task_id]["completed"] = update.completed
    return tasks[task_id]

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    del tasks[task_id]
    return {"message": "Task deleted"}