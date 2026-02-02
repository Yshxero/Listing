"use client";

import { useState } from "react";
import Link from "next/link";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth } from "@/hooks/useAuth";
import type { LoginPayload } from "@/app/api/auth.api";

export default function LoginPage() {
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, loading, error } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md"
    >
      <h2 className="text-2xl font-black mb-6 text-center text-black">Login</h2>

      {error && <p className="bg-red-100 text-red-600 p-2 mb-4 rounded-3xl">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        required
        className="w-full border px-3  py-2 mb-4 rounded-2xl text-black"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <div className="relative mb-4 w-full">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          className="block w-full px-3 py-2 border rounded-2xl text-black"
          style={{ paddingRight: "3.5rem" }}
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="button"
          className="absolute right-3 inset-y-0 flex items-center z-20 text-indigo-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
        </button>
      </div>


      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-2xl hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-sm text-center mt-4 text-black">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
