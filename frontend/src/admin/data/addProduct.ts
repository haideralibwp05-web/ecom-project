import type { AddProductTypes, Color } from "../types/addProduct";
import arrowLeft from "../../assets/icons/arrowLeft.svg";

export const addProductData: AddProductTypes = {

    BackButton: {
        img: arrowLeft,
        text: "Back",
    },

    title: "Add Product",

    actions: {
        cancel: "Cancel",
        save: "Save",
    },

    information: {
        title: "Information",
        productName: "Product Name",
        productNamePlaceholder: "Product Name",
        description: "Product Description",
        descriptionPlaceholder: "Product description",
        images: "Images",
        addFile: "Add File",
        dragDrop: "Select Iamges",
    },

    price: {
        title: "Price",
        productPrice: "Product Price",
        productPricePlaceholder: "Enter price",
        discountPrice: "Discount Price",
        discountPricePlaceholder: "Price at Discount",
    },

    category: {
        title: "Category",
        label: "Category",
    },

    color: {
        title: "Color",
        placeholder: "Select Color",
    },

    size: {
        title: "Size",
        placeholder: "Select Size",
    },

    inventory: {
        title: "Inventory",
        stock: "Stock",
        stockPlaceholder: "Enter Stock Quantity",
    },
};


export const mainColors: Color[] = [
    { name: "Aqua", hex: "#00FFFF" },
    { name: "Amber", hex: "#FFBF00" },
    { name: "Beige", hex: "#F5F5DC" },
    { name: "Black", hex: "#000000" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Bronze", hex: "#CD7F32" },
    { name: "Brown", hex: "#A52A2A" },
    { name: "Cobalt Blue", hex: "#0047AB" },
    { name: "Coffee Brown", hex: "#6F4E37" },
    { name: "Charcoal", hex: "#36454F" },
    { name: "Cherry Red", hex: "#D2042D" },
    { name: "Chocolate", hex: "#7B3F00" },
    { name: "Coral", hex: "#FF7F50" },
    { name: "Cream", hex: "#FFFDD0" },
    { name: "Crimson", hex: "#DC143C" },
    { name: "Cyan", hex: "#00FFFF" },
    { name: "Dark Green", hex: "#006400" },
    { name: "Eggplant", hex: "#614051" },
    { name: "Emerald", hex: "#50C878" },
    { name: "Forest Green", hex: "#228B22" },
    { name: "Gold", hex: "#FFD700" },
    { name: "Gray", hex: "#808080" },
    { name: "Green", hex: "#008000" },
    { name: "Indigo", hex: "#4B0082" },
    { name: "Lavender", hex: "#E6E6FA" },
    { name: "Lilac", hex: "#C8A2C8" },
    { name: "Lime Green", hex: "#32CD32" },
    { name: "Magenta", hex: "#FF00FF" },
    { name: "Maroon", hex: "#800000" },
    { name: "Mint", hex: "#98FF98" },
    { name: "Mustard", hex: "#FFDB58" },
    { name: "Navy Blue", hex: "#000080" },
    { name: "Ochre", hex: "#CC7722" },
    { name: "Olive", hex: "#808000" },
    { name: "Orange", hex: "#FFA500" },
    { name: "Peach", hex: "#FFE5B4" },
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Plum", hex: "#DDA0DD" },
    { name: "Purple", hex: "#800080" },
    { name: "Red", hex: "#FF0000" },
    { name: "Ruby", hex: "#E0115F" },
    { name: "Rust", hex: "#B7410E" },
    { name: "Salmon", hex: "#FA8072" },
    { name: "Silver", hex: "#C0C0C0" },
    { name: "Sky Blue", hex: "#87CEEB" },
    { name: "Tan", hex: "#D2B48C" },
    { name: "Teal", hex: "#008080" },
    { name: "Tangerine", hex: "#F28500" },
    { name: "Turquoise", hex: "#40E0D0" },
    { name: "Violet", hex: "#EE82EE" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Yellow", hex: "#FFFF00" },
];