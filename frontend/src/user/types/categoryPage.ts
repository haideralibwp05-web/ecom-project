
export interface Category {
    id: number;
    name: string;
    image?: string | null;
    parent: number | null;
    parent_name?: string | null;
}

export interface ProductImage {
    id: number;
    image: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;

    category: number;
    // category_id?: number;
    category_name?: string;

    price: string;
    discount_price: string | null;

    color_name: string;
    color_hex: string;

    sizes: string[];
    stock: number;
rating:number;
    images: ProductImage[];
}

export interface FilterState {
    minPrice: number;
    maxPrice: number;
    colors: string[];
    sizes: string[];
    subcategoryIds: number[];
}

export interface CategoryPageData {
    breadcrumb: {
        home: string;
        arrow: string;
    };

    filters: {
        heading: string;
        icon: string;
        arrow: string;
        arrowUp: string;
        close: string;

        price: string;
        colors: string;
        sizes: string;
        dressStyle: string;
        apply: string;
        clear: string;

        colorOptions: string[];

        sizeOptions: {
            label: string;
            value: string;
        }[];

        styles: string[];
    };

    products: {
        sortText: string;
        sortIcon: string;
        defaultSort: string;
        perPage: number;
        empty: string;
        loading: string;
    };

    pagination: {
        previous: string;
        next: string;
        previousIcon: string;
        nextIcon: string;
    };
}
