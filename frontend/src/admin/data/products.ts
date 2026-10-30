import type { ProductsTypes } from "../types/products";

import MenGreyHoodie from "../../assets/images/MenGreyHoodie.webp";
import WomenStriped from "../../assets/images/WomenStriped.webp";
import WomenWhite from "../../assets/images/WomenWhite.webp";
import MenWhite from "../../assets/images/MenWhite.webp";
import WomenRed from "../../assets/images/WomenRed.webp";

// icons
import EditIcon from "../../assets/icons/Edit.svg";
import DeleteIcon from "../../assets/icons/Delete.svg";
import ArrowLeft from "../../assets/icons/arrowLeft.svg";
import ArrowRight from "../../assets/icons/arrowRight.svg";
import ArrownDown from "../../assets/icons/arrowDown.svg"
import SearchIcon from "../../assets/icons/serchIcon.svg"
export const productsData: ProductsTypes = {
    title: "Products",

    actions: {
        export: "Export",
        addProduct: "Add Product",
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
        "Product",
        "Stock",
        "Color",
        "Price",
        "size",
    ],

    products: [
        {
            selected: true,
            image:MenGreyHoodie,
            name: "Men Grey Hoodie",
            category: "Hoodies",
            inventory: 96,
            color: "M",
            price: "$49.90",
            rating: "5.0 (32 Votes)",
        }
    ],

    pagination: {
        pages: ["1", "2", "3", "4", "5", "6", "...", "24"],
        currentPage: "2",
        results: "146 Results",
        previousIcon: ArrowLeft,
        nextIcon: ArrowRight,
    },
};