import { apiFetch } from "@/app/lib/http";

export type LoginPayload = {
    email: string;
    password: string
};

export function login(payload: LoginPayload) {
    return apiFetch<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}


export type RegisterPayload = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export function register(payload: RegisterPayload) {
    return apiFetch<{ token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
