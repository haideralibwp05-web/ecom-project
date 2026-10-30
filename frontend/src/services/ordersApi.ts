
import axios from "axios";
import {
    getAccessToken,
    getRefreshToken,
    updateAccessToken,
    updateRefreshToken,
} from "./authSession";

const API_URL = "http://127.0.0.1:8000/api/orders/";
const REFRESH_URL = "http://127.0.0.1:8000/api/auth/token/refresh/";

export interface AdminOrderItem {
    id: number;
    product: number | null;
    product_name: string;
    product_image: string | null;
    quantity: number;
    price: string;
    size: string;
    color: string;
}

export interface AdminOrder {
    id: number;
    full_name: string;
    phone: string;
    email: string;
    city: string;
    postal_code: string;
    address: string;
    notes: string;
    payment_method: string;
    payment_status: string;
    order_status: string;
    subtotal: string;
    delivery_fee: string;
    total: string;
    stripe_payment_intent_id: string | null;
    items: AdminOrderItem[];
    created_at: string;
}

interface OrdersResponse {
    count?: number;
    results?: AdminOrder[];
}

const refreshAdminAccessToken = async (): Promise<string> => {
    const refresh = getRefreshToken("admin");

    if (!refresh) {
        throw new Error("Admin session expired. Please login again.");
    }

    try {
        const response = await axios.post(REFRESH_URL, { refresh });

        const access = response.data.access as string | undefined;
        const newRefresh = response.data.refresh as string | undefined;

        if (!access) {
            throw new Error("Could not refresh your admin login session.");
        }

        updateAccessToken("admin", access);

        if (newRefresh) {
            updateRefreshToken("admin", newRefresh);
        }

        return access;
    } catch {
        throw new Error("Admin session expired. Please login again.");
    }
};

const adminGet = async <T>(url: string): Promise<T> => {
    let access = getAccessToken("admin");

    if (!access) {
        throw new Error("Please login as an admin.");
    }

    try {
        const response = await axios.get<T>(url, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });

        return response.data;
    } catch (error: unknown) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
            throw error;
        }
    }

    access = await refreshAdminAccessToken();

    const response = await axios.get<T>(url, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
    });

    return response.data;
};

const extractOrders = (
    payload: OrdersResponse | AdminOrder[]
): AdminOrder[] => {
    if (Array.isArray(payload)) {
        return payload;
    }

    return Array.isArray(payload.results) ? payload.results : [];
};

export const getAdminOrders = async (): Promise<AdminOrder[]> => {
    const response = await adminGet<OrdersResponse | AdminOrder[]>(API_URL);

    return extractOrders(response);
};

export const getAdminOrderDetails = (
    orderId: number
): Promise<AdminOrder> => {
    return adminGet<AdminOrder>(`${API_URL}${orderId}/`);
};
