import { apiFetch } from "@/app/lib/http";
import type { Task, TaskPayload } from "../lib/task.types";

export const taskApi = {
    getTasks: () => apiFetch<{ data: Task[] }>("/tasks"),

    getUpcomingTasks: () => apiFetch<{ data: Task[] }>("/tasks/upcoming"),

    getTaskById: (id: string) => apiFetch<{ data: Task }>(`/tasks/${id}`),

    createTask: (payload: TaskPayload) =>
        apiFetch<{ data: Task }>("/tasks", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    updateTask: (id: string, payload: Partial<TaskPayload>) =>
        apiFetch<{ data: Task }>(`/tasks/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        }),

    setCompleted: (id: string, status: boolean) =>
        apiFetch<{ data: Task }>(`/tasks/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        }),

    deleteTask: (id: string) =>
        apiFetch(`/tasks/${id}`, {
            method: "DELETE",
        }),

    getMissedTasks: () => apiFetch<{ data: Task[] }>("/tasks/missed"),

};
