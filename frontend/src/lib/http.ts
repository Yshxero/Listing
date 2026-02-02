import { clearToken, getToken } from "./authToken";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not set");
    }

    const url = `${baseUrl}${path}`;
    const token = getToken();

    let res: Response;
    try {
        res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(options.headers || {}),
            },
            cache: "no-store",
        });
    } catch (err) {
        throw new Error(`Network error calling ${url}`);
    }

    if (res.status === 401) {
        clearToken();
        throw new Error("Session expired. Please login again.");
    }

    const text = await res.text();

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} from ${url}: ${text}`);
    }

    if (!text) return {} as T;

    try {
        return JSON.parse(text) as T;
    } catch {
        throw new Error(`Invalid JSON from ${url}: ${text}`);
    }
}
