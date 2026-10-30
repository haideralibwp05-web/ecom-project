
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    LuArrowLeft,
    LuUserRound,
    LuShoppingBag,
    LuWallet,
    LuPackage,
    LuHistory,
    LuMail,
    LuHash,
    LuCalendarDays,
    LuExternalLink,
} from "react-icons/lu";

import Navbar from "../../../components/shared/navbar";
import Sidebar from "../../../components/shared/sidebar";

import {
    getAdminCustomerDetails,
    type CustomerDetails as CustomerDetailsType,
} from "../../../../services/customersApi";

import "../../../../style.css";

const formatMoney = (value: string | number) =>
    `Rs. ${Number(value || 0).toLocaleString("en-PK", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;

const formatDate = (value: string | null) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatStatus = (value: string) =>
    value.replace(/_/g, " ").replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
    );

const CustomerDetails = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const navigate = useNavigate();

    const [details, setDetails] = useState<CustomerDetailsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadDetails = async () => {
            const id = Number(customerId);

            if (!Number.isInteger(id) || id <= 0) {
                setError("Invalid customer ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const result = await getAdminCustomerDetails(id);

                if (active) {
                    setDetails(result);
                }
            } catch {
                if (active) {
                    setError("Unable to load customer details.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadDetails();

        return () => {
            active = false;
        };
    }, [customerId]);

    return (
        <>
            <Navbar />

            <div className="customer-details-layout">
                <Sidebar />

                <main className="adminPages customer-details-main">
                    <button
                        type="button"
                        className="customer-details-back"
                        onClick={() => navigate("/admin/customers")}
                    >
                        <LuArrowLeft />
                        Back to Customers
                    </button>

                    {loading ? (
                        <div className="customer-details-message">
                            Loading customer details...
                        </div>
                    ) : error ? (
                        <div className="customer-details-message customer-details-error">
                            {error}
                        </div>
                    ) : details ? (
                        <>
                            <div className="customer-details-header">
                                <div>
                                    <h2>Customer Details</h2>
                                    <p>
                                        Customer profile and complete order history
                                    </p>
                                </div>

                                <span className="customer-details-id">
                                    Customer #{details.customer.id}
                                </span>
                            </div>

                            <section className="customer-details-card">
                                <div className="customer-details-card-heading">
                                    <LuUserRound className="customer-details-heading-icon" />

                                    <div>
                                        <h3>Customer Information</h3>
                                        <p>Account information from signup</p>
                                    </div>
                                </div>

                                <div className="customer-details-profile-grid">
                                    <div className="customer-details-info">
                                        <LuUserRound />
                                        <div>
                                            <span>Username</span>
                                            <strong>
                                                {details.customer.username}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="customer-details-info">
                                        <LuMail />
                                        <div>
                                            <span>Email</span>
                                            <strong>
                                                {details.customer.email || "—"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="customer-details-info">
                                        <LuHash />
                                        <div>
                                            <span>User ID</span>
                                            <strong>
                                                #{details.customer.id}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="customer-details-info">
                                        <LuCalendarDays />
                                        <div>
                                            <span>Joined On</span>
                                            <strong>
                                                {formatDate(
                                                    details.customer.date_joined
                                                )}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="customer-details-stats">
                                <section className="customer-details-stat-card">
                                    <div className="customer-details-stat-icon">
                                        <LuShoppingBag />
                                    </div>
                                    <span>Total Orders</span>
                                    <strong>
                                        {details.summary.total_orders}
                                    </strong>
                                </section>

                                <section className="customer-details-stat-card">
                                    <div className="customer-details-stat-icon">
                                        <LuWallet />
                                    </div>
                                    <span>Total Spent</span>
                                    <strong>
                                        {formatMoney(
                                            details.summary.total_spent
                                        )}
                                    </strong>
                                </section>

                                <section className="customer-details-stat-card">
                                    <div className="customer-details-stat-icon">
                                        <LuPackage />
                                    </div>
                                    <span>Last Order</span>
                                    <strong>
                                        {details.summary.last_order_id
                                            ? `#${details.summary.last_order_id}`
                                            : "—"}
                                    </strong>

                                    <small>
                                        {formatDate(
                                            details.summary.last_order_date
                                        )}
                                    </small>
                                </section>
                            </div>

                            <section className="customer-details-card customer-details-history">
                                <div className="customer-details-card-heading">
                                    <LuHistory className="customer-details-heading-icon" />

                                    <div>
                                        <h3>Order History</h3>
                                        <p>
                                            All orders placed by this customer
                                        </p>
                                    </div>
                                </div>

                                {details.orders.length === 0 ? (
                                    <div className="customer-details-empty">
                                        This customer has not placed any linked orders yet.
                                    </div>
                                ) : (
                                    <div className="customer-details-table-wrap">
                                        <table className="customer-details-table">
                                            <thead>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Date</th>
                                                    <th>Products</th>
                                                    <th>Payment</th>
                                                    <th>Order Status</th>
                                                    <th>Total</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {details.orders.map((order) => (
                                                    <tr key={order.id}>
                                                        <td>
                                                            <strong>
                                                                #{order.id}
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            {formatDate(
                                                                order.created_at
                                                            )}
                                                        </td>

                                                        <td>
                                                            <div className="customer-details-products">
                                                                {order.items.map(
                                                                    (item) => (
                                                                        <div key={item.id}>
                                                                            {item.product_name}
                                                                            {" × "}
                                                                            {item.quantity}
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <div className="customer-details-payment">
                                                                <span>
                                                                    {formatStatus(
                                                                        order.payment_method
                                                                    )}
                                                                </span>
                                                                <span
                                                                    className={`customer-details-status ${order.payment_status}`}
                                                                >
                                                                    {formatStatus(
                                                                        order.payment_status
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`customer-details-status ${order.order_status}`}
                                                            >
                                                                {formatStatus(
                                                                    order.order_status
                                                                )}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {formatMoney(
                                                                    order.total
                                                                )}
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            <Link
                                                                to={`/admin/orders/${order.id}`}
                                                                className="customer-details-view-order"
                                                            >
                                                                View Details
                                                                <LuExternalLink />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        </>
                    ) : null}
                </main>
            </div>
        </>
    );
};

export default CustomerDetails;
