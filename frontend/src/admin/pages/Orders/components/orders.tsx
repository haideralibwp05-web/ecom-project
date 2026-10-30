
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ordersData as data } from "../../../data/orders";
import type { AdminOrder } from "../../../../services/ordersApi";
import { getAdminOrders } from "../../../../services/ordersApi";
import "../../../../style.css";
import * as XLSX from "xlsx-js-style";

const PAGE_SIZE = 10;

const formatPKR = (value: string) =>
    new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 2,
    }).format(Number(value) || 0);

const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-PK", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const titleCase = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            return error.response.status === 401
                ? "Session expired. Please login again."
                : "You do not have permission to view orders.";
        }

        const message = error.response?.data?.error;
        if (typeof message === "string") return message;

        if (!error.response) {
            return "Django server se connection nahi ho saka.";
        }
    }

    return error instanceof Error
        ? error.message
        : "Orders load nahi ho sake.";
};

const Orders = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        let active = true;

        const loadOrders = async () => {
            setLoading(true);
            setError("");

            try {
                const result = await getAdminOrders();

                if (active) {
                    setOrders(result);
                }
            } catch (err) {
                if (active) setError(getErrorMessage(err));
            } finally {
                if (active) setLoading(false);
            }
        };

        void loadOrders();

        return () => {
            active = false;
        };
    }, []);

    const filteredOrders = useMemo(() => {
        const query = search.trim().toLowerCase();

        return orders.filter((order) => {
            const matchesSearch =
                !query ||
                String(order.id).includes(query) ||
                order.full_name.toLowerCase().includes(query) ||
                order.email.toLowerCase().includes(query) ||
                order.phone.toLowerCase().includes(query);

            const matchesPayment =
                paymentFilter === "all" ||
                order.payment_status.toLowerCase() === paymentFilter;

            const matchesStatus =
                statusFilter === "all" ||
                order.order_status.toLowerCase() === statusFilter;

            return matchesSearch && matchesPayment && matchesStatus;
        });
    }, [orders, search, paymentFilter, statusFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredOrders.length / PAGE_SIZE)
    );

    const safePage = Math.min(currentPage, totalPages);

    const visibleOrders = filteredOrders.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    const visibleIds = visibleOrders.map((order) => order.id);

    const allVisibleSelected =
        visibleIds.length > 0 &&
        visibleIds.every((id) => selectedIds.includes(id));

    const toggleOne = (id: number) => {
        setSelectedIds((previous) =>
            previous.includes(id)
                ? previous.filter((selectedId) => selectedId !== id)
                : [...previous, id]
        );
    };

    const toggleAllVisible = () => {
        setSelectedIds((previous) => {
            if (allVisibleSelected) {
                return previous.filter((id) => !visibleIds.includes(id));
            }

            return [...new Set([...previous, ...visibleIds])];
        });
    };

    const exportOrders = () => {
        const selectedOrders = filteredOrders.filter((order) =>
            selectedIds.includes(order.id)
        );

        if (selectedOrders.length === 0) return;

        const headers = [
            "Order ID",
            "Date",
            "Customer",
            "Email",
            "Phone",
            "Payment Method",
            "Payment Status",
            "Order Status",
            "Subtotal (PKR)",
            "Delivery Fee (PKR)",
            "Total (PKR)",
        ];

        const rows = selectedOrders.map((order) => [
            order.id,
            formatDate(order.created_at),
            order.full_name,
            order.email,
            order.phone,
            order.payment_method.toUpperCase(),
            titleCase(order.payment_status),
            titleCase(order.order_status),
            Number(order.subtotal) || 0,
            Number(order.delivery_fee) || 0,
            Number(order.total) || 0,
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([
            headers,
            ...rows,
        ]);

        worksheet["!cols"] = [
            { wch: 12 },
            { wch: 23 },
            { wch: 22 },
            { wch: 32 },
            { wch: 16 },
            { wch: 17 },
            { wch: 17 },
            { wch: 17 },
            { wch: 19 },
            { wch: 21 },
            { wch: 19 },
        ];

        for (let col = 0; col < headers.length; col++) {
            const cellAddress = XLSX.utils.encode_cell({
                r: 0,
                c: col,
            });

            worksheet[cellAddress].s = {
                fill: {
                    patternType: "solid",
                    fgColor: { rgb: "202B5B" },
                },
                font: {
                    bold: true,
                    color: { rgb: "FFFFFF" },
                    sz: 11,
                },
                alignment: {
                    horizontal: "center",
                    vertical: "center",
                    wrapText: true,
                },
                border: {
                    top: { style: "thin", color: { rgb: "B8C0D8" } },
                    bottom: { style: "thin", color: { rgb: "B8C0D8" } },
                    left: { style: "thin", color: { rgb: "B8C0D8" } },
                    right: { style: "thin", color: { rgb: "B8C0D8" } },
                },
            };
        }

        for (let row = 1; row <= rows.length; row++) {
            for (let col = 0; col < headers.length; col++) {
                const cellAddress = XLSX.utils.encode_cell({
                    r: row,
                    c: col,
                });

                const cell = worksheet[cellAddress];
                if (!cell) continue;

                cell.s = {
                    font: { sz: 10 },
                    alignment: {
                        vertical: "center",
                        horizontal: col >= 8 ? "right" : "left",
                    },
                    border: {
                        top: { style: "thin", color: { rgb: "D9DFEA" } },
                        bottom: { style: "thin", color: { rgb: "D9DFEA" } },
                        left: { style: "thin", color: { rgb: "D9DFEA" } },
                        right: { style: "thin", color: { rgb: "D9DFEA" } },
                    },
                };

                if (col >= 8) {
                    cell.z = '"Rs. "#,##0.00';
                }
            }
        }

        worksheet["!rows"] = [
            { hpt: 32 },
            ...rows.map(() => ({ hpt: 22 })),
        ];

        worksheet["!autofilter"] = {
            ref: XLSX.utils.encode_range({
                s: { r: 0, c: 0 },
                e: { r: rows.length, c: headers.length - 1 },
            }),
        };

        worksheet["!freeze"] = {
            xSplit: 0,
            ySplit: 1,
            topLeftCell: "A2",
            activePane: "bottomLeft",
            state: "frozen",
        };

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Orders"
        );

        XLSX.writeFile(workbook, "Shop.CO-orders.xlsx");
    };

    return (
        <main className="adminPages">
            <div className="adminPagesHeader">
                <h2>{data.title}</h2>

                <div className="adminPagesHeader_buttons">
                    <button
                        type="button"
                        className="adminPagesHeader_button1"
                        onClick={exportOrders}
                        disabled={
                            !filteredOrders.some((order) =>
                                selectedIds.includes(order.id)
                            )
                        }
                    >
                        {data.actions.export}
                    </button>
                </div>
            </div>

            <div className="adminPagesBox">
                <div className="adminPagesBox_Tools">
                    <div className="adminPagesBox_Tools_left">
                        <button
                            type="button"
                            className="adminPagesBox_Filter"
                            onClick={() =>
                                setShowFilters((value) => !value)
                            }
                            aria-expanded={showFilters}
                        >
                            {data.filters.filter}
                            <img src={data.filters.filter_icon} alt="" />
                        </button>

                        <div className="adminPagesBox_Search">
                            <img src={data.filters.serach_icon} alt="" />
                            <input
                                type="search"
                                value={search}
                                placeholder="Search order, customer, email..."
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <div className="adminPagesBox_Tools_Right">
                        <button
                            type="button"
                            disabled={filteredOrders.length === 0}
                            title="Export selected or filtered orders"
                        >
                            <img src={data.tableActions.edit} alt="Export" />
                        </button>

                        <button
                            type="button"
                            disabled
                            title="Order deletion is not enabled"
                        >
                            <img src={data.tableActions.delete} alt="Delete" />
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="adminOrdersFilters">
                        <label>
                            Payment:
                            <select
                                value={paymentFilter}
                                onChange={(event) => {
                                    setPaymentFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                            </select>
                        </label>

                        <label>
                            Order status:
                            <select
                                value={statusFilter}
                                onChange={(event) => {
                                    setStatusFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </label>
                    </div>
                )}

                {loading ? (
                    <p className="adminOrdersMessage">
                        Loading orders...
                    </p>
                ) : error ? (
                    <div className="adminOrdersMessage" role="alert">
                        <p>{error}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="adminOrdersTableWrap">
                            <table className="adminPagesBox_Table">
                                <thead>
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox"
                                                aria-label="Select all visible orders"
                                                checked={allVisibleSelected}
                                                onChange={toggleAllVisible}
                                            />
                                        </th>

                                        {data.columns.map((column) => (
                                            <th key={column}>{column}</th>
                                        ))}

                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {visibleOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="adminPages_TableData"
                                            style={{ height: "52px" }}
                                        >
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    aria-label={`Select order ${order.id}`}
                                                    checked={selectedIds.includes(order.id)}
                                                    onChange={() => toggleOne(order.id)}
                                                />
                                            </td>

                                            <td>#{order.id}</td>

                                            <td>
                                                {formatDate(order.created_at)}
                                            </td>

                                            <td>
                                                <div>{order.full_name}</div>
                                                <small>{order.email}</small>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        order.payment_status === "paid"
                                                            ? "adminOrdersPaid"
                                                            : "adminOrdersPending"
                                                    }
                                                >
                                                    {titleCase(order.payment_status)}
                                                </span>

                                                <small>
                                                    {" "}
                                                    ({order.payment_method.toUpperCase()})
                                                </small>
                                            </td>

                                            <td>
                                                <span
                                                    className={`adminOrdersStatus adminOrders${titleCase(order.order_status)}`}
                                                >
                                                    {titleCase(order.order_status)}
                                                </span>
                                            </td>

                                            <td>{formatPKR(order.total)}</td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="adminOrderViewDetails"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/orders/${order.id}`
                                                        )
                                                    }
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {visibleOrders.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="adminOrdersEmpty"
                                            >
                                                {orders.length === 0
                                                    ? "No Order Yet"
                                                    : "According to Search Filter no order is found"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="adminPages_Footer">
                            <div className="adminPages_FooterPagination">
                                <button
                                    type="button"
                                    className="adminPages_PaginationBack"
                                    disabled={safePage <= 1}
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.max(1, page - 1)
                                        )
                                    }
                                >
                                    <img
                                        src={data.pagination.previousIcon}
                                        alt="Previous"
                                    />
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                ).map((page) => (
                                    <button
                                        type="button"
                                        key={page}
                                        className={page === safePage ? "active" : ""}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    className="adminPages_PaginationForward"
                                    disabled={safePage >= totalPages}
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.min(totalPages, page + 1)
                                        )
                                    }
                                >
                                    <img
                                        src={data.pagination.nextIcon}
                                        alt="Next"
                                    />
                                </button>
                            </div>

                            <span>
                                {filteredOrders.length} Results
                                {selectedIds.length > 0 &&
                                    ` · ${selectedIds.length} selected`}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default Orders;
