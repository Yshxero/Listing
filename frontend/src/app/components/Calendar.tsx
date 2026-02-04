"use client";

import { useMemo, useState } from "react";
import { DayPicker, DayButton, type DayButtonProps } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { Task } from "@/app/lib/task.types";

function dayKey(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function taskDayKey(deadline: string | Date) {
    const d = new Date(deadline);
    return dayKey(d);
}

export default function CalendarCard({ tasks }: { tasks: Task[] }) {
    const [selected, setSelected] = useState<Date>(new Date());

    const countsByDay = useMemo(() => {
        const map = new Map<string, number>();
        for (const t of tasks) {
            if (!t.deadline) continue;
            if (t.status) continue;
            const key = taskDayKey(t.deadline);
            map.set(key, (map.get(key) ?? 0) + 1);
        }
        return map;
    }, [tasks]);

    const selectedKey = dayKey(selected);

    const tasksForSelectedDay = useMemo(() => {
        return tasks
            .filter(
                (t): t is Task & { deadline: string } =>
                    !!t.deadline && taskDayKey(t.deadline) === selectedKey
            )
            .sort(
                (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            );
    }, [tasks, selectedKey]);


    return (
        <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-semibold text-black mb-4">Calendar</h3>

            <DayPicker
                mode="single"
                selected={selected}
                onSelect={(d) => d && setSelected(d)}
                showOutsideDays
                className="w-full"
                components={{
                    DayButton: (props: DayButtonProps) => {
                        const { day, modifiers, ...buttonProps } = props;

                        const key = dayKey(day.date);
                        const count = countsByDay.get(key) ?? 0;

                        return (
                            <DayButton day={day} modifiers={modifiers} {...buttonProps}>
                                <span className="relative w-10 h-10 flex items-center justify-center">
                                    <span className="text-sm text-black">{day.date.getDate()}</span>
                                    {count > 0 && (
                                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span
                                                className="w-7 h-7 rounded-full bg-black text-white text-xs font-extrabold flex items-center justify-center shadow"
                                                title={`${count} task(s) due`}
                                            >
                                                {count}
                                            </span>
                                        </span>
                                    )}
                                </span>
                            </DayButton>
                        );
                    },
                }}
            />



            <div className="mt-5">
                <p className="text-black font-semibold mb-2">
                    Tasks for {selected.toDateString()}
                </p>

                {tasksForSelectedDay.length === 0 ? (
                    <p className="text-gray-400 text-sm">No tasks due this day 🎉</p>
                ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                        {tasksForSelectedDay.map((t) => (
                            <div
                                key={t._id}
                                className="border rounded-2xl p-3 flex items-start justify-between"
                            >
                                <div>
                                    <p className="text-black font-semibold">{t.title}</p>
                                    {t.deadline && (
                                        <p className="text-gray-500 text-xs">
                                            Due: {new Date(t.deadline).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    )}
                                </div>
                                <span
                                    className={`text-xs font-bold px-2 py-1 rounded-full ${t.status ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {t.status ? "Done" : "Pending"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
