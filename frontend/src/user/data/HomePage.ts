
import type { HeroSectionType, ProductSectionTypes, BrowseTypes, Testimonial } from "../types/HomePage";

// Hero Images
import HeroImage from "../../assets/images/hero.webp";
import VERSACE from "../../assets/icons/VERSACE.svg";
import ZARA from "../../assets/icons/ZARA.svg";
import GUCCI from "../../assets/icons/GUCCI.svg";
import PRADA from "../../assets/icons/PRADA.svg";
import CalvinKlein from "../../assets/icons/Calvin Klein.svg";

// New Arrivals Images
import blackShirt from "../../assets/images/Black_t-shirt.webp";
import bluePaint from "../../assets/images/Blue_Paint.webp";
import multiColorShirt from "../../assets/images/multicolor_shirt.webp";
import sportsShirt from "../../assets/images/sports t-shirt.webp";

// Top Selling Images
import StripedShirt from "../../assets/images/Striped Shirt.webp";
import GraphicShirt from "../../assets/images/Graphic T-shirt.webp";
import LooseShorts from "../../assets/images/Loose shorts.webp";
import BlackJeans from "../../assets/images/Black Jeans.webp";

// Browse Images
import Casual from "../../assets/images/Casual.webp";
import Formal from "../../assets/images/Formal.webp";
import Party from "../../assets/images/Party.webp";
import Gym from "../../assets/images/Gym.webp";

// Icons
import starsIcon from "../../assets/icons/StarsIcon.svg";
import arrowLeft from "../../assets/icons/arrowLeft.svg";
import arrowRight from "../../assets/icons/arrowRight.svg";
import TestimonialStars from "../../assets/icons/TestimonialStars.svg";
import GreenTick from "../../assets/icons/VerifiedTick.svg";

// ================= HERO SECTION =================

export const HeroData: HeroSectionType = {
    heading: "FIND CLOTHES THAT MATCHES YOUR STYLE",
    description:
        "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
    button: "Shop Now",
    heroImage: HeroImage,
    stats: [
        { id: 1, number: "200+", text: "International Brands" },
        { id: 2, number: "2,000+", text: "High-Quality Products" },
        { id: 3, number: "30,000+", text: "Happy Customers" },
    ],
    brands: [
        { id: 1, image: VERSACE, url: "/" },
        { id: 2, image: ZARA, url: "/" },
        { id: 3, image: GUCCI, url: "/" },
        { id: 4, image: PRADA, url: "/" },
        { id: 5, image: CalvinKlein, url: "/" },
    ],
};

// ================= NEW ARRIVALS =================

export const NewArrivalsData: ProductSectionTypes = {
    Heading: "NEW ARRIVALS",
    // button: "View All",
    product: [
        {
            id: 1,
            image: blackShirt,
            title: "T-shirt with Tape Details",
            starsIcons: starsIcon,
            rating: "4.5/5",
            CurrentPrice: "$120",
        },
        {
            id: 2,
            image: bluePaint,
            title: "Skinny Fit Jeans",
            starsIcons: starsIcon,
            rating: "3.5/5",
            CurrentPrice: "$240",
            RealPrice: "$260",
            discount: "-20%",
        },
        {
            id: 3,
            image: multiColorShirt,
            title: "Checkered Shirt",
            starsIcons: starsIcon,
            rating: "4.5/5",
            CurrentPrice: "$180",
        },
        {
            id: 4,
            image: sportsShirt,
            title: "Sleeve Striped T-Shirt",
            starsIcons: starsIcon,
            rating: "4.5/5",
            CurrentPrice: "$130",
            RealPrice: "$160",
            discount: "-30%",
        },
    ],
};

// ================= TOP SELLING =================

export const TopSellingData: ProductSectionTypes = {
    Heading: "TOP SELLING",
    // button: "View All",
    product: [
        {
            id: 1,
            image: StripedShirt,
            title: "Vertical Striped Shirt",
            starsIcons: starsIcon,
            rating: "5.0/5",
            CurrentPrice: "$212",
            RealPrice: "$232",
            discount: "-20%",
        },
        {
            id: 2,
            image: GraphicShirt,
            title: "Courage Graphic T-shirt",
            starsIcons: starsIcon,
            rating: "4.0/5",
            CurrentPrice: "$145",
        },
        {
            id: 3,
            image: LooseShorts,
            title: "Loose Fit Bermuda Shorts",
            starsIcons: starsIcon,
            rating: "3.0/5",
            CurrentPrice: "$80",
        },
        {
            id: 4,
            image: BlackJeans,
            title: "Faded Skinny Jeans",
            starsIcons: starsIcon,
            rating: "4.5/5",
            CurrentPrice: "$210",
        },
    ],
};

// ================= BROWSE =================

export const BrowseData: BrowseTypes = {
    Heading: "BROWSE BY dress STYLE",
    Row1: [
        { id: 1, image: Casual, imageText: "Casual" },
        { id: 2, image: Formal, imageText: "Formal" },
    ],
    Row2: [
        { id: 1, image: Party, imageText: "Party" },
        { id: 2, image: Gym, imageText: "Gym" },
    ],
};

// ================= TESTIMONIALS =================

export const TestimonialData: Testimonial = {
    heading: "OUR HAPPY CUSTOMERS",
    ArrowLeft: arrowLeft,
    ArrowRight: arrowRight,
    cards: [
        {
            id: 1,
            name: "Sarah M.",
            rating: TestimonialStars,
            verified: GreenTick,
            review:
                "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
        },
        {
            id: 2,
            name: "Alex K.",
            rating: TestimonialStars,
            verified: GreenTick,
            review:
                "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is remarkable, catering to a variety of tastes and occasions.",
        },
        {
            id: 3,
            name: "James L.",
            rating: TestimonialStars,
            verified: GreenTick,
            review:
                "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
        },
        {
            id: 4,
            name: "Emma W.",
            rating: TestimonialStars,
            verified: GreenTick,
            review:
                "I absolutely love the quality of the products and the fast delivery service. Every order arrives on time, and the clothes always look even better than the pictures.",
        },
        {
            id: 5,
            name: "Michael R.",
            rating: TestimonialStars,
            verified: GreenTick,
            review:
                "Shopping here has been an amazing experience. The customer support team is friendly, the products are premium quality, and I'll definitely continue shopping from Shop.co.",
        },
    ],
};
