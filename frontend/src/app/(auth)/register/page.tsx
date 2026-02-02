"use client";

import { useState } from "react";
import Link from "next/link";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import type { RegisterPayload } from "@/app/api/auth.api";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
    const [form, setForm] = useState<RegisterPayload>({ username: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { registerUser, loading, error, setError } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        registerUser(form);
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md"
        >
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Sign Up</h2>

            {error && <p className="bg-red-100 text-red-600 p-2 mb-4 rounded-2xl text-center">{error}</p>}

            <input
                type="text"
                placeholder="Name"
                required
                className="w-full border px-3 py-2 mb-4 rounded-2xl text-black"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <input
                type="email"
                placeholder="Email"
                required
                className="w-full border px-3 py-2 mb-4 rounded-2xl text-black"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="relative w-full">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    className="w-full border px-3 py-2 mb-4 rounded-2xl text-black"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <button
                    type="button"
                    className=" absolute right-3 pt-2.5 text-blue-600"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
                </button>
            </div>

            <div className="relative mb-4 w-full">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    className="w-full border px-3 py-2 mb-4 rounded-2xl text-black"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />

                <button
                    type="button"
                    className="absolute right-3 pt-2.5 text-blue-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
                </button>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-2xl hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p className="text-sm text-center mt-4 text-black">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                    Login
                </Link>
            </p>
        </form>
    );
}
