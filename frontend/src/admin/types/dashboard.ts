export interface DashboardTypes {
    title: string;

    overview: {
        title: string;
        cards: {
            title: string;
            value?:any;
        }[];
    };

    recentOrders: {
        title: string;
        orders: {
            order: string;
            customer: string;
            date: string;
            status: string;
            total: string;
        }[];
    };

    topProducts: {
        title: string;
        products: {
            image: string;
            name: string;
            orders: string;
            sales: string;
        }[];
    };

    lowStock: {
        title: string;
        products: {
            image: string;
            name: string;
            stock: string;
        }[];
    };
}