import type { Crart_Section } from "./../types/cartSide";
import dropRight from "../../assets/icons/dropRight.svg";
import item_1 from "../../assets/images/Rainbow_Shirt.webp";
import item_2 from "../../assets/images/Boxes_Shirt.webp";

import item_3 from "../../assets/images/LightBlueJean.webp";
import TrashIcon from "../../assets/icons/TrashIcon.svg";

export const Cart_SectionData: Crart_Section = {
    HeaderLinks: {
        label_1: "Home",
        dropright: dropRight,
        label_2: "Cart"
    },
    Heading: "YOUR CART",
    Cart: [
        {
            id: 1,
            img: item_1,
            title: "Gradient Graphic T-shirt",
            sizeText: "Size:",
            size: "Large",
            colorText: "Color:",
            color: "White",
            Price: "$145",

            DelIcon: TrashIcon,
            quantity: {
                min: "-",
                max: "+"
            }
        },
        {
            id: 2,
            img: item_2,
            title: "CHECKERED SHIRT",
            sizeText: "Size:",
            size: "Medium",
            colorText: "Color:",
            color: "Red",
            Price: "$180",
            DelIcon: TrashIcon,
            quantity: {
                min: "-",
                max: "+"
            }
        },

        {
            id: 3,
            img: item_3,
            title: "SKINNY FIT JEANS",
            sizeText: "Size:",
            size: "Medium",
            colorText: "Color:",
            color: "Blue",
            Price: "$240",
            DelIcon: TrashIcon,
            quantity: {
                min: "-",
                max: "+"
            }
        }
    ]
}