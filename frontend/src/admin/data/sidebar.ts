import type { SidebarTypes } from "../types/sidebar";
import { ordersData } from "../data/orders";

import DashIcon from "../../assets/icons/Dashboard.svg";
import Orders from "../../assets/icons/Orders.svg";
import Products from "../../assets/icons/Product.svg";
import Categories from "../../assets/icons/Categories.svg";
import Customers from "../../assets/icons/Customers.svg";
import Customize from "../../assets/icons/Customize.svg";
import Coupons from "../../assets/icons/Coupons.svg";
import Inbox from "../../assets/icons/inbox.svg";
import Knowledge from "../../assets/icons/Knowledge.svg";
import ProductUpdates from "../../assets/icons/ProductsUpdate.svg";
import PersonalSetting from "../../assets/icons/Personal_Setting.svg";
import GlobalSetting from "../../assets/icons/Setting.svg";

export const sidebarData: SidebarTypes = {
    sections: [
        {
            items: [
                {
                    label: "Dashboard",
                    icon: DashIcon,
                    path: "/admin/",
                },
                {
                    label: "Orders",
                    icon: Orders,
                    path: "/admin/orders",
                },
                {
                    label: "Products",
                    icon: Products,
                    path: "/admin/products",
                },
                {
                    label: "Categories",
                    icon: Categories,
                    path: "/admin/categories",
                },
                {
                    label: "Customers",
                    icon: Customers,
                    path: "/admin/customers",
                },
                {
                    label: "Customize",
                    icon: Customize,
                    path: "/admin/Customize"
                },
                // {
                //     label: "Coupons",
                //     icon: Coupons,
                // },
                // {
                //     label: "Inbox",
                //     icon: Inbox,
                // },
            ],
        },

        // {
        //     title: "Other Information",
        //     items: [
        //         {
        //             label: "Knowledge Base",
        //             icon: Knowledge,
        //         },
        //         {
        //             label: "Product Updates",
        //             icon: ProductUpdates,
        //         },
        //     ],
        // },

        // {
        //     title: "Settings",
        //     items: [
        //         {
        //             label: "Personal Settings",
        //             icon: PersonalSetting,
        //         },
        //         {
        //             label: "Global Settings",
        //             icon: GlobalSetting,
        //         },
        //     ],
        // },
    ],
};