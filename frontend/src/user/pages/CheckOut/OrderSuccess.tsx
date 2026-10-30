
import { useState } from "react";
import { Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import "../../../style.css";

interface OrderSuccessState {
    orderId?: number | string;
    paymentMethod?: "cod" | "stripe";
    total?: number | string;
    paymentIntentId?: string;
}

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state as OrderSuccessState | null;

    const [loading, setLoading] = useState(false);

    if (!order?.paymentMethod) {
        return <Navigate to="/" replace />;
    }

    const handleContinueShopping = (
        e: React.MouseEvent<HTMLAnchorElement>
    ) => {
        e.preventDefault();
        setLoading(true);

        navigate("/", { replace: true });
    };

    if (loading) {
        return (
            <div
                className="PageLoading"
                role="status"
                aria-label="Loading home page"
            >
                <div className="pageLoadingSpinner" />
            </div>
        );
    }

    return (
        <main className="orderSuccessPage">
            <section className="orderSuccessCard">
                <div className="orderSuccessIcon" aria-hidden="true">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                </div>

                <p className="orderSuccessEyebrow">
                    ORDER CONFIRMATION
                </p>

                <h1>Thank You for Your Order!</h1>

                <p className="orderSuccessDescription">
                    Your order has been received. Thank you for shopping
                    with Us — we appreciate your trust.
                </p>

                <div className="orderSuccessDetails">
                    <div className="orderSuccessDetailRow">
                        <span>Order Number</span>
                        <strong>
                            {order.orderId ? `#${order.orderId}` : "Confirmed"}
                        </strong>
                    </div>

                    <div className="orderSuccessDetailRow">
                        <span>Payment Method</span>
                        <strong>
                            {order.paymentMethod === "cod"
                                ? "Cash on Delivery"
                                : "Stripe Card Payment"}
                        </strong>
                    </div>

                    {order.total !== undefined && (
                        <div className="orderSuccessDetailRow">
                            <span>Total</span>
                            <strong>
                                Rs. {Number(order.total).toLocaleString("en-PK")}
                            </strong>
                        </div>
                    )}
                </div>

                <div className="orderSuccessNext">
                    <h2>What's Next?</h2>
                    <p>
                        {order.paymentMethod === "cod"
                            ? "Please keep the payment ready when your order is delivered."
                            : "Your payment has been completed. Thank you for trust on us."}
                    </p>
                </div>

                <Link
                    to="/"
                    className="orderSuccessContinue"
                    onClick={handleContinueShopping}
                >
                    Continue Shopping
                    <span aria-hidden="true">→</span>
                </Link>
            </section>
        </main>
    );
};

export default OrderSuccess;
