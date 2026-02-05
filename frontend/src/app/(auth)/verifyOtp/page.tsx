"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResendOtp, useVerifyOtp } from "@/app/hooks/useOtp";

export default function VerifyOtpPage() {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const searchParams = useSearchParams();

    const [otp, setOtp] = useState("");
    const [msg, setMsg] = useState("");

    const email = searchParams.get("email") ?? "";

    const { timer, canResend, resendOtp, resendLoading } = useResendOtp({
        apiUrl: apiUrl || "",
        email,
        seconds: 10,
        onMessage: setMsg,
    });

    const { submit, loading } = useVerifyOtp({
        apiUrl: apiUrl || "",
        email,
        otp,
        onMessage: setMsg,
    });

    return (
        <div className="min-h-screen grid place-items-center p-6">
            <form
                onSubmit={submit}
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow"
            >
                <h1 className="text-2xl font-bold text-slate-900">Verify OTP</h1>
                <p className="text-slate-600 mt-1">
                    Enter the 6-digit code sent to your email.
                </p>

                <div className="mt-6 space-y-4">

                    <div>
                        <label className="text-sm text-slate-600">OTP Code</label>
                        <input
                            className="mt-1 w-full border rounded-xl p-3 tracking-widest text-center text-lg"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="123456"
                            required
                        />
                    </div>

                    {msg && (
                        <p className="texttext-sm text-red-600">{msg}</p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                    <div className="">
                        <label className="text-sm text-slate-600">Didn't receive a code?</label>
                        <button
                            type="button"
                            onClick={resendOtp}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60"
                            disabled={!canResend || resendLoading}
                        >
                            {timer > 0 ? `Resend Code in ${timer}` : "Resend Code"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
