import { authFetch } from "./authFetch";
import type { AuthRole } from "./authSession";

const API_URL = "http://127.0.0.1:8000/api/categories/";

export interface Category {
    id: number;
    name: string;
    image: string | null;
    parent: number | null;
    parent_name: string | null;
}

const getErrorMessage = async (
    response: Response,
    fallback = "Something went wrong"
): Promise<string> => {
    const data = await response.json().catch(() => null);

    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;

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

// Default user token storefront ke liye; admin pages par "admin" pass karo.
export const getCategories = async (
    role: AuthRole = "user"
): Promise<Category[]> => {
    const response = await authFetch(API_URL, {}, role);

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Failed to fetch categories")
        );
    }

    return response.json();
};

export const getCategory = async (
    id: number,
    role: AuthRole = "user"
): Promise<Category> => {
    const response = await authFetch(`${API_URL}${id}/`, {}, role);

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Failed to fetch category")
        );
    }

    return response.json();
};

// Admin only: create category
export const createCategory = async (
    name: string,
    image?: File,
    parent: number | null = null
): Promise<Category> => {
    const formData = new FormData();
    formData.append("name", name);

    if (image) formData.append("image", image);
    if (parent !== null) formData.append("parent", String(parent));

    const response = await authFetch(
        API_URL,
        { method: "POST", body: formData },
        "admin"
    );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Failed to create category")
        );
    }

    return getResponseData<Category>(response);
};

// Admin only: update category
export const updateCategory = async (
    id: number,
    name: string,
    image?: File,
    parent?: number | null
): Promise<Category> => {
    const formData = new FormData();
    formData.append("name", name);

    if (image) formData.append("image", image);
    if (parent !== undefined) {
        formData.append("parent", parent === null ? "" : String(parent));
    }

    const response = await authFetch(
        `${API_URL}${id}/`,
        { method: "PATCH", body: formData },
        "admin"
    );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Failed to update category")
        );
    }

    return getResponseData<Category>(response);
};

// Admin only: delete category
export const deleteCategory = async (
    categoryId: number
): Promise<{ message: string }> => {
    const response = await authFetch(
        `${API_URL}${categoryId}/delete/`,
        { method: "DELETE" },
        "admin"
    );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Failed to delete category")
        );
    }

    return getResponseData<{ message: string }>(response);
};
