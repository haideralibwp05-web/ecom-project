import { useEffect, useRef, useState } from "react";
import { getDeliveryFee } from "../../../services/customizeApi";
import { useCart } from "../../pages/Cart/components/CartContext";
import "../../../style.css";
import StripePaymentForm from "./StripePaymentForm";
import OrderItems from "./OrderItems";
import { authFetch } from "../../../services/authFetch";
import {
    validateCheckout,
    isCheckoutValid,
    type CustomerDetails,
    type CheckoutErrors,
} from "../../../utils/validations/user";
import { ArrowLeft } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

interface BuyNowItem {
    productId: number;
    name: string;
    image: string;
    price: number;
    originalPrice: number;
    size: string;
    color: string;
    colorHex: string;
    quantity: number;
    stock: number;
}

interface CheckoutLocationState {
    buyNowItem?: BuyNowItem;
}

const Checkout = () => {
    const [submitting, setSubmitting] = useState(false);
    const orderCompletedRef = useRef(false);

    const { cartItems, clearCart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    const buyNowItem = (
        location.state as CheckoutLocationState | null
    )?.buyNowItem;

    // Buy Now mein sirf selected product; normal checkout mein cart items.
    const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;

    const [deliveryFee, setDeliveryFee] = useState(0);
    const [deliveryFeeLoading, setDeliveryFeeLoading] = useState(true);

    useEffect(() => {
        const fetchDeliveryFee = async () => {
            try {
                const data = await getDeliveryFee();
                setDeliveryFee(Number(data.delivery_fee) || 0);
            } catch (error) {
                console.error("Delivery fee load error:", error);
            } finally {
                setDeliveryFeeLoading(false);
            }
        };

        fetchDeliveryFee();
    }, []);

    const discountedSubtotal = checkoutItems.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
    );

    const effectiveDeliveryFee =
        checkoutItems.length === 0 ? 0 : deliveryFee;

    const total = discountedSubtotal + effectiveDeliveryFee;

    const formatPrice = (price: number) =>
        `Rs. ${price.toLocaleString("en-PK")}`;

    const [message, setMessage] = useState("");
    const [advancePayment, setAdvancePayment] = useState(false);

    const [formData, setFormData] = useState<CustomerDetails>({
        fullName: "",
        phone: "",
        email: "",
        city: "",
        postalCode: "",
        address: "",
        notes: "",
    });

    const [touched, setTouched] = useState<
        Partial<Record<keyof CustomerDetails, boolean>>
    >({});

    const [showErrors, setShowErrors] = useState(false);

    const errors: CheckoutErrors = validateCheckout(formData);
    const formIsValid = isCheckoutValid(formData);

    const canAdvancePay =
        formIsValid && checkoutItems.length > 0;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        const updatedData = {
            ...formData,
            [name]: value,
        };

        setFormData(updatedData);
        setMessage("");

        if (!isCheckoutValid(updatedData)) {
            setAdvancePayment(false);
        }
    };

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const name = e.target.name as keyof CustomerDetails;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));
    };

    const getError = (
        field: keyof CustomerDetails
    ): string | undefined => {
        if (showErrors || touched[field]) {
            return errors[field];
        }

        return undefined;
    };

    const handlePaymentToggle = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.checked && !canAdvancePay) {
            setShowErrors(true);
            setMessage(
                "Please correct the highlighted delivery details before paying by card."
            );

            const firstInvalidField = Object.keys(errors)[0];

            if (firstInvalidField) {
                document.getElementById(firstInvalidField)?.focus();
            }

            return;
        }

        setAdvancePayment(e.target.checked);
        setMessage("");
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setShowErrors(true);
        setMessage("");

        if (!formIsValid) {
            setMessage("Please complete all required fields correctly.");

            const firstInvalidField = Object.keys(errors)[0];

            if (firstInvalidField) {
                document.getElementById(firstInvalidField)?.focus();
            }

            return;
        }

        if (checkoutItems.length === 0) {
            setMessage("Your cart is empty.");
            return;
        }

        // Stripe payment uske apne Pay button se process hoti hai.
        if (advancePayment) {
            setMessage("Please complete your card payment below.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await authFetch(
                "http://127.0.0.1:8000/api/orders/create/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...formData,
                        items: checkoutItems.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            size: item.size,
                            color: item.color,
                        })),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error("COD Order API Error:", {
                    status: response.status,
                    data,
                });

                throw new Error(
                    data.error ||
                    data.detail ||
                    JSON.stringify(data) ||
                    "Unable to place your order."
                );
            }

            if (!data.order?.id) {
                throw new Error(
                    "The order response did not include an order number."
                );
            }

            orderCompletedRef.current = true;

            // Buy Now mein existing cart ko bilkul clear nahi karna.
            if (!buyNowItem) {
                clearCart();
            }

            navigate("/order-success", {
                replace: true,
                state: {
                    orderId: data.order.id,
                    paymentMethod: "cod",
                    total: data.order.total,
                },
            });
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Sirf tab redirect karein jab Buy Now item bhi na ho aur cart bhi empty ho.
    if (
        checkoutItems.length === 0 &&
        !orderCompletedRef.current &&
        !submitting
    ) {
        return <Navigate to="/CartPage" replace />;
    }

    if (submitting) {
        return (
            <div
                className="PageLoading"
                role="status"
                aria-label="Placing your order"
            >
                <div className="pageLoadingSpinner" />
            </div>
        );
    }

    return (
        <main className="checkoutPage">
            <div className="checkoutContainer">
                <button
                    type="button"
                    className="checkoutBackButton"
                    onClick={() => navigate(buyNowItem ? "/" : "/cartPage")}
                >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>

                <h1 className="checkoutTitle">Checkout</h1>

                <div className="checkoutLayout">
                    <section className="checkoutFormCard">
                        <div className="checkoutDetailsGrid">
                            <div className="checkoutDeliverySection">
                                <h2>Delivery Details</h2>

                                <p className="checkoutSubtitle">
                                    Enter your information for delivery.
                                </p>

                                <form
                                    id="checkoutDeliveryForm"
                                    onSubmit={handleSubmit}
                                    noValidate
                                >
                                    <div className="checkoutFields">
                                        <div className="checkoutField">
                                            <label htmlFor="fullName">
                                                Full Name *
                                            </label>
                                            <input
                                                id="fullName"
                                                name="fullName"
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={!!getError("fullName")}
                                                required
                                                autoComplete="name"
                                            />
                                            {getError("fullName") && (
                                                <p className="checkoutFieldError">
                                                    {getError("fullName")}
                                                </p>
                                            )}
                                        </div>

                                        <div className="checkoutField">
                                            <label htmlFor="phone">
                                                Phone Number *
                                            </label>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="03XXXXXXXXX"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={!!getError("phone")}
                                                pattern="03[0-9]{9}"
                                                maxLength={11}
                                                required
                                                autoComplete="tel"
                                            />
                                            {getError("phone") && (
                                                <p className="checkoutFieldError">
                                                    {getError("phone")}
                                                </p>
                                            )}
                                        </div>

                                        <div className="checkoutField">
                                            <label htmlFor="email">
                                                Email Address *
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={!!getError("email")}
                                                required
                                                autoComplete="email"
                                            />
                                            {getError("email") && (
                                                <p className="checkoutFieldError">
                                                    {getError("email")}
                                                </p>
                                            )}
                                        </div>

                                        <div className="checkoutField">
                                            <label htmlFor="city">
                                                City *
                                            </label>
                                            <input
                                                id="city"
                                                name="city"
                                                type="text"
                                                placeholder="Enter your city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={!!getError("city")}
                                                required
                                                autoComplete="address-level2"
                                            />
                                            {getError("city") && (
                                                <p className="checkoutFieldError">
                                                    {getError("city")}
                                                </p>
                                            )}
                                        </div>

                                        <div className="checkoutField checkoutFieldFull">
                                            <label htmlFor="postalCode">
                                                Postal Code *
                                            </label>
                                            <input
                                                id="postalCode"
                                                name="postalCode"
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="Enter 5-digit postal code"
                                                value={formData.postalCode}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={!!getError("postalCode")}
                                                pattern="[0-9]{5}"
                                                maxLength={5}
                                                required
                                                autoComplete="postal-code"
                                            />
                                            {getError("postalCode") && (
                                                <p className="checkoutFieldError">
                                                    {getError("postalCode")}
                                                </p>
                                            )}
                                        </div>

                                        <div className="checkoutField checkoutFieldFull">
                                            <label htmlFor="address">
                                                Complete Address *
                                            </label>
                                            <textarea
                                                id="address"
                                                name="address"
                                                placeholder="House number, street, area..."
                                                rows={4}
                                                value={formData.address}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={!!getError("address")}
                                                required
                                                autoComplete="street-address"
                                            />
                                            {getError("address") && (
                                                <p className="checkoutFieldError">
                                                    {getError("address")}
                                                </p>
                                            )}
                                        </div>

                                        <div className="checkoutField checkoutFieldFull">
                                            <label htmlFor="notes">
                                                Order Notes (Optional)
                                            </label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                placeholder="Any special delivery instructions?"
                                                rows={3}
                                                value={formData.notes}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <OrderItems items={checkoutItems} />
                        </div>

                        <div className="checkoutPayment">
                            <h2>Payment Method</h2>

                            <div className="checkoutPaymentBox">
                                <div className="checkoutPaymentInfo">
                                    <h3>
                                        {advancePayment
                                            ? "Advance Payment"
                                            : "Cash on Delivery"}
                                    </h3>

                                    <p>
                                        {advancePayment
                                            ? "Pay in advance to confirm your order."
                                            : "Pay when your order is delivered."}
                                    </p>
                                </div>

                                <label
                                    className={`checkoutSwitch ${
                                        !canAdvancePay
                                            ? "checkoutSwitchDisabled"
                                            : ""
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={advancePayment}
                                        onChange={handlePaymentToggle}
                                        disabled={checkoutItems.length === 0}
                                        aria-label="Enable advance payment"
                                    />
                                    <span className="checkoutSwitchSlider" />
                                </label>
                            </div>

                            {!formIsValid && checkoutItems.length > 0 && (
                                <p className="checkoutPaymentHint">
                                    Complete the highlighted required delivery
                                    details to continue to card payment.
                                </p>
                            )}

                            {advancePayment && canAdvancePay && (
                                <div className="checkoutStripeSection">
                                    <StripePaymentForm
                                        items={checkoutItems.map((item) => ({
                                            productId: item.productId,
                                            quantity: item.quantity,
                                            size: item.size,
                                            color: item.color,
                                        }))}
                                        customerDetails={formData}
                                        onPaymentSuccess={(order) => {
                                            orderCompletedRef.current = true;

                                            // Buy Now order existing cart ko delete nahi karega.
                                            if (!buyNowItem) {
                                                clearCart();
                                            }

                                            navigate("/order-success", {
                                                replace: true,
                                                state: {
                                                    orderId: order.id,
                                                    paymentMethod: "stripe",
                                                    total: order.total,
                                                },
                                            });
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {message && (
                            <p className="checkoutMessage" role="status">
                                {message}
                            </p>
                        )}

                        {!advancePayment && (
                            <div className="checkoutOrderFooter">
                                <div className="checkoutTotalPayment">
                                    <span>Total Payment</span>

                                    <h3>
                                        {deliveryFeeLoading
                                            ? "Loading..."
                                            : formatPrice(total)}
                                    </h3>
                                </div>

                                <button
                                    className="checkoutPlaceOrder"
                                    type="submit"
                                    form="checkoutDeliveryForm"
                                    disabled={
                                        submitting ||
                                        deliveryFeeLoading ||
                                        checkoutItems.length === 0
                                    }
                                >
                                    {submitting ? "Processing..." : "Place Order"}
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Checkout;