export interface Crart_Section {
    HeaderLinks: {
        label_1: string;
        dropright: string;
        label_2: string;
    },
    Heading: string;
    Cart: {
        id:number;
        img: string;
        title: string;
        sizeText: string;
        size: string;
        colorText: string;
        color: string;
        Price: string;
        DelIcon: string;
        quantity: {
            min: string;
            max: string;
        }
    }[];
}