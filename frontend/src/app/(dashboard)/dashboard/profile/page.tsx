"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/app/hooks/useProfile";
import { User, Calendar } from "lucide-react";

export default function ProfilePage() {
    const { profile, loading, saving, error, updateProfile, refetch } = useProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ username: "", email: "" });

    useEffect(() => {
        if (profile) {
            setForm({ username: profile.username, email: profile.email });
        }
    }, [profile]);

    if (loading) return <p className="text-black">Loading...</p>;

    if (!profile) {
        return (
            <div className="text-black space-y-2 p-6">
                <p className="text-red-600 font-semibold">No profile found</p>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                    onClick={() => refetch()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
                >
                    Retry
                </button>
            </div>
        );
    }

    const onSave = async () => {
        await updateProfile(form);
        setIsEditing(false);
    };

    const onCancel = () => {
        setForm({ username: profile.username, email: profile.email });
        setIsEditing(false);
    };

    const lastSignInText =
        (profile as any).lastSignIn
            ? new Date((profile as any).lastSignIn).toLocaleString()
            : "—";

    return (
        <div className="w-full mx-auto p-4">
            <h2 className="text-2xl font-black text-black mb-6">Profile Settings</h2>

            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-start md:items-center gap-6 flex-1">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <User className="w-8 h-8 text-indigo-600" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-10 flex-1">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                                Username
                            </p>
                            {isEditing ? (
                                <input
                                    value={form.username}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, username: e.target.value }))
                                    }
                                    className="w-full border border-black rounded-lg px-3 py-2 text-black text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            ) : (
                                <p className="text-black font-semibold">{profile.username}</p>
                            )}
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                                Email Address
                            </p>
                            {isEditing ? (
                                <input
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm((p) => ({ ...p, email: e.target.value }))
                                    }
                                    className="w-full border border-black rounded-lg px-3 py-2 text-black text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            ) : (
                                <p className="text-black font-semibold">{profile.email}</p>
                            )}
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                                Last Sign In
                            </p>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <p className="text-sm font-medium">{lastSignInText}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
                    {error && <p className="text-sm text-red-500">{error}</p>}

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors px-6 py-2 rounded-xl font-bold text-sm"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={onSave}
                                disabled={saving}
                                className="bg-indigo-600 disabled:opacity-60 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={onCancel}
                                className="bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors px-5 py-2 rounded-xl text-sm font-bold"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
