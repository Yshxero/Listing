"use client";

import { useState } from "react";
import CreateTask from "@/components/CreateTask";
import TaskCard from "@/components/tasks/TaskCard";
import type { Task, TaskPayload } from "@/lib/task.types";
import { useTasks } from "@/hooks/useTask";

export default function TasksPage() {
    const {
        tasks,
        pendingTasks,
        upcomingTasks,
        completedTasks,
        loading,
        saveTask,
        toggleStatus,
        deleteTask,
    } = useTasks();

    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsOpen(true);
    };

    const handleSave = async (payload: Omit<Task, "_id">, id?: string) => {
        if (id) await saveTask(payload, id);
        else await saveTask(payload);

        setIsOpen(false);
        setEditingTask(null);
    };

    return (
        <div>
            <h2 className="text-2xl font-black mb-6 text-black">Tasks</h2>

            <div className="relative grid grid-cols-2 mb-3">
                <div>
                    <input
                        type="text"
                        placeholder="Search Tasks..."
                        className="w-full max-w-md border-2 px-4 py-2 rounded-2xl text-black bg-gray-100 border-black hover:border-indigo-600 transition-all duration-200"
                    />
                </div>

                <div className="absolute top-0 right-3 items-center justify-end">
                    <button
                        onClick={() => {
                            setEditingTask(null);
                            setIsOpen(true);
                        }}
                        className=" text-white px-4 py-2 rounded-2xl mb-4 shadow-2xl bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 inline-block"
                    >
                        Add New Task
                    </button>

                    <CreateTask
                        isOpen={isOpen}
                        onClose={() => {
                            setIsOpen(false);
                            setEditingTask(null);
                        }}
                        editingTask={editingTask}
                        onSave={handleSave}
                    />
                </div>
            </div>

            <div className="">
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white p-6 rounded-3xl shadow">
                        <h3 className="font-semibold mb-4 text-black">Due Today Tasks</h3>
                        <div className=" h-full overflow-y-auto pr-2">
                            {loading ? (
                                <p className="text-gray-500 text-sm">Loading...</p>
                            ) : upcomingTasks.length === 0 ? (
                                <p className="text-gray-400 text-sm">No tasks due today 🎉</p>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingTasks.map((task) => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            onEdit={task.status ? undefined : handleEdit}
                                            onToggleDone={() => toggleStatus(task)}
                                            onDelete={() => deleteTask(task._id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow">
                        <h3 className="font-semibold mb-4 text-black">Pending Tasks</h3>
                        <div className=" h-full overflow-y-auto pr-2">
                            {loading ? (
                                <p className="text-gray-500 text-sm">Loading...</p>
                            ) : pendingTasks.length === 0 ? (
                                <p className="text-gray-400 text-sm">No pending tasks 🎉</p>
                            ) : (
                                <div className="space-y-3">
                                    {pendingTasks.map((task) => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            onEdit={task.status ? undefined : handleEdit}
                                            onToggleDone={() => toggleStatus(task)}
                                            onDelete={() => deleteTask(task._id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow">
                        <h3 className="font-semibold mb-4 text-black">Completed Tasks</h3>
                        <div className="h-full overflow-y-auto pr-2">
                            {completedTasks.length === 0 ? (
                                <p className="text-gray-400 text-sm">No completed tasks yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {completedTasks.map((task) => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            onEdit={handleEdit}
                                            onToggleDone={() => toggleStatus(task)}
                                            onDelete={() => deleteTask(task._id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
