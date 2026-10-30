export interface ProductsTypes {
    title: string;

    actions: {
        export: string;
        addProduct: string;
    };

    filters: {
        filter: string;
        filter_icon: string;
        search: string;
        serach_icon: string;
    };

    tableActions: {
        edit: string;
        delete: string;
    };

    columns: string[];

    products: {
        selected: boolean;
        image: string;
        name: string;
        category: string;
        inventory:number;
        color: string;
        price: string;
        rating: string;
    }[];

    pagination: {
        pages: string[];
        currentPage: string;
        results: string;
        previousIcon: string;
        nextIcon: string;
    };
}