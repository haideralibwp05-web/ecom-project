export type AuthRole = "admin" | "user";

export interface LoginSession {
    access: string;
    refresh: string;
    username: string;
    email?: string;
    is_staff?: boolean;
    is_superuser?: boolean;
}

const getKey = (role: AuthRole, key: string): string => {
    return `${role}_${key}`;
};

// Access token
export const getAccessToken = (role: AuthRole): string | null => {
    return localStorage.getItem(getKey(role, "access"));
};

// Refresh token
export const getRefreshToken = (role: AuthRole): string | null => {
    return localStorage.getItem(getKey(role, "refresh"));
};

// Username
export const getSessionUsername = (role: AuthRole): string => {
    return localStorage.getItem(getKey(role, "username")) || "";
};

// Email
export const getSessionEmail = (role: AuthRole): string => {
    return localStorage.getItem(getKey(role, "email")) || "";
};

// Check whether the session exists
export const isAuthenticated = (role: AuthRole): boolean => {
    return Boolean(getAccessToken(role));
};

// Save login session
export const saveSession = (
    role: AuthRole,
    session: LoginSession
): void => {
    localStorage.setItem(getKey(role, "access"), session.access);
    localStorage.setItem(getKey(role, "refresh"), session.refresh);
    localStorage.setItem(getKey(role, "username"), session.username);
    localStorage.setItem(getKey(role, "email"), session.email || "");

    localStorage.setItem(
        getKey(role, "is_staff"),
        String(Boolean(session.is_staff))
    );

    localStorage.setItem(
        getKey(role, "is_superuser"),
        String(Boolean(session.is_superuser))
    );
};

// Update access token after refreshing
export const updateAccessToken = (
    role: AuthRole,
    access: string
): void => {
    localStorage.setItem(getKey(role, "access"), access);
};

// Update refresh token after refreshing
export const updateRefreshToken = (
    role: AuthRole,
    refresh: string
): void => {
    localStorage.setItem(getKey(role, "refresh"), refresh);
};

// Update profile information
export const updateSessionProfile = (
    role: AuthRole,
    username: string,
    email: string
): void => {
    localStorage.setItem(getKey(role, "username"), username);
    localStorage.setItem(getKey(role, "email"), email);
};

// Logout only the selected role
export const logoutSession = (role: AuthRole): void => {
    const keys = [
        "access",
        "refresh",
        "username",
        "email",
        "is_staff",
        "is_superuser",
    ];

    keys.forEach((key) => {
        localStorage.removeItem(getKey(role, key));
    });
};

// Admin access requires a token and an admin role
export const isAdminAuthenticated = (): boolean => {
    const access = getAccessToken("admin");

    const isStaff =
        localStorage.getItem("admin_is_staff") === "true";

    const isSuperuser =
        localStorage.getItem("admin_is_superuser") === "true";

    return Boolean(access && (isStaff || isSuperuser));
};