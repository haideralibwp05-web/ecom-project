export interface productDetailsTypes {
    col_1: {
        id:number;
        src: string;
        url: string;
    }[];
    col_2: {
        src: string;
        url: string;
    };
    col_3: {
        heading: string;
        stars: string;
        rating: string;
        currentPrice: string;
        discountPrice: string;
        discount: string;
        Desc: string;
        colors: {
            text: string,
            colorCicle: {
                id:number;
                circle: string;
                url: string
            }[];
        },
        sizes: {
            text: string;
            size: {
                id:number;
                label: string;
                url: string;
            }[];
        },
        button: string;
    }
}
