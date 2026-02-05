"use client";

import { useState } from "react";
import { useResetPassword } from "@/app/hooks/useOtp";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function ResetPasswordPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [msg, setMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const email = localStorage.getItem("resetEmail") || "";

    const { submit, loading } = useResetPassword({
        apiUrl: apiUrl || "",
        email,
        password,
        confirm,
        onMessage: setMsg,
    });

    return (
        <div className="min-h-screen grid place-items-center p-6">
            <form
                onSubmit={submit}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow"
            >
                <h1 className="text-2xl font-bold text-slate-900 text-center">Reset Password</h1>
                <p className="text-slate-600 mt-1 text-center">
                    Set a new password for <span className="font-semibold">{email}</span>
                </p>

                <div className="mt-6 space-y-4">
                    <div className="relative mb-4 w-full">
                        <label className="text-sm text-slate-600">New Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="mt-1 w-full border rounded-xl p-3"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-13 -translate-y-1/2 items-center text-indigo-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
                        </button>
                    </div>

                    <div className="relative mb-4 w-full">
                        <label className="text-sm text-slate-600">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="mt-1 w-full border rounded-xl p-3"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-13 -translate-y-1/2 items-center text-indigo-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
                        </button>
                    </div>

                    {msg && <p className="text-sm text-red-600">{msg}</p>}

                    <button
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </div>
            </form>
        </div>
    );
}
