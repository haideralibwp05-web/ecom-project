
import { useEffect, useRef, useState } from "react";
import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { authFetch } from "../../../services/authFetch";

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const API_URL = "http://127.0.0.1:8000/api/payments";

const STORAGE_KEY = "Shop.Co-pending-stripe";

interface PaymentItem {
    productId: number;
    quantity: number;
    size?: string;
    color?: string;
}

interface CustomerDetails {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    postalCode: string;
    address: string;
    notes: string;
}

interface SavedOrder {
    id: number;
    total: string | number;
}

interface StripePaymentFormProps {
    items: PaymentItem[];
    customerDetails: CustomerDetails;
    onPaymentSuccess: (order: SavedOrder) => void;
}

interface PaymentIntentResponse {
    client_secret?: string;
    payment_intent_id?: string;
    total?: string | number;
    error?: string;
}

interface PendingStripePayment {
    paymentIntentId: string;
    customerDetails: CustomerDetails;
    items: PaymentItem[];
}

interface PaymentFormProps extends StripePaymentFormProps {
    clientSecret: string;
    paymentIntentId: string;
    total: string;
}

const formatPrice = (value: number) =>
    `Rs. ${value.toLocaleString("en-PK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const savePendingPayment = (payment: PendingStripePayment) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payment));
};

const readPendingPayment = (): PendingStripePayment | null => {
    try {
        const saved = sessionStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return null;
        }

        const parsed: unknown = JSON.parse(saved);

        if (
            typeof parsed !== "object" ||
            parsed === null ||
            !("paymentIntentId" in parsed) ||
            !("customerDetails" in parsed) ||
            !("items" in parsed)
        ) {
            sessionStorage.removeItem(STORAGE_KEY);
            return null;
        }

        const payment = parsed as PendingStripePayment;

        if (
            typeof payment.paymentIntentId !== "string" ||
            !payment.paymentIntentId.startsWith("pi_") ||
            !Array.isArray(payment.items) ||
            payment.items.length === 0 ||
            typeof payment.customerDetails !== "object" ||
            payment.customerDetails === null
        ) {
            sessionStorage.removeItem(STORAGE_KEY);
            return null;
        }

        return payment;
    } catch {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
    }
};

const confirmSavedOrder = async (
    payment: PendingStripePayment
): Promise<SavedOrder> => {
    const response = await authFetch(`${API_URL}/confirm-order/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...payment.customerDetails,
            payment_intent_id: payment.paymentIntentId,
            items: payment.items,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error ||
            "Order confirmation failed. Please retry without paying again."
        );
    }

    if (!data.order?.id) {
        throw new Error(
            "The server did not return an order number. Please retry confirmation."
        );
    }

    return data.order;
};

const PaymentForm = ({
    items,
    customerDetails,
    onPaymentSuccess,
    paymentIntentId,
    total,
}: PaymentFormProps) => {
    const stripe = useStripe();
    const elements = useElements();

    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [paidIntentId, setPaidIntentId] = useState<string | null>(null);

    const handlePayment = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!stripe || !elements || submitting || paidIntentId) {
            return;
        }

        setSubmitting(true);
        setMessage("");

        const pendingPayment: PendingStripePayment = {
            paymentIntentId,
            customerDetails,
            items,
        };

        try {
            // Save details BEFORE Stripe can redirect the browser.
            savePendingPayment(pendingPayment);

            const result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout`,
                },
                redirect: "if_required",
            });

            if (result.error) {
                // A normal validation/payment error is not a successful payment.
                sessionStorage.removeItem(STORAGE_KEY);

                setMessage(
                    result.error.message ||
                    "Payment could not be completed. Please check your card details."
                );
                return;
            }

            const intent = result.paymentIntent;

            if (!intent?.id) {
                setMessage(
                    "Payment status could not be verified. Check your payment before trying again."
                );
                return;
            }

            if (intent.status !== "succeeded") {
                setMessage(
                    `Payment status: ${intent.status}. Do not make another payment until you have checked the existing payment.`
                );
                return;
            }

            setPaidIntentId(intent.id);

            // Confirm the existing successful payment with Django.
            const order = await confirmSavedOrder({
                ...pendingPayment,
                paymentIntentId: intent.id,
            });

            sessionStorage.removeItem(STORAGE_KEY);
            onPaymentSuccess(order);
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to confirm the order. Retry confirmation without paying again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetryConfirmation = async () => {
        if (!paidIntentId || submitting) {
            return;
        }

        setSubmitting(true);
        setMessage("");

        try {
            const order = await confirmSavedOrder({
                paymentIntentId: paidIntentId,
                customerDetails,
                items,
            });

            sessionStorage.removeItem(STORAGE_KEY);
            onPaymentSuccess(order);
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Order confirmation failed. Please retry."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handlePayment} className="stripePaymentForm">
            <h3>Card Payment</h3>

            {!paidIntentId && <PaymentElement />}

            {message && (
                <p role="alert" aria-live="polite">
                    {message}
                </p>
            )}

            {paidIntentId ? (
                <>
                    <p>
                        Payment was successful, but order confirmation
                        may still be pending. Do not pay again.
                    </p>

                    <button
                        type="button"
                        disabled={submitting}
                        onClick={handleRetryConfirmation}
                    >
                        {submitting
                            ? "Confirming Order..."
                            : "Retry Order Confirmation"}
                    </button>
                </>
            ) : (
                <button
                    type="submit"
                    disabled={!stripe || !elements || submitting}
                >
                    {submitting
                        ? "Processing Payment..."
                        : `Pay ${total}`}
                </button>
            )}

            <p>Use Stripe test mode for practice payments.</p>
        </form>
    );
};

const PendingPaymentRecovery = ({
    payment,
    onPaymentSuccess,
}: {
    payment: PendingStripePayment;
    onPaymentSuccess: (order: SavedOrder) => void;
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(
        "Checking your existing payment and order..."
    );
    const [canRetry, setCanRetry] = useState(false);
    const attempted = useRef(false);

    const retryConfirmation = async () => {
        if (submitting) {
            return;
        }

        setSubmitting(true);
        setMessage("Confirming your existing payment...");
        setCanRetry(false);

        try {
            const order = await confirmSavedOrder(payment);

            sessionStorage.removeItem(STORAGE_KEY);
            onPaymentSuccess(order);
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Order confirmation failed."
            );
            setCanRetry(true);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (!attempted.current) {
            attempted.current = true;
            void retryConfirmation();
        }
        // Recover the saved payment once when this component mounts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const restartCheckout = () => {
        const confirmed = window.confirm(
            "Only continue if you have verified that the previous payment failed or was cancelled. If it succeeded or money was deducted, retry order confirmation instead."
        );

        if (!confirmed) {
            return;
        }

        sessionStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    };

    return (
        <section className="stripePaymentForm">
            <h3>Recover Your Order</h3>

            <p>
                We found an existing payment attempt. We will try to
                confirm its order without charging your card again.
            </p>

            <p role="status" aria-live="polite">{message}</p>

            {canRetry && (
                <>
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={() => void retryConfirmation()}
                    >
                        {submitting
                            ? "Confirming..."
                            : "Retry Order Confirmation"}
                    </button>

                    <button
                        type="button"
                        disabled={submitting}
                        onClick={restartCheckout}
                    >
                        Restart Checkout
                    </button>
                </>
            )}
        </section>
    );
};

const StripePaymentForm = ({
    items,
    customerDetails,
    onPaymentSuccess,
}: StripePaymentFormProps) => {
    const [pendingPayment, setPendingPayment] =
        useState<PendingStripePayment | null>(() =>
            readPendingPayment()
        );

    const [clientSecret, setClientSecret] = useState("");
    const [paymentIntentId, setPaymentIntentId] = useState("");
    const [total, setTotal] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const itemsKey = JSON.stringify(items);

    useEffect(() => {
        // Recover first. Do not create a second PaymentIntent yet.
        if (pendingPayment) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        const createPaymentIntent = async () => {
            setLoading(true);
            setError("");
            setClientSecret("");
            setPaymentIntentId("");
            setTotal("");

            try {
                const response = await authFetch(
                    `${API_URL}/create-intent/`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            items: JSON.parse(itemsKey),
                        }),

                    }

                );

                const data: PaymentIntentResponse =
                    await response.json();

                if (!response.ok) {
                    console.error("Stripe API Error:", {
                        status: response.status,
                        data,
                    });

                    throw new Error(
                        data.error ||
                        (data as { detail?: string }).detail ||
                        `Payment initialization failed (${response.status}).`
                    );
                }
                if (
                    !data.client_secret ||
                    !data.payment_intent_id ||
                    data.total === undefined
                ) {
                    throw new Error(
                        "Payment API did not return all required details."
                    );
                }

                if (!cancelled) {
                    setClientSecret(data.client_secret);
                    setPaymentIntentId(data.payment_intent_id);
                    setTotal(formatPrice(Number(data.total)));
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load Stripe payment."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        if (items.length === 0) {
            setError("Your cart is empty.");
            setLoading(false);
            return;
        }

        void createPaymentIntent();

        return () => {
            cancelled = true;
        };
    }, [itemsKey, pendingPayment]);

    if (pendingPayment) {
        return (
            <PendingPaymentRecovery
                payment={pendingPayment}
                onPaymentSuccess={onPaymentSuccess}
            />
        );
    }

    if (loading) {
        return <p>Loading secure payment form...</p>;
    }

    if (error) {
        return <p role="alert">{error}</p>;
    }

    if (!clientSecret || !paymentIntentId) {
        return <p role="alert">Payment could not be initialized.</p>;
    }

    return (
        <Elements
            key={clientSecret}
            stripe={stripePromise}
            options={{ clientSecret }}
        >
            <PaymentForm
                items={items}
                customerDetails={customerDetails}
                onPaymentSuccess={onPaymentSuccess}
                clientSecret={clientSecret}
                paymentIntentId={paymentIntentId}
                total={total}
            />
        </Elements>
    );
};

export default StripePaymentForm;
