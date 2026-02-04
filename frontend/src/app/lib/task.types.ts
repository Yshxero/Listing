export type Task = {
    _id: string;
    title: string;
    description?: string;
    category: string;
    deadline?: string;
    status: boolean;
};

export type TaskPayload = Omit<Task, "_id">;
