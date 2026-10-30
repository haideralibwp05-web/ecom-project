
import axios from "axios";
import {
    getAccessToken,
    getRefreshToken,
    updateAccessToken,
    updateRefreshToken,
} from "./authSession";

const API_URL = "http://127.0.0.1:8000/api/orders/customers/";
const REFRESH_URL = "http://127.0.0.1:8000/api/auth/token/refresh/";

export interface Customer {
    id: number;
    username: string;
    email: string;
    total_orders: number;
    total_spent: string;
}

export interface CustomerOrderItem {
    id: number;
    product: number | null;
    product_name: string;
    product_image: string | null;
    quantity: number;
    price: string;
    size: string;
    color: string;
}

export interface CustomerOrder {
    id: number;
    created_at: string;
    payment_method: string;
    payment_status: string;
    order_status: string;
    subtotal: string;
    delivery_fee: string;
    total: string;
    items: CustomerOrderItem[];
}

export interface CustomerDetails {
    customer: {
        id: number;
        username: string;
        email: string;
        date_joined: string;
    };
    summary: {
        total_orders: number;
        total_spent: string;
        last_order_id: number | null;
        last_order_date: string | null;
    };
    orders: CustomerOrder[];
}

async function adminGet<T>(url: string): Promise<T> {
    let access = getAccessToken("admin");

    if (!access) {
        throw new Error("Admin session not found. Please login again.");
    }

    try {
        const response = await axios.get<T>(url, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });

        return response.data;
    } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
            throw error;
        }

        const refresh = getRefreshToken("admin");

        if (!refresh) {
            throw error;
        }

        const refreshResponse = await axios.post<{
            access: string;
            refresh?: string;
        }>(REFRESH_URL, {
            refresh,
        });

        access = refreshResponse.data.access;
        updateAccessToken("admin", access);

        if (refreshResponse.data.refresh) {
            updateRefreshToken("admin", refreshResponse.data.refresh);
        }

        const retryResponse = await axios.get<T>(url, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });

        return retryResponse.data;
    }
}

export async function getAdminCustomers(): Promise<Customer[]> {
    const data = await adminGet<{
        count: number;
        results: Customer[];
    }>(API_URL);

    return data.results;
}

export async function getAdminCustomerDetails(
    customerId: number
): Promise<CustomerDetails> {
    return adminGet<CustomerDetails>(`${API_URL}${customerId}/`);
}
