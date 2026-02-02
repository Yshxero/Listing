"use client";

import { useMemo, useState } from "react";
import type { Task } from "@/lib/task.types";

function toYMD(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function sameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export default function CalendarCard({ tasks }: { tasks: Task[] }) {
    const [cursor, setCursor] = useState(() => new Date());
    const [selected, setSelected] = useState<Date>(() => new Date());

    const year = cursor.getFullYear();
    const month = cursor.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startWeekday = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();

    const dueCountByDay = useMemo(() => {
        const map = new Map<string, number>();
        for (const t of tasks) {
            if (!t.deadline) continue;
            const d = new Date(t.deadline);
            const key = toYMD(d);
            map.set(key, (map.get(key) ?? 0) + 1);
        }
        return map;
    }, [tasks]);

    const selectedTasks = useMemo(() => {
        const key = toYMD(selected);
        return tasks.filter((t) => {
            if (!t.deadline) return false;
            return toYMD(new Date(t.deadline)) === key;
        });
    }, [tasks, selected]);

    const cells: Array<Date | null> = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));

    const monthLabel = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });

    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-black">Calendar</h3>

                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1 rounded-xl border text-black"
                        onClick={() => setCursor(new Date(year, month - 1, 1))}
                    >
                        ←
                    </button>
                    <span className="text-black font-semibold">{monthLabel}</span>
                    <button
                        className="px-3 py-1 rounded-xl border text-black"
                        onClick={() => setCursor(new Date(year, month + 1, 1))}
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="py-2 text-center">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {cells.map((d, idx) => {
                    if (!d) return <div key={idx} />;

                    const key = toYMD(d);
                    const count = dueCountByDay.get(key) ?? 0;
                    const isToday = sameDay(d, today);
                    const isSelected = sameDay(d, selected);

                    return (
                        <button
                            key={idx}
                            onClick={() => setSelected(d)}
                            className={[
                                "h-10 rounded-xl border flex items-center justify-center relative text-sm",
                                isSelected ? "border-indigo-600" : "border-gray-200",
                                isToday ? "bg-indigo-50" : "bg-white",
                                "text-black",
                            ].join(" ")}
                        >
                            {d.getDate()}
                            {count > 0 && (
                                <span className="absolute bottom-1 right-1 text-[10px] bg-indigo-600 text-white rounded-full px-1.5 py-0.5">
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-5">
                <p className="text-sm font-semibold text-black">
                    Tasks due on {selected.toLocaleDateString()}
                </p>

                {selectedTasks.length === 0 ? (
                    <p className="text-sm text-gray-400 mt-2">No tasks due.</p>
                ) : (
                    <ul className="mt-2 space-y-2">
                        {selectedTasks.map((t) => (
                            <li
                                key={t._id}
                                className={[
                                    "text-sm border rounded-xl p-3",
                                    t.status
                                        ? "bg-green-50 border-green-400 text-green-700"
                                        : "bg-yellow-50 border-yellow-400 text-yellow-700",
                                ].join(" ")}
                            >
                                <div className="font-semibold">{t.title}</div>
                                <div className="text-xs opacity-80">{t.category}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
