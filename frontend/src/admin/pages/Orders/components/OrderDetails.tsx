
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    LuUserRound,
    LuMapPin,
    LuCreditCard,
    LuPackage,
    LuCalculator,
} from "react-icons/lu";

import Navbar from "../../../components/shared/navbar";
import Sidebar from "../../../components/shared/sidebar";
import {
    getAdminOrderDetails,
    type AdminOrder,
} from "../../../../services/ordersApi";
import { FaArrowLeftLong } from "react-icons/fa6";
import "../../../../style.css";

const formatPKR = (amount: string | number) =>
    `Rs. ${Number(amount).toLocaleString("en-PK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-PK", {
        dateStyle: "medium",
        timeStyle: "short",
    });

const titleCase = (value: string) =>
    value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());

const InfoField = ({
    label,
    value,
}: {
    label: string;
    value: string | number | null | undefined;
}) => (
    <div className="order-detail-field">
        <span className="order-detail-label">{label}</span>
        <span className="order-detail-value">
            {value === null || value === undefined || value === ""
                ? "—"
                : value}
        </span>
    </div>
);

const OrderDetails = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();

    const [order, setOrder] = useState<AdminOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadOrder = async () => {
            const id = Number(orderId);

            if (!orderId || !Number.isInteger(id) || id < 1) {
                setError("Invalid order ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const result = await getAdminOrderDetails(id);

                if (active) {
                    setOrder(result);
                }
            } catch (err: unknown) {
                if (!active) return;

                if (
                    typeof err === "object" &&
                    err !== null &&
                    "response" in err
                ) {
                    const response = (
                        err as {
                            response?: {
                                status?: number;
                                data?: { error?: string };
                            };
                        }
                    ).response;

                    if (response?.status === 404) {
                        setError("Order not found.");
                    } else if (response?.status === 403) {
                        setError(
                            "You do not have permission to view this order."
                        );
                    } else {
                        setError(
                            response?.data?.error ||
                            "Could not load order details."
                        );
                    }
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Could not load order details.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadOrder();

        return () => {
            active = false;
        };
    }, [orderId]);

    return (
        <>
            <Navbar />

            <div className="admin-order-details-layout">
                <Sidebar />

                <main className="admin-order-details-main">
                    <button
                        type="button"
                        className="order-back-button"
                        onClick={() => navigate("/admin/orders")}
                    >
                        <FaArrowLeftLong />
                        Back to Orders
                    </button>

                    {loading ? (
                        <div className="order-details-message">
                            Loading order details...
                        </div>
                    ) : error ? (
                        <div
                            className="order-details-message order-details-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    ) : order ? (
                        <>
                            <header className="order-details-header">
                                <div>
                                    <h1>Order #{order.id}</h1>
                                    <p>
                                        Placed on {formatDate(order.created_at)}
                                    </p>
                                </div>

                                <span
                                    className={`order-status-badge order-status-${order.order_status}`}
                                >
                                    {titleCase(order.order_status)}
                                </span>
                            </header>

                            <div className="order-details-grid">
                                <section className="order-details-card">
                                    <div className="order-card-heading">
                                        <LuUserRound
                                            className="order-card-icon"
                                            aria-hidden="true"
                                        />
                                        <h2>Customer Details</h2>
                                    </div>

                                    <div className="order-card-content">
                                        <InfoField
                                            label="Full Name"
                                            value={order.full_name}
                                        />
                                        <InfoField
                                            label="Email"
                                            value={order.email}
                                        />
                                        <InfoField
                                            label="Phone"
                                            value={order.phone}
                                        />
                                    </div>
                                </section>

                                <section className="order-details-card">
                                    <div className="order-card-heading">
                                        <LuMapPin
                                            className="order-card-icon"
                                            aria-hidden="true"
                                        />
                                        <h2>Delivery Details</h2>
                                    </div>

                                    <div className="order-card-content">
                                        <InfoField
                                            label="Address"
                                            value={order.address}
                                        />
                                        <InfoField
                                            label="City"
                                            value={order.city}
                                        />
                                        <InfoField
                                            label="Postal Code"
                                            value={order.postal_code}
                                        />
                                        <InfoField
                                            label="Delivery Notes"
                                            value={order.notes}
                                        />
                                    </div>
                                </section>

                                <section className="order-details-card">
                                    <div className="order-card-heading">
                                        <LuCreditCard
                                            className="order-card-icon"
                                            aria-hidden="true"
                                        />
                                        <h2>Payment Details</h2>
                                    </div>

                                    <div className="order-card-content">
                                        <InfoField
                                            label="Payment Method"
                                            value={titleCase(
                                                order.payment_method
                                            )}
                                        />
                                        <InfoField
                                            label="Payment Status"
                                            value={titleCase(
                                                order.payment_status
                                            )}
                                        />
                                        <InfoField
                                            label="Order Status"
                                            value={titleCase(
                                                order.order_status
                                            )}
                                        />
{/* 
                                        {order.stripe_payment_intent_id && (
                                            <InfoField
                                                label="Stripe Payment Intent"
                                                value={
                                                    order.stripe_payment_intent_id
                                                }
                                            />
                                        )} */}
                                    </div>
                                </section>

                                <section className="order-details-card">
                                    <div className="order-card-heading">
                                        <LuPackage
                                            className="order-card-icon"
                                            aria-hidden="true"
                                        />
                                        <h2>Ordered Products</h2>
                                    </div>

                                    <div className="order-card-content">
                                        {order.items.length === 0 ? (
                                            <p className="order-empty-products">
                                                No products were found for
                                                this order.
                                            </p>
                                        ) : (
                                            <div className="order-products-list">
                                                {order.items.map((item) => (
                                                    <article
                                                        className="order-product"
                                                        key={item.id}
                                                    >
                                                        {item.product_image ? (
                                                            <img
                                                                className="order-product-image"
                                                                src={
                                                                    item.product_image
                                                                }
                                                                alt={
                                                                    item.product_name
                                                                }
                                                            />
                                                        ) : (
                                                            <div className="order-product-image order-product-no-image">
                                                                No image
                                                            </div>
                                                        )}
                                                        <div className="order-product-infoROW">
                                                            <div className="order-product-info">
                                                                <h3>
                                                                    {item.product_name}
                                                                </h3>

                                                                <p>
                                                                    Size:{" "}
                                                                    {item.size || "—"}
                                                                </p>
                                                                <p>
                                                                    Color:{" "}
                                                                    {item.color || "—"}
                                                                </p>
                                                                <p>
                                                                    Quantity:{" "}
                                                                    {item.quantity}
                                                                </p>
                                                                <p>
                                                                    Unit Price:{" "}
                                                                    {formatPKR(
                                                                        item.price
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <div className="order-product-total">
                                                                {formatPKR(
                                                                    Number(item.price) *
                                                                    item.quantity
                                                                )}
                                                            </div>
                                                        </div>
                                                    </article>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section className="order-details-card order-summary-card">
                                    <div className="order-card-heading">
                                        <LuCalculator
                                            className="order-card-icon"
                                            aria-hidden="true"
                                        />
                                        <h2>Order Summary</h2>
                                    </div>


                                    <div className="order-summary-content">
                                        <div className="order-summary-row">
                                            <span>Subtotal</span>
                                            <strong>
                                                {formatPKR(order.subtotal)}
                                            </strong>
                                        </div>

                                        <div className="order-summary-row">
                                            <span>Delivery Fee</span>
                                            <strong>
                                                {formatPKR(order.delivery_fee)}
                                            </strong>
                                        </div>

                                        <div className="order-summary-row order-summary-grand-total">
                                            <span>Grand Total</span>
                                            <strong>
                                                {formatPKR(order.total)}
                                            </strong>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </>
                    ) : null}
                </main>
            </div>
        </>
    );
};

export default OrderDetails;
