import { useEffect, useState } from "react";

import { getProducts } from "../../../../services/productApi";
import {
    getDashboardStats,
    formatPKR,
} from "../../../../services/dashboardApi";

import type {
    DashboardStats,
    DashboardProduct,
} from "../../../../services/dashboardApi";

import { dashboardData as data } from "../../../data/dashboard";
import "../../../../style.css";

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [lowStockProducts, setLowStockProducts] = useState<
        DashboardProduct[]
    >([]);


    useEffect(() => {
        let active = true;

        const loadDashboard = async () => {
            setLoading(true);
            setError("");

            try {
                const [result, productsResponse] = await Promise.all([
                    getDashboardStats(),
                    getProducts(),
                ]);

                if (!active) return;

                setStats(result);

                const products: DashboardProduct[] = Array.isArray(
                    productsResponse
                )
                    ? productsResponse
                    : productsResponse.results ?? [];

                setLowStockProducts(
                    products.filter(
                        (product) =>
                            typeof product.stock === "number" &&
                            product.stock < 10
                    )
                );
            } catch (err) {
                console.error("Dashboard fetch error:", err);

                if (active) {
                    setError("Dashboard data cannot load.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadDashboard();

        return () => {
            active = false;
        };
    }, []);

    const formatDate = (value: string) => {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString("en-PK", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const titleCase = (value: string) =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    const getImageUrl = (image?: string) => {
        if (!image) return "";

        if (image.startsWith("http://") || image.startsWith("https://")) {
            return image;
        }

        return `http://127.0.0.1:8000${image.startsWith("/") ? "" : "/"
            }${image}`;
    };

    const getCardValue = (title: string, staticValue: unknown) => {
        if (loading) return "...";

        if (!stats) return "—";

        switch (title) {
            case "Total Sales":
                return formatPKR(stats.totalSales);

            case "Total Orders":
                return stats.totalOrders;

            case "Total Products":
                return stats.totalProducts;

            default:
                return staticValue as React.ReactNode;
        }
    };

    return (
        <main className="adminPages">
            <div className="adminPagesHeader">
                <h2>{data.title}</h2>
            </div>

            {error && (
                <p className="adminOrdersMessage" role="alert">
                    {error}
                </p>
            )}

            {/* Overview */}

            <section className="adminDashboardSection">
                <h3>{data.overview.title}</h3>

                <div className="adminDashboardCards">
                    {data.overview.cards.map((card, index) => (
                        <div
                            key={index}
                            className="adminDashboardCard"
                        >
                            <h3>{card.title}</h3>

                            <span>
                                {getCardValue(card.title, card.value)}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <div className="adminDashboardGrid">
                {/* Recent Orders */}

                <section className="adminDashboardBox">
                    <h3>{data.recentOrders.title}</h3>

                    <table className="adminPagesBox_Table">
                        <thead>
                            <tr className="dashboardOrder_Heading">
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {stats?.recentOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="dashboardOrder_Values"
                                >
                                    <td>#{order.id}</td>

                                    <td>{order.full_name}</td>

                                    <td>{formatDate(order.created_at)}</td>

                                    <td>
                                        <span
                                            className={
                                                order.payment_status === "paid"
                                                    ? "adminOrdersPaid"
                                                    : order.order_status === "confirmed"
                                                        ? "adminOrdersShipped"
                                                        : "adminOrdersPending"
                                            }
                                        >
                                            {titleCase(order.order_status)}
                                        </span>
                                    </td>

                                    <td>{formatPKR(Number(order.total))}</td>
                                </tr>
                            ))}

                            {!loading &&
                                stats?.recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={5}>
                                            No Order Yet
                                        </td>
                                    </tr>
                                )}

                            {loading && (
                                <tr>
                                    <td colSpan={5}>
                                        Loading recent orders...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>

                {/* Top Products */}

                <section className="adminDashboardBox">
                    <h3>{data.topProducts.title}</h3>

                    {loading && <p>Loading top products...</p>}

                    {!loading &&
                        stats?.topProducts.map((product, index) => (
                            <div
                                className="adminDashboardProduct"
                                key={`${product.id ?? product.name}-${index}`}
                            >
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />
                                ) : (
                                    <div className="adminDashboardProductImagePlaceholder">
                                        No Image
                                    </div>
                                )}

                                <div>
                                    <strong>{product.name}</strong>
                                    <span>{product.quantity} Sales</span>
                                </div>

                                <b>{formatPKR(product.sales)}</b>
                            </div>
                        ))}

                    {!loading &&
                        stats?.topProducts.length === 0 && (
                            <p>No ordered products yet.</p>
                        )}
                </section>
            </div>

            {/* Low Stock */}

            <section className="adminDashboardBox">
                <h3>{data.lowStock.title}</h3>

                <div className="adminDashboardLowStock">
                    {lowStockProducts.map((product) => (
                        <div
                            key={product.id}
                            className="adminDashboardProduct"
                        >
                            <img
                                src={getImageUrl(
                                    product.images?.[0]?.image
                                )}
                                alt={product.name}
                            />

                            <div>
                                <strong>{product.name}</strong>

                                <span>
                                    {product.stock} in stock
                                </span>
                            </div>
                        </div>
                    ))}

                    {!loading &&
                        lowStockProducts.length === 0 && (
                            <p>No low stock products.</p>
                        )}
                </div>
            </section>
        </main>
    );
};

export default Dashboard;