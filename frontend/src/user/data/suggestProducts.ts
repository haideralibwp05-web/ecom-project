import type { ProductSectionTypes } from "../types/ProductSection";

import PoloShirt1 from "../../assets/images/Polo Shirt.webp";
import GradientShirt from "../../assets/images/Gradient Shirt.webp";
import PoloShirt2 from "../../assets/images/Polo Brown.webp";
import BlackStripedShirt from "../../assets/images/Black Stripped.webp";
import starsIcon from "../../assets/icons/StarsIcon.svg";

export const suggestProductData: ProductSectionTypes = {
  Heading: "You might also like",
  product: [
    {
      id: 1,
      image: PoloShirt1,
      title: "Polo with Contrast Trims",
      starsIcons: starsIcon,
      rating: "4.0/5",
      CurrentPrice: "$212",
       RealPrice: "$242",
      discount: "-20%",
    },

    {
      id: 2,
      image: GradientShirt,
      title: "Gradient Graphic T-shirt",
      starsIcons: starsIcon,
      rating: "3.5/5",
      CurrentPrice: "$145",
    
    },

    {
      id: 3,
      image: PoloShirt2,
      title: "Polo with Tipping Details",
      starsIcons: starsIcon,
      rating: "4.5/5",
      CurrentPrice: "$180",
    },

    {
      id: 4,
      image: BlackStripedShirt,
      title: "Black Striped T-shirt",
      starsIcons: starsIcon,
      rating: "5.0/5",
      CurrentPrice: "$120",
      RealPrice: "$150",
      discount: "-30%",
    },
  ]

};