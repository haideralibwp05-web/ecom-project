import { useEffect, useState } from "react";
import { sidebarData as data } from "../../data/sidebar";
import { Link, useLocation } from "react-router-dom";
import { getAdminOrders } from "../../../services/ordersApi";
import "../../../style.css";

const Sidebar = () => {
    const location = useLocation();

    const [totalOrders, setTotalOrders] = useState<number | null>(null);

    useEffect(() => {
        let active = true;

        const loadOrdersCount = async () => {
            try {
                const orders = await getAdminOrders();

                if (active) {
                    setTotalOrders(orders.length);
                }
            } catch (error) {
                console.error("Sidebar orders count error:", error);

                if (active) {
                    setTotalOrders(null);
                }
            }
        };

        void loadOrdersCount();

        return () => {
            active = false;
        };
    }, [location.pathname]);

    return (
        <aside className="adminSidebar">
            {data.sections.map((section, sectionIndex) => (
                <div
                    className="adminSidebarSection"
                    key={sectionIndex}
                >
                    {section.title && (
                        <p className="adminSidebarTitle">
                            {section.title}
                        </p>
                    )}

                    <div className="adminSidebarList">
                        {section.items.map((item, itemIndex) => {
                            const isActive =
                                item.path === location.pathname ||
                                (
                                    item.label === "Dashboard" &&
                                    location.pathname === "/admin"
                                );

                            const badge =
                                item.label === "Orders"
                                    ? totalOrders
                                    : item.badge;

                            return (
                                <Link
                                    to={item.path ?? "#"}
                                    className={`adminSidebarBox ${
                                        isActive ? "active" : ""
                                    }`}
                                    key={itemIndex}
                                >
                                    <div className="adminSidebarItem">
                                        <img
                                            src={item.icon}
                                            alt=""
                                        />

                                        <span>{item.label}</span>
                                    </div>

                                    <div>
                                        {badge !== null &&
                                            badge !== undefined && (
                                                <b>{badge}</b>
                                            )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </aside>
    );
};

export default Sidebar;