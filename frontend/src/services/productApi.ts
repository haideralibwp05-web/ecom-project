import { authFetch } from "./authFetch";
import type { AuthRole } from "./authSession";

const API_BASE_URL = "http://127.0.0.1:8000";
const PRODUCTS_API_URL = `${API_BASE_URL}/api/products/`;
const CREATE_PRODUCT_API_URL = `${API_BASE_URL}/api/products/add/`;

const getErrorMessage = async (
    response: Response,
    fallback: string
): Promise<string> => {
    const data = await response.json().catch(() => null);

    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.error === "string") return data.error;
    if (typeof data?.message === "string") return data.message;

    if (data && typeof data === "object") {
        const messages = Object.values(data)
            .flatMap((value) => Array.isArray(value) ? value : [value])
            .filter((value): value is string => typeof value === "string");

        if (messages.length > 0) return messages.join(" ");
    }

    return fallback;
};

const getResponseData = async <T>(response: Response): Promise<T> => {
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
};

const fetchProducts = async (
    url: string,
    role: AuthRole,
    fallback: string
) => {
    const response = await authFetch(url, {}, role);

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, fallback));
    }

    return response.json();
};

// Default role user hai. Admin pages par getProducts("admin") use karo.
export const getProducts = (role: AuthRole = "user") =>
    fetchProducts(PRODUCTS_API_URL, role, "Failed to fetch products");

export const getNewArrivals = (role: AuthRole = "user") =>
    fetchProducts(
        `${PRODUCTS_API_URL}?section=new-arrivals`,
        role,
        "Failed to fetch new arrivals"
    );

export const getTopSelling = (role: AuthRole = "user") =>
    fetchProducts(
        `${PRODUCTS_API_URL}?section=top-selling`,
        role,
        "Failed to fetch top selling products"
    );

export const getProductsByCategory = (
    categoryId: number,
    role: AuthRole = "user"
) =>
    fetchProducts(
        `${PRODUCTS_API_URL}?category=${categoryId}`,
        role,
        "Failed to fetch category products"
    );

// Admin only: product create
export const createProduct = async (formData: FormData) => {
    const response = await authFetch(
        CREATE_PRODUCT_API_URL,
        { method: "POST", body: formData },
        "admin"
    );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Failed to create product")
        );
    }

    return getResponseData(response);
};

// Admin only: product delete
export const deleteProduct = async (productId: number) => {
    const response = await authFetch(
        `${PRODUCTS_API_URL}${productId}/delete/`,
        { method: "DELETE" },
        "admin"
    );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Failed to delete product")
        );
    }

    return getResponseData(response);
};

// Admin only: product update
export const updateProduct = async (
    productId: number,
    formData: FormData
) => {
    const response = await authFetch(
        `${PRODUCTS_API_URL}${productId}/update/`,
        { method: "PATCH", body: formData },
        "admin"
    );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Failed to update product")
        );
    }

    return getResponseData(response);
};
