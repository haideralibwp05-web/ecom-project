import { getAdminOrders } from "./ordersApi";
import type { AdminOrder } from "./ordersApi";
import { getProducts } from "./productApi";

const API_BASE = "http://127.0.0.1:8000";

export interface DashboardProduct {
    id: number;
    name: string;
    stock: number;
    images: {
        id: number;
        image: string;
    }[];
}

export interface TopProduct {
    id: number | null;
    name: string;
    image: string;
    orders: number;
    quantity: number;
    sales: number;
}

export interface DashboardStats {
    totalOrders: number;
    totalProducts: number;
    totalSales: number;
    recentOrders: AdminOrder[];
    topProducts: TopProduct[];
}

export const formatPKR = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 2,
    }).format(amount);
};

const getImageUrl = (image?: string) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    return `${API_BASE}${image.startsWith("/") ? "" : "/"}${image}`;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const [orders, productsResponse] = await Promise.all([
        getAdminOrders(),
        getProducts(),
    ]);

    const products: DashboardProduct[] = Array.isArray(productsResponse)
        ? productsResponse
        : productsResponse.results ?? [];

    const totalOrders = orders.length;
    const totalProducts = products.length;

    //paid aur non-cancelled orders count
    const validOrders = orders.filter(
        (order) =>
            order.payment_status === "paid" &&
            order.order_status !== "cancelled"
    );

    const totalSales = validOrders.reduce(
        (sum, order) => sum + Number(order.total),
        0
    );

    const recentOrders = [...orders]
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime() ||
                b.id - a.id
        )
        .slice(0, 4);

    const productMap = new Map<number, DashboardProduct>();

    products.forEach((product) => {
        productMap.set(product.id, product);
    });

    const topProductsMap = new Map<string, TopProduct>();

    validOrders.forEach((order) => {
        const countedProducts = new Set<string>();

        order.items.forEach((item) => {
            const key =
                item.product !== null
                    ? `product-${item.product}`
                    : `deleted-${item.product_name}`;

            const existing = topProductsMap.get(key);

            const product =
                item.product !== null
                    ? productMap.get(item.product)
                    : undefined;

            if (!existing) {
                topProductsMap.set(key, {
                    id: item.product,
                    name: product?.name ?? item.product_name,
                    image: getImageUrl(product?.images?.[0]?.image),
                    orders: 0,
                    quantity: 0,
                    sales: 0,
                });
            }

            const current = topProductsMap.get(key)!;

            if (!countedProducts.has(key)) {
                current.orders += 1;
                countedProducts.add(key);
            }

            current.quantity += item.quantity;
            current.sales += Number(item.price) * item.quantity;
        });
    });

    const topProducts = [...topProductsMap.values()]
    .sort(
        (a, b) =>
            b.quantity - a.quantity ||
            b.sales - a.sales
    )
    .slice(0, 4);

    return {
        totalOrders,
        totalProducts,
        totalSales,
        recentOrders,
        topProducts,
    };
};