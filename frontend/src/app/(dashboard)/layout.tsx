"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { getToken } from "@/app/lib/authToken";

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
        <div className="flex h-screen overflow-hidden">
            <aside className="shrink-0 h-full overflow-hidden bg-slate-50">
                <Sidebar />
            </aside>

            <main className="flex-1 h-full overflow-y-auto p-8 bg-slate-50">{children}</main>
        </div>
    );
}
