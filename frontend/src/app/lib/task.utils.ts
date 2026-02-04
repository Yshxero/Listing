import type { Task } from "./task.types";

function isDueToday(t: Task) {
    if (!t.deadline) return false;

    const d = new Date(t.deadline);
    const now = new Date();

    return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
    );
}

function isMissed(t: Task) {
    if (!t.deadline) return false;
    if (t.status) return false;

    const d = new Date(t.deadline);
    const now = new Date();

    return (
        d.getFullYear() < now.getFullYear() ||
        (d.getFullYear() === now.getFullYear() &&
            (d.getMonth() < now.getMonth() ||
                (d.getMonth() === now.getMonth() && d.getDate() < now.getDate())))
    );
}

export { isDueToday, isMissed };