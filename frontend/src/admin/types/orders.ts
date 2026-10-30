export interface OrdersTypes {
    title: string;

    actions: {
        export: string;
        addOrder: string;
    };

    filters: {
        filter: string;
        filter_icon:string;
        search: string;
        serach_icon:string;
    };

    tableActions: {
        edit: string;
        delete: string;
    };

    columns: string[];

    orders: {
        selected: boolean;
        order: string;
        date: string;
        customer: string;
        paymentStatus: string;
        orderStatus: string;
        total: string;
    }[];

    pagination: {
        pages: string[];
        currentPage: string;
        previousIcon: string;
        nextIcon: string;
    };
}