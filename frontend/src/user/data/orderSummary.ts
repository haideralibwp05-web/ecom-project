import type { Order_Summary } from "./../types/orderSummary";
import PromoCode from "../../assets/icons/PromoCode.svg";
import ArrowRight from "../../assets/icons/arrowRight.svg";
export const Order_SummaryData: Order_Summary = {
    Heading: "Order Summary",
    Sub_total: {
        text: "Subtotal",
        Price: "$565"
    },
    Discount: {
        text: "Discount",
        Price: "-$113"
    },
    DelivryFee: {
        text: "Delivery Fee",
        Price: "$15"
    },
    Total: {
        text: "Total",
        Price: "$467"
    },
    PromoCode: {
        icon:PromoCode,
        Text: "Add promo code"
    },
    ApplyBtn: "Apply",
    CheckoutBtn: {
        Text: "Go to Checkout",
        Icon:ArrowRight
    }
}