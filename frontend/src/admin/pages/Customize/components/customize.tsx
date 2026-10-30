
import { useEffect, useState } from "react";
import "../../../../style.css";
import {
    getDeliveryFee,
    updateDeliveryFee,
} from "../../../../services/customizeApi";

const Customize = () => {
    const [deliveryFee, setDeliveryFee] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDeliveryFee = async () => {
            try {
                const data = await getDeliveryFee("admin");

                setDeliveryFee(
                    String(Math.trunc(Number(data.delivery_fee)))
                );
            } catch {
                setError("Failed to load the delivery fee.");
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveryFee();
    }, []);

    const handleSave = async () => {
        const fee = Number(deliveryFee);

        if (
            deliveryFee.trim() === "" ||
            !Number.isSafeInteger(fee) ||
            fee < 0
        ) {
            setError("Enter a valid whole delivery fee.");
            setMessage("");
            return;
        }

        setSaving(true);
        setError("");
        setMessage("");

        try {
            const data = await updateDeliveryFee(fee);

            setDeliveryFee(
                String(Math.trunc(Number(data.delivery_fee)))
            );

            setMessage("Delivery fee saved successfully.");
        } catch (err: any) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.delivery_fee?.[0] ||
                err.message ||
                "Failed to save the delivery fee."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="adminPages">
            <div className="adminPagesHeader">
                <h2>Customize</h2>
            </div>

            <div className="deliveryFeeBox">
                <h2>Delivery Fee</h2>

                {loading ? (
                    <p>Loading delivery fee...</p>
                ) : (
                    <>
                        <div className="deliveryFeeForm">
                            <input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="Enter delivery fee"
                                value={deliveryFee}
                                onChange={(e) => {
                                    setDeliveryFee(e.target.value);
                                    setMessage("");
                                    setError("");
                                }}
                            />

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={
                                    saving ||
                                    deliveryFee.trim() === "" ||
                                    !Number.isSafeInteger(Number(deliveryFee)) ||
                                    Number(deliveryFee) < 0
                                }
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>

                        {message && (
                            <p style={{ color: "green" }}>
                                {message}
                            </p>
                        )}

                        {error && (
                            <p style={{ color: "red" }}>
                                {error}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Customize;
