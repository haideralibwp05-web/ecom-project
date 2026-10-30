
import axios from "axios";
import {
    getAccessToken,
    getRefreshToken,
    updateAccessToken,
    updateRefreshToken,
    type AuthRole,
} from "./authSession";
import { authFetch } from "./authFetch";

const API_URL =
    "http://127.0.0.1:8000/api/customize/delivery-fee/";

const REFRESH_URL =
    "http://127.0.0.1:8000/api/auth/token/refresh/";

// Admin aur logged-in customer dono delivery fee read kar sakte hain.
export const getDeliveryFee = async (
    role: AuthRole = "user"
) => {
    const response = await authFetch(API_URL, {}, role);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.message ||
            "Failed to fetch delivery fee."
        );
    }

    return data;
};

const refreshAdminAccessToken = async (): Promise<string> => {
    const refreshToken = getRefreshToken("admin");

    if (!refreshToken) {
        throw new Error("Admin session expired. Please login again.");
    }

    const refreshResponse = await axios.post(
        REFRESH_URL,
        { refresh: refreshToken }
    );

    const accessToken = refreshResponse.data.access as string | undefined;
    const newRefreshToken = refreshResponse.data.refresh as string | undefined;

    if (!accessToken) {
        throw new Error("Could not refresh your admin session.");
    }

    updateAccessToken("admin", accessToken);

    if (newRefreshToken) {
        updateRefreshToken("admin", newRefreshToken);
    }

    return accessToken;
};

// Sirf admin delivery fee update kar sakta hai.
export const updateDeliveryFee = async (delivery_fee: number) => {
    let accessToken = getAccessToken("admin");

    if (!accessToken || !getRefreshToken("admin")) {
        throw new Error("Please login as an admin again.");
    }

    try {
        const response = await axios.put(
            API_URL,
            { delivery_fee },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error: unknown) {
        if (
            !axios.isAxiosError(error) ||
            error.response?.status !== 401
        ) {
            throw error;
        }
    }

    accessToken = await refreshAdminAccessToken();

    const retryResponse = await axios.put(
        API_URL,
        { delivery_fee },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return retryResponse.data;
};
