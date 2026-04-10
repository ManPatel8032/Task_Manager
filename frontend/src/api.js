const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const parseError = async (res, fallback) => {
  try {
    const data = await res.json();
    return data?.detail || fallback;
  } catch {
    return fallback;
  }
};

export const getTasks = async () => {
  const res = await fetch(`${BASE}/tasks`);
  if (!res.ok) throw new Error(await parseError(res, "Failed to fetch tasks"));
  return res.json();
};

export const createTask = async (title) => {
  const res = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to create task"));
  return res.json();
};

export const toggleTask = async (id, completed) => {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to update task"));
  return res.json();
};

export const updateTaskTitle = async (id, title) => {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to update task"));
  return res.json();
};

export const deleteTask = async (id) => {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to delete task"));
  return res.json();
};