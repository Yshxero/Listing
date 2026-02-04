"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { login, register } from "@/app/api/auth.api";
import type { LoginPayload, RegisterPayload } from "@/app/api/auth.api";
import { setToken } from "@/app/lib/authToken";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async (payload: LoginPayload) => {
    setLoading(true);
    setError("");
    try {
      const res = await login(payload);
      setToken(res.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (payload: RegisterPayload) => {
    setLoading(true);
    setError("");
    try {
      const res = await register(payload);
      setToken(res.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Server error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, registerUser, setError, loading, error };
}
