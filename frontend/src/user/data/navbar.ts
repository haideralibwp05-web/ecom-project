import type { NavbarTypes } from "../types/navbar";
import CrossIcon from "../../assets/icons/crossIcon.svg";
import WebsiteLogo from "../../assets/icons/WebsiteLogo.svg";
import SearchIcon from "../../assets/icons/serchIcon.svg";
import Basket from "../../assets/icons/Basket.svg";
import Profile from "../../assets/icons/Profile.svg";

export const NavbarData: NavbarTypes = {
    label: "Sign up and get 20% off to your first order.",
    signupLink: "signupLink",
    crossIcon: CrossIcon,
    logo: WebsiteLogo,

    navlinks: [
        {
            id: 1,
            label: "Home",
            url: "/",
        },
        {
            id: 2,
            label: "On sale",
            url: "/on-sale",
        },
        {
            id: 3,
            label: "New Arrivals",
            url: "/new-arrivals",
        },
    ],

    Searchinput: {
        searchIcon: SearchIcon,
        Placeholder: "Search for products...",
    },

    NavIcons: [
        {
            id: 1,
            icon: Basket,
            url: "/CartPage",
        },
        {
            id: 2,
            icon: Profile,
            url: "/Profiles",
        },
    ],
};