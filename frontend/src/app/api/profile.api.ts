import type { User } from "@/app/lib/user.types";
import { apiFetch } from "@/app/lib/http";

type ProfileDTO = {
    userID: string;
    userName: string;
    userEmail: string;
    lastSignIn: Date;
};

const mapProfile = (dto: ProfileDTO): User => ({
    id: dto.userID,
    username: dto.userName,
    email: dto.userEmail,
    lastSignIn: dto.lastSignIn
});

export const userApi = {
    getProfile: async (token: string): Promise<User> => {
        const dto = await apiFetch<ProfileDTO>("/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        return mapProfile(dto);
    },

    updateProfile: async (
        payload: Partial<Pick<User, "username" | "email">>
    ): Promise<User> => {
        const dto = await apiFetch<ProfileDTO>("/users/updateProfile", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
        return mapProfile(dto);
    },

    deleteProfile: async (): Promise<void> => {
        await apiFetch("/users/deleteProfile", {
            method: "DELETE",
            cache: "no-store",
        });
    },

};
