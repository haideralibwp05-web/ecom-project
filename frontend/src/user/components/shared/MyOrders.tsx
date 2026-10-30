import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMyOrders,
    type UserOrder,
} from "../../../services/userOrdersApi";

interface MyOrdersProps {
    onBack: () => void;
}

const formatPrice = (price: string | number) =>
    Number(price).toLocaleString("en-PK", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

const MyOrders = ({ onBack }: MyOrdersProps) => {
    const [orders, setOrders] = useState<UserOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Check whether the error is related to authentication.
    const isSessionExpired =
        /session.*expir|expir.*session|token|unauthorized|authentication|log in|login required/i.test(
            error
        );

    useEffect(() => {
        let active = true;

        const loadOrders = async () => {
            try {
                const response = await getMyOrders();

                if (active) {
                    setOrders(response.results);
                    setError("");
                }
            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Could not load your orders."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadOrders();

        return () => {
            active = false;
        };
    }, []);

    const handleLoginAgain = () => {
        navigate("/signin");
    };

    return (
        <section className="shopAccountView myOrders">
            <div className="shopSectionHeading">
                <h3>My Orders</h3>
            </div>

            {loading ? (
                <div className="shopOrdersMessage">
                    <span className="shopLoadingSpinner" />
                    <p>Loading your orders...</p>
                </div>
            ) : error ? (
                <div className="shopOrdersMessage shopOrdersError">
                    <p>{error}</p>

                    {isSessionExpired && (
                        <button
                            type="button"
                            className="loginAgainButton"
                            onClick={handleLoginAgain}
                        >
                            Login Again
                        </button>
                    )}
                </div>
            ) : orders.length === 0 ? (
                <div className="shopOrdersMessage">
                    <span className="shopEmptyOrderIcon">◇</span>
                    <h4>No orders yet</h4>
                    <p>Your orders will appear here after checkout.</p>
                </div>
            ) : (
                <div className="shopOrdersList">
                    {orders.map((order) => (
                        <article
                            key={order.id}
                            className="shopOrderCard"
                        >
                            <div className="shopOrderTop">
                                <div>
                                    <h4 className="shopOrderLabel">
                                        ORDER #{order.id}
                                    </h4>{" "}
                                    
                                </div>

                                <span
                                    className={`shopOrderBadge ${order.order_status}`}
                                >
                                    {order.order_status}
                                </span>
                            </div>

                            <p className="shopOrderDate">
                                {new Date(
                                    order.created_at
                                ).toLocaleDateString("en-PK", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>

                            <div className="shopOrderProducts">
                                {order.items.map((item) => (
                                    <div
                                        className="shopOrderProduct"
                                        key={item.id}
                                    >
                                        <div className="shopOrderImageWrap">
                                            {item.product_image ? (
                                                <img
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    className="shopOrderImage"
                                                />
                                            ) : (
                                                <div className="shopOrderImageFallback">
                                                    SHOP.CO
                                                </div>
                                            )}
                                        </div>

                                        <div className="shopOrderProductInfo">
                                            <h5>{item.product_name}</h5>

                                            <p>
                                                Quantity: {item.quantity}
                                            </p>

                                            {(item.color || item.size) && (
                                                <p>
                                                    {item.color &&
                                                        `Color: ${item.color}`}
                                                    {item.color &&
                                                        item.size &&
                                                        " · "}
                                                    {item.size &&
                                                        `Size: ${item.size}`}
                                                </p>
                                            )}

                                            <strong>
                                                Rs.{" "}
                                                {formatPrice(
                                                    Number(item.price) *
                                                        item.quantity
                                                )}
                                            </strong>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="shopOrderBottom">
                                <div className="shopOrderPayment">
                                    <span className="shopPaymentIcon">
                                        {order.payment_method === "cod"
                                            ? "▤"
                                            : "✓"}
                                    </span>

                                    <span>
                                        {order.payment_method === "cod"
                                            ? "Cash on Delivery"
                                            : order.payment_status === "paid"
                                              ? "Advance Paid"
                                              : "Online Payment"}
                                    </span>
                                </div>

                                <div className="shopOrderTotal">
                                    <span>Order Total</span>
                                    <strong>
                                        Rs. {formatPrice(order.total)}
                                    </strong>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MyOrders;
