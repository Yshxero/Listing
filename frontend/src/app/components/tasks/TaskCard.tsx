"use client";

type Task = {
    _id: string;
    title: string;
    description?: string;
    category: string;
    deadline?: string;
    status: boolean;
};

type TaskCardProps = {
    task: Task;
    onEdit?: (task: Task) => void;
    onToggleDone: (task: Task) => void;
    onDelete: (task: Task) => void;
};

function formatDate(iso?: string) {
    if (!iso) return "No deadline";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "Invalid date" : d.toLocaleDateString();
}

function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`px-3 py-1 rounded-full text-xs ${className}`}>
            {children}
        </span>
    );
}

function ActionButton({
    children,
    className = "",
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1 rounded-xl text-sm transition ${className}`}
        >
            {children}
        </button>
    );
}

export default function TaskCard({ task, onEdit, onToggleDone, onDelete }: TaskCardProps) {
    const isDone = task.status;

    const titleClass = isDone ? "line-through opacity-70" : "";
    const doneLabel = isDone ? "Undo" : "Done";
    const deadlineText = formatDate(task.deadline);

    const showEdit = !isDone && !!onEdit;

    return (
        <div className="border rounded-2xl p-4 bg-white">
            <div className="flex justify-between gap-3">
                <div className="min-w-0">
                    <h4 className={`font-bold text-black truncate ${titleClass}`}>
                        {task.title}
                    </h4>

                    {task.description ? (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {task.description}
                        </p>
                    ) : null}
                </div>

                <div className="flex gap-2 shrink-0">
                    {showEdit ? (
                        <ActionButton
                            onClick={() => onEdit!(task)}
                            className="border text-black hover:bg-gray-50"
                        >
                            Edit
                        </ActionButton>
                    ) : null}

                    <ActionButton
                        onClick={() => onToggleDone(task)}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        {doneLabel}
                    </ActionButton>

                    <ActionButton
                        onClick={() => onDelete(task)}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </ActionButton>
                </div>
            </div>

            <div className="mt-3 flex gap-2 flex-wrap">
                <Tag className="bg-indigo-50 text-indigo-700">
                    {task.category}
                </Tag>

                <Tag className="bg-gray-100 text-red-500">
                    Deadline: {deadlineText}
                </Tag>
            </div>
        </div>
    );
}
