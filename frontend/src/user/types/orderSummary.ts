export interface Order_Summary {
    Heading: string;
    Sub_total: {
        text: string;
        Price: string;
    },
    Discount: {
        text: string;
        Price: string;
    },
    DelivryFee: {
        text: string;
        Price: string;
    },
    Total: {
        text: string;
        Price: string;
    }
    PromoCode: {
        icon: string;
        Text: string;
    }
    ApplyBtn: string;
    CheckoutBtn: {
        Text: string;
        Icon: string;
    }
}