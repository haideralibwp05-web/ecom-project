
import {
    getAccessToken,
    getRefreshToken,
    updateAccessToken,
    updateRefreshToken,
    logoutSession,
    type AuthRole,
} from "./authSession";

const API_BASE_URL = "http://127.0.0.1:8000";

// Admin aur user ke refresh requests alag rahenge.
const refreshPromises: Partial<Record<AuthRole, Promise<string>>> = {};

const clearExpiredSession = (role: AuthRole): void => {
    logoutSession(role);

    // Navbar aur doosre session listeners ko update hone ka signal.
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("Shop.Co-user-changed"));
    }
};

const refreshAccessToken = async (role: AuthRole): Promise<string> => {
    const refresh = getRefreshToken(role);

    if (!refresh) {
        clearExpiredSession(role);
        throw new Error("Your session has expired. Please sign in again.");
    }

    let response: Response;

    try {
        response = await fetch(
            `${API_BASE_URL}/api/auth/token/refresh/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh }),
            }
        );
    } catch {
        // Network issue ho to session clear na karein.
        throw new Error(
            "Unable to connect to the server. Please try again."
        );
    }

    if (!response.ok) {
        clearExpiredSession(role);
        throw new Error("Your session has expired. Please sign in again.");
    }

    const data: {
        access?: string;
        refresh?: string;
    } = await response.json().catch(() => ({}));

    if (!data.access) {
        clearExpiredSession(role);
        throw new Error("Unable to refresh your session. Please sign in again.");
    }

    updateAccessToken(role, data.access);

    // SimpleJWT rotation enabled ho to naya refresh token save karein.
    if (data.refresh) {
        updateRefreshToken(role, data.refresh);
    }

    return data.access;
};

const getFreshAccessToken = (role: AuthRole): Promise<string> => {
    if (!refreshPromises[role]) {
        refreshPromises[role] = refreshAccessToken(role).finally(() => {
            delete refreshPromises[role];
        });
    }

    return refreshPromises[role]!;
};

export const authFetch = async (
    url: string,
    options: RequestInit = {},
    role: AuthRole = "user"
): Promise<Response> => {
    const sendRequest = (token: string | null): Promise<Response> => {
        const headers = new Headers(options.headers);

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        } else {
            headers.delete("Authorization");
        }

        return fetch(url, {
            ...options,
            headers,
        });
    };

    const accessToken = getAccessToken(role);
    let response = await sendRequest(accessToken);

    // Sirf 401 par refresh try karein; 403 par nahi.
    if (response.status !== 401) {
        return response;
    }

    const newAccessToken = await getFreshAccessToken(role);

    response = await sendRequest(newAccessToken);

    // Refresh ke baad bhi token reject ho to session clear karein.
    if (response.status === 401) {
        clearExpiredSession(role);
    }

    return response;
};
