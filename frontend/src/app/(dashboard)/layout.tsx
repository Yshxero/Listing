"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { getToken } from "@/app/lib/authToken";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [deletedOpen, setDeletedOpen] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const checkAuth = () => {
        const token = getToken();
        if (!token) router.replace("/login");
    };

    const goLogin = () => {
        setDeletedOpen(false);
        router.replace("/login");
    };

    useEffect(() => {
        checkAuth();

        const onPageShow = () => checkAuth();
        window.addEventListener("pageshow", onPageShow);

        return () => window.removeEventListener("pageshow", onPageShow);
    }, []);

    useEffect(() => {
        const onDeleted = () => {
            setDeletedOpen(true);
            setCountdown(5);
        };

        window.addEventListener("account-deleted", onDeleted);
        return () => window.removeEventListener("account-deleted", onDeleted);
    }, []);

    useEffect(() => {
        if (!deletedOpen) return;

        const interval = setInterval(() => {
            setCountdown((c) => c - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            goLogin();
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [deletedOpen]);

    return (
        <div className="flex h-screen overflow-hidden relative">
            <aside className="shrink-0 h-full overflow-hidden">
                <Sidebar />
            </aside>

            <main className="flex-1 h-full overflow-y-auto p-8">{children}</main>

            {deletedOpen && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

                    <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn">
                        <h3 className="text-lg font-bold text-black mb-2">Account Deleted</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Your account has been deleted successfully.
                            <br />
                            Redirecting to login in{" "}
                            <span className="font-bold text-black">{countdown}</span>s...
                        </p>

                        <div className="flex justify-end">
                            <button
                                onClick={goLogin}
                                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
