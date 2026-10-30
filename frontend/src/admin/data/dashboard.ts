import type { DashboardTypes } from "../types/dashboard";
import { ordersData } from "../data/orders";
import { productsData } from "../data/products";
import { customersData } from "../data/customers";

import Product1 from "../../assets/images/MenGreyHoodie.webp";
import Product2 from "../../assets/images/WomenStriped.webp";
import Product3 from "../../assets/images/WomenWhite.webp";

export const dashboardData: DashboardTypes = {

    title: "Dashboard",

    overview: {
        title: "Overview",

        cards: [
            {
                title: "Total Sales"
            },
            {
                title: "Total Orders"
            },
            {
                title: "Total Products"

            },
            {
                title: "Total Customers",
                value: customersData.customers.length,
            },
        ],
    },


    recentOrders: {
        title: "Recent Orders",
        orders: [],
    },

    topProducts: {
        title: "Top Products",
        products: [],
    },

    lowStock: {
        title: "Low Stock",

        products: [],
    },
};