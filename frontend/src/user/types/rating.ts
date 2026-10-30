export interface ratingTypes {
    loadButton: string;
    productHeader: {
        id: number;
        label: string;
        url: string;
    }[];
    productFilter: {
        heading: string;
        counting: number;
        filterSrc: string;
        latest: {
            label: string;
            img: string;
        }
        reviewButton: string;
    },
    reviewCards: {
        id: number;
        stars: string;
        threeDots: string;
        name: string;
        verified: string;
        Desc: string;
    }[];

}

export interface FAQItem {
    id: number;
    question: string;
    answer: string;
}
