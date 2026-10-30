import type { CustomersTypes } from "../types/customers";
import EditIcon from "../../assets/icons/Edit.svg";
import DeleteIcon from "../../assets/icons/Delete.svg";
import ArrowLeft from "../../assets/icons/arrowLeft.svg";
import ArrowRight from "../../assets/icons/arrowRight.svg";
import ArrownDown from "../../assets/icons/arrowDown.svg"
import SearchIcon from "../../assets/icons/serchIcon.svg";
export const customersData: CustomersTypes = {

    title: "Customers",

    actions: {
        export: "Export",
        addCustomer: "Add Customer",
    },

    filters: {
        filter: "Filter",
        filter_icon:ArrownDown,
        search: "Search...",
        search_icon:SearchIcon,
    },

    tableActions: {
        edit:EditIcon,
        delete:DeleteIcon,
    },

    columns: [
        "Name",
        "Location",
        "Orders",
        "Spent",
    ],

    customers: [
        {
            selected: false,
            name: "Rakesh Mishra",
            location: "Sawanchester",
            orders: 5,
            spent: "$96.14",
        },
        {
            selected: false,
            name: "Lakshman singh",
            location: "Kaydenville",
            orders: 12,
            spent: "$22.18",
        },
        {
            selected: false,
            name: "Dinanath sah",
            location: "East Freidaton",
            orders: 6,
            spent: "$59.64",
        },
        {
            selected: false,
            name: "Anmol yadav",
            location: "South Marcellus",
            orders: 3,
            spent: "$54.52",
        },
        {
            selected: false,
            name: "Raushan singh Rajput",
            location: "South Olestad",
            orders: 15,
            spent: "$45.8",
        },
        {
            selected: false,
            name: "Lokesh Rahul",
            location: "Dereckberg",
            orders: 12,
            spent: "$85.78",
        },
        {
            selected: false,
            name: "Randhir Kumar",
            location: "Franeckiview",
            orders: 5,
            spent: "$128.66",
        },
        {
            selected: false,
            name: "Khushi Kumari",
            location: "Port Kathryne",
            orders: 7,
            spent: "$113.39",
        },
        {
            selected: false,
            name: "Pooja Kumari",
            location: "McGlyntown",
            orders: 14,
            spent: "$80.80",
        },
        {
            selected: false,
            name: "Ruhi Kumari",
            location: "Krystalview",
            orders: 5,
            spent: "$42.03",
        },
    ],

    pagination: {
        pages: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "...",
            "24",
        ],
        currentPage: "2",
        results: "154 Results",
        previousIcon:ArrowLeft,
        nextIcon:ArrowRight,
    },

};