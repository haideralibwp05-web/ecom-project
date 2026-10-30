import { getAccessToken } from "./authSession";

const API_URL = "http://127.0.0.1:8000/api/orders";

export interface UserOrderItem {
    id: number;
    product: number | null;
    product_image: string | null;
    product_name: string;
    quantity: number;
    price: string;
    size: string;
    color: string;
}

export interface UserOrder {
    id: number;
    full_name: string;
    payment_method: "cod" | "stripe";
    payment_status: "pending" | "paid" | "failed";
    order_status: "pending" | "confirmed" | "cancelled";
    subtotal: string;
    delivery_fee: string;
    total: string;
    created_at: string;
    items: UserOrderItem[];
}

interface UserOrdersResponse {
    count: number;
    results: UserOrder[];
}

export const getMyOrders = async (): Promise<UserOrdersResponse> => {
    const token = getAccessToken("user");

    if (!token) {
        throw new Error("Please sign in to view your orders.");
    }

    const response = await fetch(`${API_URL}/my-orders/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error(
                "Your session has expired. Please sign in again."
            );
        }

        throw new Error("Failed to load orders.");
    }

    return response.json();
};