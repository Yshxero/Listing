"use client"

import { useTasks } from "@/hooks/useTask";
import CalendarCard from "@/components/Calendar";
import CalendarOld from "@/components/CalendarOld";

export default function DashboardPage() {
    const {
        tasks,
        pendingTasks,
        completedTasks,
    } = useTasks();

    const totalTask = pendingTasks.length + completedTasks.length;

    return (
        <div className="">
            <h2 className="text-2xl font-black mb-6 text-black">Dashboard</h2>
            <div className="w-full relative grid grid-cols-1 gap-6">

                <div className="w-full p-2">

                    <div className="w-full absolute grid grid-cols-4 justify-between gap-6">

                        <div className="w-full h-80 bg-white rounded-3xl shadow-lg flex flex-col justify-center items-center">
                            <h3 className="text-black font-bold">Total Tasks</h3>
                            <div className="w-50 h-50 rounded-full border-4 border-indigo-500 flex items-center justify-center mt-5">
                                <p className="text-3xl font-black text-indigo-500">{totalTask}</p>
                            </div>
                        </div>

                        <div className="w-full h-80 bg-white rounded-3xl shadow-lg flex flex-col justify-center items-center">
                            <h3 className="text-black font-bold">Completed</h3>
                            <div className="w-50 h-50 rounded-full border-4 border-green-500 flex items-center justify-center mt-5">
                                <p className="text-3xl font-black text-green-500">{completedTasks.length}</p>
                            </div>
                        </div>

                        <div className="w-full h-80 bg-white rounded-3xl shadow-lg flex flex-col justify-center items-center">
                            <h3 className="text-black font-bold">Pending</h3>
                            <div className="w-50 h-50 rounded-full border-4 border-yellow-500 flex items-center justify-center mt-5">
                                <p className="text-3xl font-black text-yellow-500">{pendingTasks.length}</p>
                            </div>
                        </div>

                        <div className="w-full h-80 bg-white rounded-3xl shadow-lg flex flex-col justify-center items-center">
                            <h3 className="text-black font-bold">Missed</h3>
                            <div className="w-50 h-50 rounded-full border-4 border-red-500 flex items-center justify-center mt-5">
                                <p className="text-3xl font-black text-red-500">0</p>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="w-full mt-80">
                    <CalendarOld tasks={tasks} />
                </div>

            </div>
        </div>
    );
}
