"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { getToken } from "@/lib/authToken";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const checkAuth = () => {
        const token = getToken();
        if (!token) {
            router.replace("/login");
        }
    };

    useEffect(() => {
        checkAuth();

        const onPageShow = () => checkAuth();
        window.addEventListener("pageshow", onPageShow);

        return () => window.removeEventListener("pageshow", onPageShow);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <aside className="shrink-0 h-full overflow-hidden bg-white">
                <Sidebar />
            </aside>

            <main className="flex-1 h-full overflow-y-auto p-8">{children}</main>
        </div>
    );
}
