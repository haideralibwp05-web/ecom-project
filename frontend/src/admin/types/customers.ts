export interface CustomersTypes {
    title: string;

    actions: {
        export: string;
        addCustomer: string;
    };

    filters: {
        filter: string;
        filter_icon: string;
        search: string;
        search_icon: string;
    };

    tableActions: {
        edit: string;
        delete: string;
    };

    columns: string[];

    customers: {
        selected: boolean;
        name: string;
        location: string;
        orders: number;
        spent: string;
    }[];

    pagination: {
        pages: string[];
        currentPage: string;
        results: string;
        previousIcon: string;
        nextIcon: string;
    };
}