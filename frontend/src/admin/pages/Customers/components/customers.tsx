
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { customersData as data } from "../../../data/customers";
import {
    getAdminCustomers,
    type Customer,
} from "../../../../services/customersApi";
import "../../../../style.css";

const PAGE_SIZE = 10;

const formatMoney = (amount: string | number | null | undefined) =>
    `Rs. ${Number(amount || 0).toLocaleString("en-PK", {
        maximumFractionDigits: 2,
    })}`;

const Customers = () => {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        let active = true;

        const loadCustomers = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await getAdminCustomers();

                if (active) {
                    setCustomers(result);
                }
            } catch {
                if (active) {
                    setError("Unable to load customers. Please check your admin login.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadCustomers();

        return () => {
            active = false;
        };
    }, []);

    const filteredCustomers = useMemo(() => {
        const query = search.toLowerCase().trim();

        return customers.filter((customer) =>
            customer.username.toLowerCase().includes(query) ||
            customer.email.toLowerCase().includes(query) ||
            String(customer.id).includes(query)
        );
    }, [customers, search]);

    const totalCustomers = filteredCustomers.length;

    const totalPages = Math.max(
        1,
        Math.ceil(totalCustomers / PAGE_SIZE)
    );

    const currentPage = Math.min(page, totalPages);

    const visibleCustomers = filteredCustomers.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const visibleIds = visibleCustomers.map((customer) => customer.id);

    const allVisibleSelected =
        visibleIds.length > 0 &&
        visibleIds.every((id) => selectedIds.includes(id));

    const toggleCustomer = (id: number) => {
        setSelectedIds((previous) =>
            previous.includes(id)
                ? previous.filter((selectedId) => selectedId !== id)
                : [...previous, id]
        );
    };

    const toggleVisibleCustomers = () => {
        setSelectedIds((previous) => {
            if (allVisibleSelected) {
                return previous.filter((id) => !visibleIds.includes(id));
            }

            return [...new Set([...previous, ...visibleIds])];
        });
    };

    const exportCustomers = () => {
        const rows = [
            ["ID", "Username", "Email", "Total Orders", "Total Spent"],
            ...filteredCustomers.map((customer) => [
                customer.id,
                customer.username,
                customer.email,
                customer.total_orders,
                customer.total_spent || "0",
            ]),
        ];

        const csv = rows
            .map((row) =>
                row
                    .map((value) =>
                        `"${String(value ?? "").replace(/"/g, '""')}"`
                    )
                    .join(",")
            )
            .join("\r\n");

        const blob = new Blob(["\uFEFF", csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "customers.csv";
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <main className="adminPages">
            <div className="adminPagesHeader">
                <h2>{data.title}</h2>

                <div className="adminPagesHeader_buttons">
                    <button
                        type="button"
                        className="adminPagesHeader_button1"
                        onClick={exportCustomers}
                        disabled={loading || customers.length === 0}
                    >
                        {data.actions.export}
                    </button>

                    <button
                        type="button"
                        className="adminPagesHeader_button2"
                        onClick={() =>
                            alert("Add Customer functionality is not implemented yet.")
                        }
                    >
                        + {data.actions.addCustomer}
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
                                setSearch("")
                            }
                            title="Clear search"
                        >
                            {data.filters.filter}

                            <img
                                src={data.filters.filter_icon}
                                alt=""
                            />
                        </button>

                        <div className="adminPagesBox_Search">
                            <img
                                src={data.filters.search_icon}
                                alt=""
                            />

                            <input
                                type="text"
                                placeholder={data.filters.search}
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <div className="adminPagesBox_Tools_Right">
                        <button
                            type="button"
                            title="Edit selected customers"
                            disabled={selectedIds.length === 0}
                        >
                            <img
                                src={data.tableActions.edit}
                                alt="Edit"
                            />
                        </button>

                        <button
                            type="button"
                            title="Delete selected customers"
                            disabled={selectedIds.length === 0}
                        >
                            <img
                                src={data.tableActions.delete}
                                alt="Delete"
                            />
                        </button>
                    </div>
                </div>

                <table className="adminPagesBox_Table customersTable">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={allVisibleSelected}
                                    onChange={toggleVisibleCustomers}
                                    aria-label="Select all customers on this page"
                                />
                            </th>

                            <th>Username</th>
                            <th>Email</th>
                            <th>Total Orders</th>
                            <th>Total Spent</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6}>Loading customers...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={6}>{error}</td>
                            </tr>
                        ) : visibleCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={6}>No customers found.</td>
                            </tr>
                        ) : (
                            visibleCustomers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="adminPages_TableData"
                                >
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(customer.id)}
                                            onChange={() =>
                                                toggleCustomer(customer.id)
                                            }
                                            aria-label={`Select ${customer.username}`}
                                        />
                                    </td>

                                    <td>
                                        <div className="customerName">
                                            <span className="customerAvatar">
                                                {customer.username}
                                            </span>
                                        </div>
                                    </td>

                                    <td>{customer.email || "—"}</td>

                                    <td>{customer.total_orders}</td>

                                    <td>
                                        {formatMoney(customer.total_spent)}
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/customers/${customer.id}`
                                                )
                                            }
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="adminPages_Footer">
                    <div className="adminPages_FooterPagination">
                        <button
                            type="button"
                            className="customersPaginationArrow"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setPage((previous) =>
                                    Math.max(1, previous - 1)
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
                        ).map((pageNumber) => (
                            <button
                                type="button"
                                key={pageNumber}
                                className={
                                    pageNumber === currentPage ? "active" : ""
                                }
                                onClick={() => setPage(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        <button
                            type="button"
                            className="customersPaginationArrow"
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setPage((previous) =>
                                    Math.min(totalPages, previous + 1)
                                )
                            }
                        >
                            <img
                                src={data.pagination.nextIcon}
                                alt="Next"
                            />
                        </button>
                    </div>

                    <span>{totalCustomers} Results</span>
                </div>
            </div>
        </main>
    );
};

export default Customers;
