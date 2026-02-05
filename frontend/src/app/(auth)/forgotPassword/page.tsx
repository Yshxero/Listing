"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/app/hooks/useOtp";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");

    const { submit, loading } = useForgotPassword({
        apiUrl: apiUrl || "",
        email,
        onMessage: setMsg,
    });

    return (
        <div className="min-h-screen grid place-items-center p-6">
            <form
                onSubmit={submit}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow"
            >
                <h1 className="text-2xl font-bold text-slate-900">
                    Forgot Password
                </h1>
                <p className="text-slate-600 mt-1">
                    Enter your email and we’ll send you a reset code.
                </p>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm text-slate-600">Email</label>
                        <input
                            className="mt-1 w-full border rounded-xl p-3"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {msg && <p className="text-sm text-red-600">{msg}</p>}

                    <button
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {loading ? "Sending..." : "Send Code"}
                    </button>
                </div>
            </form>
        </div>
    );
}
