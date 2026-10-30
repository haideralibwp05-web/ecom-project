import type { OrdersTypes } from "../types/orders";

import EditIcon from "../../assets/icons/Edit.svg";
import DeleteIcon from "../../assets/icons/Delete.svg";
import ArrowLeft from "../../assets/icons/arrowLeft.svg";
import ArrowRight from "../../assets/icons/arrowRight.svg";
import ArrownDown from "../../assets/icons/arrowDown.svg"
import SearchIcon from "../../assets/icons/serchIcon.svg";

export const ordersData: OrdersTypes = {
    title: "Orders",

    actions: {
        export: "Export",
        addOrder: "Add Order",
    },

    filters: {
        filter: "Filter",
        filter_icon:ArrownDown,
        search: "Search...",
        serach_icon:SearchIcon,
    },

    tableActions: {
        edit: EditIcon,
        delete: DeleteIcon,
    },

    columns: [
        "Order",
        "Date",
        "Customer",
        "Payment status",
        "Order Status",
        "Total",
    ],

    orders: [
        {
            selected: true,
            order: "#12512B",
            date: "May 5, 4:20 PM",
            customer: "Tom Anderson",
            paymentStatus: "Paid",
            orderStatus: "Ready",
            total: "$49.90",
        },
        {
            selected: true,
            order: "#12523C",
            date: "May 5, 4:15 PM",
            customer: "Jayden Walker",
            paymentStatus: "Paid",
            orderStatus: "Ready",
            total: "$34.36",
        },
        {
            selected: true,
            order: "#51232A",
            date: "May 5, 4:15 PM",
            customer: "Inez Kim",
            paymentStatus: "Paid",
            orderStatus: "Ready",
            total: "$5.51",
        },
        {
            selected: true,
            order: "#23534D",
            date: "May 5, 4:12 PM",
            customer: "Francisco Henry",
            paymentStatus: "Paid",
            orderStatus: "Shipped",
            total: "$29.74",
        },
        {
            selected: false,
            order: "#51323C",
            date: "May 5, 4:12 PM",
            customer: "Violet Phillips",
            paymentStatus: "Paid",
            orderStatus: "Shipped",
            total: "$23.06",
        },
        {
            selected: false,
            order: "#35622A",
            date: "May 5, 4:12 PM",
            customer: "Rosetta Becker",
            paymentStatus: "Paid",
            orderStatus: "Shipped",
            total: "$87.44",
        },
        {
            selected: false,
            order: "#34232D",
            date: "May 5, 4:10 PM",
            customer: "Dean Love",
            paymentStatus: "Paid",
            orderStatus: "Ready",
            total: "$44.55",
        },
        {
            selected: false,
            order: "#56212D",
            date: "May 5, 4:08 PM",
            customer: "Nettie Tyler",
            paymentStatus: "Paid",
            orderStatus: "Ready",
            total: "$36.79",
        },
        {
            selected: false,
            order: "#76543F",
            date: "May 5, 4:08 PM",
            customer: "Lora Weaver",
            paymentStatus: "Paid",
            orderStatus: "Shipped",
            total: "$28.78",
        },
        {
            selected: false,
            order: "#12512B",
            date: "May 5, 4:05 PM",
            customer: "Vincent Cannon",
            paymentStatus: "Paid",
            orderStatus: "Shipped",
            total: "$96.46",
        },
        {
            selected: false,
            order: "#12523C",
            date: "May 5, 4:05 PM",
            customer: "Nettie Palmer",
            paymentStatus: "Paid",
            orderStatus: "Received",
            total: "$25.53",
        },
        {
            selected: false,
            order: "#23534D",
            date: "May 5, 4:04 PM",
            customer: "Miguel Harris",
            paymentStatus: "Pending",
            orderStatus: "Ready",
            total: "$50.54",
        },
        {
            selected: false,
            order: "#12523C",
            date: "May 5, 4:04 PM",
            customer: "Angel Conner",
            paymentStatus: "Pending",
            orderStatus: "Ready",
            total: "$63.47",
        },
        {
            selected: false,
            order: "#51232A",
            date: "May 5, 4:03 PM",
            customer: "Rosalie Singleton",
            paymentStatus: "Pending",
            orderStatus: "Received",
            total: "$91.63",
        },
    ],

    pagination: {
        pages: ["1", "2", "3", "4", "5", "6", "...", "24"],
        currentPage: "2",
        previousIcon: ArrowLeft,
        nextIcon: ArrowRight,
    },
};