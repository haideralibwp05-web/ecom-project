import type{ NavbarData } from "../types/navbar";
import adminLogo from "../../assets/icons/adminLogo.svg";
import SearchIcon from "../../assets/icons/whiteSearchIcon.svg";
import Inbox from "../../assets/icons/inbox.svg";
import Notification from "../../assets/icons/notificatinBell.svg";


export const navbarData: NavbarData = {
    logo: {
        image: adminLogo,
        text: "fastcart",
    },

    search: {
        icon:SearchIcon,
        placeholder: "Search...",
    },

    message: {
        icon:Inbox,
    },

    notification: {
        icon: Notification,
        count: 5,
    },

    profile: {
        name_spell: "A",
        name: "Ali Haider",
    },
};