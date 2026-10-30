import type { FooterTypes } from "./../types/footer";

// Social Icons
import emailIcon from "../../assets/icons/emailIcon.svg";
import twitterIcon from "../../assets/icons/twitter.svg";
import facebookIcon from "../../assets/icons/facebook.svg";
import instagramIcon from "../../assets/icons/instagram.svg";
import gitHubIcon from "../../assets/icons/gitHub.svg";

// Banks
import VisaCard from "../../assets/icons/VisaCard.svg";
import MasterCard from "../../assets/icons/MasterCard.svg";
import Paypal from "../../assets/icons/PayPal.svg";
import ApplePay from "../../assets/icons/ApplePay.svg";
import Gpay from "../../assets/icons/Gpay.svg";

export const FooterData: FooterTypes = {
    FooterUpper: {
        heading: "STAY UPTO DATE ABOUT OUR LATEST OFFERS",
        emailIcon: emailIcon,
        emailPlaceholder: "Enter your email address",
        subscribeText: "Subscribe to Newsletter",
    },

    footer: {
        // Column 1 - Unchanged
        col_1: {
            logo: "SHOP.CO",
            intro: "We have clothes that suits your style and which you’re proud to wear. From women to men.",
            socialIcons: [
                {
                    src: twitterIcon,
                    url: "",
                },
                {
                    src: facebookIcon,
                    url: "",
                },
                {
                    src: instagramIcon,
                    url: "",
                },
                {
                    src: gitHubIcon,
                    url: "",
                },
            ],
        },

        // Column 2 - Company
        col_2: {
            heading: "Company",
            links: [
                {
                    label: "About Us",
                    url: "/about-us",
                },
                {
                    label: "Contact Us",
                    url: "/contact-us",
                },
                {
                    label: "Our Story",
                    url: "/our-story",
                },
                {
                    label: "Careers",
                    url: "/careers",
                },
            ],
        },

        // Column 3 - Shop
        col_3: {
            heading: "Shop",
            links: [
                {
                    label: "Men",
                    url: "/men",
                },
                {
                    label: "Women",
                    url: "/women",
                },
                {
                    label: "New Arrivals",
                    url: "/new-arrivals",
                },
                {
                    label: "Sale",
                    url: "/on-sale",
                },
            ],
        },

        // Column 4 - Customer Support
        col_4: {
            heading: "Customer Support",
            links: [
                {
                    label: "FAQs",
                    url: "/faqs",
                },
                {
                    label: "Shipping & Delivery",
                    url: "/shipping-delivery",
                },
                {
                    label: "Returns & Exchanges",
                    url: "/returns-exchanges",
                },
                {
                    label: "Size Guide",
                    url: "/size-guide",
                },
            ],
        },

        // Column 5 - Policies
        col_5: {
            heading: "Policies",
            links: [
                {
                    label: "Privacy Policy",
                    url: "/privacy-policy",
                },
                {
                    label: "Terms & Conditions",
                    url: "/terms-conditions",
                },
                {
                    label: "Refund Policy",
                    url: "/refund-policy",
                },
                {
                    label: "Cancellation Policy",
                    url: "/cancellation-policy",
                },
            ],
        },

        // Copyright - Unchanged
        copyRight: "Shop.co © 2000-2026, All Rights Reserved",

        // Payment Icons - Unchanged
        bankImgs: [
            {
                src: VisaCard,
                url: "",
            },
            {
                src: MasterCard,
                url: "",
            },
            {
                src: Paypal,
                url: "",
            },
            {
                src: ApplePay,
                url: "",
            },
            {
                src: Gpay,
                url: "",
            },
        ],
    },
};