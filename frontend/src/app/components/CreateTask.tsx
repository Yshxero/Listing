"use client";

import { useEffect, useMemo, useState } from "react";
import type { Task, TaskPayload } from "@/app/lib/task.types";

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingTask: Task | null;
    onSave: (payload: TaskPayload, id?: string) => void | Promise<void>;
}

const CATEGORIES = ["School/Office Work", "Grocery", "Personal"] as const;

function toLocalInputValue(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";

    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        d.getHours()
    )}:${pad(d.getMinutes())}`;
}

function toIsoFromLocalInput(local: string) {
    if (!local) return undefined;
    const d = new Date(local);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export default function CreateTask({
    isOpen,
    onClose,
    editingTask,
    onSave,
}: CreateTaskModalProps) {
    const initialForm = useMemo(
        () => ({
            title: "",
            description: "",
            category: "General",
            deadlineLocal: "",
        }),
        []
    );

    const [form, setForm] = useState(initialForm);
    const [openDropdown, setOpenDropdown] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        if (!editingTask) {
            setForm(initialForm);
            setOpenDropdown(false);
            return;
        }

        setForm({
            title: editingTask.title ?? "",
            description: editingTask.description ?? "",
            category: editingTask.category ?? "General",
            deadlineLocal: toLocalInputValue(editingTask.deadline),
        });
        setOpenDropdown(false);
    }, [editingTask, isOpen, initialForm]);

    if (!isOpen) return null;

    const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        const title = form.title.trim();
        if (!title) return;

        const description = form.description.trim();

        const payload: TaskPayload = {
            title,
            description: description ? description : undefined,
            category: form.category,
            deadline: toIsoFromLocalInput(form.deadlineLocal),
            status: editingTask?.status ?? false,
        };

        await onSave(payload, editingTask?._id);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <button
                type="button"
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-label="Close modal"
            />

            <div className="relative bg-white w-full max-w-md p-6 rounded-2xl shadow-xl z-10">
                <h2 className="text-2xl font-black text-black mb-4">
                    {editingTask ? "Edit Task" : "Create Task"}
                </h2>

                <input
                    type="text"
                    placeholder="Task title"
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    className="w-full border px-4 py-2 rounded-xl mb-3 text-black"
                />

                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    className="w-full border px-4 py-2 rounded-xl mb-3 text-black"
                />

                <div className="relative w-full mb-3">
                    <button
                        type="button"
                        onClick={() => setOpenDropdown((v) => !v)}
                        className="w-full px-4 py-2 border rounded-xl bg-white flex justify-between items-center text-black"
                    >
                        <span className={form.category ? "text-black" : "text-gray-400"}>
                            {form.category || "Select category"}
                        </span>
                        <span>▾</span>
                    </button>

                    {openDropdown && (
                        <ul className="absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-lg overflow-hidden">
                            {CATEGORIES.map((item) => (
                                <li
                                    key={item}
                                    onClick={() => {
                                        setField("category", item);
                                        setOpenDropdown(false);
                                    }}
                                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-black"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <label className="ml-1 text-black text-sm">Deadline</label>
                <input
                    type="datetime-local"
                    value={form.deadlineLocal}
                    onChange={(e) => setField("deadlineLocal", e.target.value)}
                    className="w-full border px-4 py-2 rounded-xl mb-4 text-black"
                />

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
                        disabled={!form.title.trim()}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
