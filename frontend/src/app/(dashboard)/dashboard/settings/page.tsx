"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useProfile } from "@/app/hooks/useProfile";

export default function SettingsPage() {
    const { deleteProfile } = useProfile();
    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const CONFIRM_WORD = "Listing";
    const isMatch = confirmText === CONFIRM_WORD;

    const handleDelete = async () => {
        if (!isMatch) return;

        setLoading(true);
        setError("");

        try {
            await deleteProfile();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 bg-white/150 backdrop-blur-2xl backdrop-saturate-100 rounded-3xl shadow-[0_0_40px_rgba(99,102,241,0.35)] border border-white/30 ">
            <h1 className="text-2xl font-black text-white mb-6">Settings</h1>

            <div className="border border-red-200 bg-red-50 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Danger Zone
                </h2>

                <p className="text-sm text-red-500 mb-4">
                    Deleting your account is permanent. All your tasks and data will be removed.
                </p>

                <button
                    onClick={() => setOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold"
                >
                    Delete Account
                </button>
            </div>

            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-scaleIn">
                        <h3 className="text-lg font-bold text-black mb-2">
                            Confirm Account Deletion
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                            This action <strong>cannot</strong> be undone.
                            To confirm, type <strong className="text-black">Listing</strong> below.
                        </p>

                        <input
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Type Listing"
                            className="w-full border rounded-xl px-4 py-2 text-black mb-3 focus:ring-2 focus:ring-red-500 outline-none"
                        />

                        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    setConfirmText("");
                                    setError("");
                                }}
                                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-semibold"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={!isMatch || loading}
                                className={`px-4 py-2 rounded-xl font-semibold text-white ${isMatch
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-red-300 cursor-not-allowed"
                                    }`}
                            >
                                {loading ? "Deleting..." : "Delete Account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
