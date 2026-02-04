"use client";

import { useEffect, useMemo, useState } from "react";
import { taskApi } from "@/app/api/task.api";
import type { Task, TaskPayload } from "@/app/lib/task.types";
import { isDueToday, isMissed } from "@/app/lib/task.utils";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const pendingTasks = useMemo(() => tasks.filter((t) => !t.status), [tasks]);
    const completedTasks = useMemo(() => tasks.filter((t) => t.status), [tasks]);
    const missedTasks = useMemo(() => tasks.filter((t) => isMissed(t)), [tasks]);

    const upcomingTasks = useMemo(
        () => tasks.filter((t) => !t.status && isDueToday(t)),
        [tasks]
    );

    const fetchTasks = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await taskApi.getTasks();
            setTasks(res.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const saveTask = async (payload: TaskPayload, id?: string) => {
        setError("");

        if (id) {
            const res = await taskApi.updateTask(id, payload);
            const updated = res.data;
            setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
            return;
        }

        const res = await taskApi.createTask(payload);
        const created = res.data;
        setTasks((prev) => [created, ...prev]);
    };

    const deleteTask = async (id: string) => {
        setError("");
        await taskApi.deleteTask(id);
        setTasks((prev) => prev.filter((t) => t._id !== id));
    };

    const toggleStatus = async (task: Task) => {
        const res = await taskApi.updateTask(task._id, { status: !task.status });
        const updated = res.data;
        setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
    };

    const fetchMissedTasks = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await taskApi.getMissedTasks();
            setTasks(res.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load missed tasks");
        } finally {
            setLoading(false);
        }
    };

    return {
        tasks,
        pendingTasks,
        completedTasks,
        upcomingTasks,
        missedTasks,
        loading,
        error,
        saveTask,
        deleteTask,
        toggleStatus,
        refetch: fetchTasks,
        fetchMissedTasks,
    };
}
