"use client";

import { useEffect, useState } from "react";
import { ForgotPasswordArgs, ResendOtpArgs, ResetPasswordArgs, VerifyOtpArgs } from "../lib/otp.types";
import { useRouter } from "next/navigation";


export function useResendOtp(args: ResendOtpArgs) {
    const { apiUrl, email, seconds = 10, onMessage } = args;

    const [timer, setTimer] = useState(seconds);
    const [canResend, setCanResend] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    useEffect(() => {
        if (timer <= 0) {
            setCanResend(true);
            return;
        }

        setCanResend(false);
        const id = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);

        return () => clearInterval(id);
    }, [timer]);

    const startTimer = (s: number = seconds) => {
        setTimer(s);
        setCanResend(false);
    };

    const resendOtp = async () => {
        if (!canResend || resendLoading) return;
        if (!email) {
            onMessage?.("Please enter your email");
            return;
        }
        try {
            setResendLoading(true);
            onMessage?.("Resending OTP...");

            const res = await fetch(`${apiUrl}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                startTimer(Number(data.retryAfterSeconds));
                onMessage?.(data.message || "Failed to resend OTP");
                return;
            }

            onMessage?.("OTP sent successfully");
            startTimer(seconds);
            setTimeout(() => {
                onMessage?.("");
            }, 10000);
        } catch (error) {
            onMessage?.("Failed to resend OTP");
        } finally {
            setResendLoading(false);
        }
    };

    return { timer, canResend, resendOtp, resendLoading };
};

export function useVerifyOtp(args: VerifyOtpArgs) {
    const router = useRouter();
    const { apiUrl, email, otp, onMessage } = args;

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            const res = await fetch(`${apiUrl}/auth/verify-reset-password-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setMsg(data.message || "OTP verify failed");
                return;
            }

            localStorage.setItem("resetToken", data.resetToken);
            router.push("/resetPassword?email=" + encodeURIComponent(email));
            onMessage?.("OTP verified successfully");
        } catch {
            setMsg("Network error");
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading, msg };
};

export function useForgotPassword(args: ForgotPasswordArgs) {
    const router = useRouter();
    const { apiUrl, email, onMessage } = args;

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            const res = await fetch(`${apiUrl}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setMsg(data.message || "Failed to send OTP");
                return;
            }

            onMessage?.("OTP sent successfully");
            router.push(`/verifyOtp?email=${encodeURIComponent(email)}`);
        } catch (error) {
            onMessage?.("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading, msg };
};

export function useResetPassword(args: ResetPasswordArgs) {
    const router = useRouter();
    const resetToken = localStorage.getItem("resetToken") || "";
    const { apiUrl, email, password, confirm, onMessage } = args;

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            if (password.length < 6) {
                setLoading(false);
                return onMessage?.("Password must be at least 6 characters.");
            }
            if (password !== confirm) {
                setLoading(false);
                return onMessage?.("Passwords do not match.");
            }

            const res = await fetch(`${apiUrl}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${resetToken}`,
                },
                body: JSON.stringify({ email, password, confirm, resetToken }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setMsg(data.message || "Failed to reset password");
                return;
            }

            onMessage?.("Password reset successfully");
            localStorage.removeItem("resetToken");
            router.push("/passwordChanged");
        } catch (error) {
            onMessage?.("Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading, msg };
}