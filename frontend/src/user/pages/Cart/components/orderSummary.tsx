import { useEffect, useState } from "react";
import { Order_SummaryData } from "../../../data/orderSummary";
import { useCart } from "../../Cart/components/CartContext";
import { getDeliveryFee } from "../../../../services/customizeApi";
import { getAccessToken } from "../../../../services/authSession";
import { useNavigate } from "react-router-dom";

const OrderSummary = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const [deliveryFee, setDeliveryFee] = useState(0);

    // Cart empty ho to delivery fee zero hogi
    const effectiveDeliveryFee =
        cartItems.length === 0 ? 0 : deliveryFee;

    useEffect(() => {
        const fetchDeliveryFee = async () => {
            try {
                const data = await getDeliveryFee();
                setDeliveryFee(Number(data.delivery_fee) || 0);
            } catch (error) {
                console.error("Delivery fee load error:", error);
            }
        };

        fetchDeliveryFee();
    }, []);

    // Original prices total
    const subtotal = cartItems.reduce(
        (total, item) =>
            total + Number(item.originalPrice) * item.quantity,
        0
    );

    // Discounted prices total
    const discountedSubtotal = cartItems.reduce(
        (total, item) =>
            total + Number(item.price) * item.quantity,
        0
    );

    // Total discount
    const discountAmount = Math.max(
        0,
        subtotal - discountedSubtotal
    );

    // Discount percentage
    const discountPercentage =
        subtotal > 0
            ? Math.round((discountAmount / subtotal) * 100)
            : 0;

    // Final payable amount
    const total = discountedSubtotal + effectiveDeliveryFee;

    const formatPrice = (price: number) =>
        `Rs. ${price.toLocaleString("en-PK")}`;

    return (
        <div className="CartPage_Box Summary_box">
            <b>{Order_SummaryData.Heading}</b>

            <div className="Payment_Details">
                <div>
                    <span>{Order_SummaryData.Sub_total.text}</span>
                    <b>{formatPrice(subtotal)}</b>
                </div>

                <div>
                    <span>
                        {Order_SummaryData.Discount.text}
                        {` (${discountPercentage}%)`}
                    </span>

                    <b style={{ color: "#FF3333" }}>
                        - {formatPrice(discountAmount)}
                    </b>
                </div>

                <div>
                    <span>Discounted Subtotal</span>
                    <b>{formatPrice(discountedSubtotal)}</b>
                </div>

                {/* Delivery Fee from Django API */}
                <div>
                    <span>{Order_SummaryData.DelivryFee.text}</span>

                    <b>
                        {effectiveDeliveryFee === 0
                            ? "Rs. 0"
                            : formatPrice(effectiveDeliveryFee)}
                    </b>
                </div>

                <div className="SummaryBorder" />

                <div>
                    <span style={{ color: "#000000" }}>
                        {Order_SummaryData.Total.text}
                    </span>

                    <b style={{ fontSize: "24px" }}>
                        {formatPrice(total)}
                    </b>
                </div>
            </div>

            <button
                className="checkOutBtn"
                disabled={cartItems.length === 0}
                onClick={() => {
                    const accessToken = getAccessToken("user");

                    if (!accessToken) {
                        navigate("/signin", {
                            state: { from: "/checkout" },
                        });
                        return;
                    }

                    navigate("/checkout");
                }}
            >
                <span>{Order_SummaryData.CheckoutBtn.Text}</span>
                <img
                    src={Order_SummaryData.CheckoutBtn.Icon}
                    alt=""
                />
            </button>
        </div>
    );
};

export default OrderSummary;