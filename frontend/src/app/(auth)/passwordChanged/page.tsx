"use client";

import Link from "next/link";

export default function PasswordChangedPage() {
    return (
        <div className="min-h-screen grid place-items-center p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow text-center">
                <div className="text-5xl">✅</div>
                <h1 className="text-2xl font-bold text-slate-900 mt-3">
                    Password Updated
                </h1>
                <p className="text-slate-600 mt-2">
                    Your password was reset successfully. You can now login.
                </p>

                <Link
                    href="/login"
                    className="mt-6 inline-block w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    );
}
