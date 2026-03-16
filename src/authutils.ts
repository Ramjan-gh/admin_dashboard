const AUTH_URL = "https://himsgwtkvewhxvmjapqa.supabase.co/auth/v1";
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ─── Storage helpers ──────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
    return localStorage.getItem("sb-access-token");
}

export function getRefreshToken(): string | null {
    return localStorage.getItem("sb-refresh-token");
}

export function clearSession(): void {
    localStorage.removeItem("sb-access-token");
    localStorage.removeItem("sb-refresh-token");
    localStorage.removeItem("sb-user");
}

export function saveSession(data: {
    access_token: string;
    refresh_token: string;
    user: unknown;
}): void {
    localStorage.setItem("sb-access-token", data.access_token);
    localStorage.setItem("sb-refresh-token", data.refresh_token);
    localStorage.setItem("sb-user", JSON.stringify(data.user));
}

// ─── Refresh ──────────────────────────────────────────────────────────────────

export async function refreshSession(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
        const res = await fetch(`${AUTH_URL}/token?grant_type=refresh_token`, {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey: ANON_KEY },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!res.ok) { clearSession(); return false; }

        const data = await res.json();
        if (data.access_token && data.refresh_token) {
            saveSession(data);
            return true;
        }

        clearSession();
        return false;
    } catch {
        clearSession();
        return false;
    }
}

// ─── Authenticated fetch ──────────────────────────────────────────────────────
// Use this instead of fetch() for every API call in your page components.
// On 401 it silently refreshes and retries once; calls onUnauthorized if that
// also fails so App.tsx can redirect to /login automatically.

export async function authFetch(
    url: string,
    options: RequestInit = {},
    onUnauthorized: () => void,
): Promise<Response> {
    const doFetch = () =>
        fetch(url, {
            ...options,
            headers: {
                ...(options.headers ?? {}),
                Authorization: `Bearer ${getAccessToken() ?? ""}`,
                apikey: ANON_KEY,
            },
        });

    let res = await doFetch();

    if (res.status === 401) {
        const ok = await refreshSession();
        if (!ok) { onUnauthorized(); return res; }
        res = await doFetch();
        if (res.status === 401) { clearSession(); onUnauthorized(); }
    }

    return res;
}