
export interface HeroSectionType {
    heading: string;
    description: string;
    button: string;
    heroImage: string;
    stats: {
        id: number;
        number: string;
        text: string;
    }[];
    brands: {
        id: number;
        image: string;
        url: string;
    }[];
}

export interface ProductSectionTypes {
    Heading: string;
    // button: string;
    product: {
        id: number;
        image: string;
        title: string;
        starsIcons: string;
        rating: string;
        RealPrice?: string;
        CurrentPrice: string;
        discount?: string;
    }[];
}

export interface BrowseTypes {
    Heading: string;
    Row1: {
        id: number;
        image: string;
        imageText: string;
    }[];
    Row2: {
        id: number;
        image: string;
        imageText: string;
    }[];
}

export interface Testimonial {
    heading: string;
    ArrowLeft: string;
    ArrowRight: string;
    cards: {
        id: number;
        name: string;
        review: string;
        rating: string;
        verified: string;
    }[];
}
