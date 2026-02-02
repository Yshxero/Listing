"use client";

import { useEffect, useState, useCallback } from "react";
import { userApi } from "@/app/api/profile.api";
import type { User } from "@/lib/user.types";
import { clearToken, getTokenOrThrow } from "@/lib/authToken";
import router from "next/router";

type EditPayload = Partial<Pick<User, "username" | "email">>;

export function useProfile() {
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>("");

    const fetchProfile = useCallback(async () => {
        setError("");
        const token = getTokenOrThrow();
        const data = await userApi.getProfile(token);
        setProfile(data);
        return data;
    }, []);

    const updateProfile = async (payload: EditPayload) => {
        const updated = await userApi.updateProfile(payload);
        setProfile(updated);
        return updated;
    };

    const deleteProfile = async () => {
        await userApi.deleteProfile();
        clearToken();
        router.replace("/");
    };


    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                await fetchProfile();
            } catch (err) {
                console.error(err);
                setProfile(null);
                setError(err instanceof Error ? err.message : "Failed to load profile");
            } finally {
                setLoading(false);
            }
        })();
    }, [fetchProfile]);

    return { profile, loading, saving, error, refetch: fetchProfile, updateProfile, deleteProfile };
}
