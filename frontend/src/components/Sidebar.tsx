"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/lib/authToken";
import {
    Home,
    CheckSquare,
    User,
    Settings,
    LogOut,
    CheckCircle,
    CheckCircle2,
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const menu = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Task", href: "/dashboard/tasks", icon: CheckCircle2 },
        { name: "Profile", href: "/dashboard/profile", icon: User },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const logout = () => {
        clearToken();
        localStorage.removeItem("user");
        localStorage.removeItem("tasks");
        router.push("/login");
    };


    return (
        <aside className="w-64 min-h-screen bg-white text-black flex flex-col p-6 rounded-r-3xl shadow-lg">

            <div className="mb-12 md:mb-12 justify-center">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-black">
                    Listing<span className="text-indigo-600">.</span>
                </h1>
            </div>

            <nav className="flex-1 space-y-4">
                {menu.map(({ name, href, icon: Icon }) => {
                    const active = pathname === href;

                    return (
                        <Link
                            key={name}
                            href={href}
                            className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition
                ${active
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "hover:bg-indigo-400 hover:text-white"
                                }
              `}
                        >
                            <Icon size={25} className="mr-6" />
                            <span className="font-bold ml-1">{name}</span>
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={logout}
                className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 transition">
                <LogOut size={24} />
                <span className="font-bold">Logout</span>

            </button>
        </aside>
    );
}
