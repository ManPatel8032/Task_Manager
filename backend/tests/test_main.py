import pathlib
import sys

from fastapi.testclient import TestClient

sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))

from main import app, tasks


client = TestClient(app)


def setup_function():
    tasks.clear()


def test_create_and_list_tasks():
    create_response = client.post("/tasks", json={"title": "Write tests"})
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["title"] == "Write tests"
    assert created["completed"] is False
    assert "id" in created
    assert "createdAt" in created

    list_response = client.get("/tasks")
    assert list_response.status_code == 200
    listed = list_response.json()
    assert len(listed) == 1
    assert listed[0]["id"] == created["id"]


def test_create_task_rejects_empty_title():
    response = client.post("/tasks", json={"title": "   "})
    assert response.status_code == 422


def test_patch_task_completion_and_title():
    created = client.post("/tasks", json={"title": "Initial"}).json()
    task_id = created["id"]

    completion_response = client.patch(f"/tasks/{task_id}", json={"completed": True})
    assert completion_response.status_code == 200
    assert completion_response.json()["completed"] is True

    title_response = client.patch(f"/tasks/{task_id}", json={"title": "Updated title"})
    assert title_response.status_code == 200
    assert title_response.json()["title"] == "Updated title"


def test_patch_task_requires_at_least_one_field():
    created = client.post("/tasks", json={"title": "Needs update payload"}).json()
    response = client.patch(f"/tasks/{created['id']}", json={})
    assert response.status_code == 400
    assert response.json()["detail"] == "Provide at least one field to update"


def test_delete_task():
    created = client.post("/tasks", json={"title": "Delete me"}).json()
    task_id = created["id"]

    delete_response = client.delete(f"/tasks/{task_id}")
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == "Task deleted"

    list_response = client.get("/tasks")
    assert list_response.status_code == 200
    assert list_response.json() == []
