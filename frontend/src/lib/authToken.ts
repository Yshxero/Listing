const TOKEN_KEY = "token";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function getTokenOrThrow(): string {
    if (typeof window === "undefined") {
        throw new Error("Token is not available on server");
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("No token found");
    return token;
}

export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}
