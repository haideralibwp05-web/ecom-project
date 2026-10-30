import type { productDetailsTypes } from "./../types/productDetail";
import shirtImg1 from "../../assets/images/ShirtImg1.webp";
import shirtImg2 from "../../assets/images/ShirtImg2.webp";
import shirtImg3 from "../../assets/images/ShirtImg3.webp";
import shirtImg4 from "../../assets/images/ShirtImg4.webp";
import starIcons from "../../assets/icons/StarsIcon.svg";


export const productDetailsData: productDetailsTypes = {
    col_1: [
        {
            id: 1,
            src: shirtImg2,
            url: "/"
        },
        {
            id: 2,
            src: shirtImg3,
            url: "/"
        },
        {
            id: 3,
            src: shirtImg4,
            url: "/"
        }
    ],
    col_2: {
        src: shirtImg1,
        url: "/"
    },
    col_3: {
        heading: "One Life Graphic T-shirt",
        stars: starIcons,
        rating: "4.5/5",
        currentPrice: "$260",
        discountPrice: "$300",
        discount: "-40%",
        Desc: "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
        colors: {
            text: "Select Colors",
            colorCicle: [
                {
                    id: 1,
                    circle: "#4F4631",
                    url: "/"
                },
                {
                    id: 2,
                    circle: "#314F4A",
                    url: "/"
                },
                {
                    id: 3,
                    circle: "#31344F",
                    url: "/"
                },
            ],
        },
        sizes: {
            text: "Choose Size",
            size: [
                {
                    id: 1,
                    label: "Small",
                    url: "/"
                },
                {
                    id: 2,
                    label: "Medium",
                    url: "/"
                },
                {
                    id: 3,
                    label: "Large",
                    url: "/"
                },
                {
                    id: 4,
                    label: "X-Large",
                    url: "/"
                }
            ]
        },
        button: "Add to Cart"
    }
}