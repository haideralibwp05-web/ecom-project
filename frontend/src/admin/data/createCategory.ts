import type { createCategoryTypes } from "../types/createCategory";
import { productsData } from "../data/products";

import arrowLeft from "../../assets/icons/arrowLeft.svg";
import WomenStriped from "../../assets/images/WomenStriped.webp";
import ColmnDots from "../../assets/icons/ColmnDots.svg";
import DeleteIcon from "../../assets/icons/Delete.svg";
import EditIcon from "../../assets/icons/Edit.svg";

export const createCategoryData: createCategoryTypes = {
    BackButton: {
        img: arrowLeft,
        text: "Back",
    },
    title: "Create Category",

    actions: {
        cancel: "Cancel",
        save: "Save",
    },

    products: {
        title: "Products",
        count: productsData.products.length,

        items: [
            {
                dots: ColmnDots,
                image: WomenStriped,
                name: "Women Striped T-Shirt",
                edit:EditIcon,
                delete:DeleteIcon
            }
        ],
    },

    categoryInfo: {
        title: "Category Info",
        name: "Women Clothes",
        image: "",
        addFile: "Add File",
    },
};