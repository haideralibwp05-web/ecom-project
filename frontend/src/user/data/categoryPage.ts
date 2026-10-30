
import type { CategoryPageData } from "../types/categoryPage";

// Icons
import dropRight from "../../assets/icons/dropRight.svg";
import filterImg from "../../assets/icons/filterImg.svg";
import dropUp from "../../assets/icons/dropUp.svg";
import arrowDown from "../../assets/icons/arrowDown.svg";
import arrowLeft from "../../assets/icons/arrowLeft.svg";
import arrowRight from "../../assets/icons/arrowRight.svg";
import cross from "../../assets/icons/cross.svg";

export const categoryPageData: CategoryPageData = {
    // BREADCRUMB
    breadcrumb: {
        home: "Home",
        arrow: dropRight,
    },

    // FILTERS
    filters: {
        heading: "Filters",
        icon: filterImg,
        arrow: dropRight,
        arrowUp: dropUp,
        close: cross,

        price: "Price",
        colors: "Colors",
        sizes: "Size",
        dressStyle: "Dress Style",
        apply: "Apply Filter",
        clear: "Clear Filters",

        // COLORS
        colorOptions: [
            "#00C12B",
            "#F50606",
            "#F5DD06",
            "#F57906",
            "#06CAF5",
            "#063AF5",
            "#7D06F5",
            "#F506A4",
            "#FFFFFF",
            "#000000",
        ],

        // SIZES
        sizeOptions: [
            { label: "XX-Small", value: "XXS" },
            { label: "X-Small", value: "XS" },
            { label: "Small", value: "S" },
            { label: "Medium", value: "M" },
            { label: "Large", value: "L" },
            { label: "X-Large", value: "XL" },
            { label: "XX-Large", value: "XXL" },
            { label: "3X-Large", value: "3XL" },
            { label: "4X-Large", value: "4XL" },
        ],

        // DRESS STYLES
        styles: [
            "Casual",
            "Formal",
            "Party",
            "Gym",
        ],
    },

    // PRODUCTS
    products: {
        sortText: "Sort by:",
        sortIcon: arrowDown,
        defaultSort: "Most Popular",
        perPage: 9,
        empty: "No products available in this category.",
        loading: "Loading products...",
    },

    // PAGINATION
    pagination: {
        previous: "Previous",
        next: "Next",
        previousIcon: arrowLeft,
        nextIcon: arrowRight,
    },
};
