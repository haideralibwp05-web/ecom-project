export interface createCategoryTypes {
    BackButton:{
    img:string;
    text:string;
    }
    title: string;
    actions: {
        cancel: string;
        save: string;
    };

    products: {
        title: string;
        count: number;

        items: {
            
            dots: string;
            image: string;
            name: string;
            edit:string;
            delete:string;
        }[];
    };

    categoryInfo: {
        title: string;
        name: string;
        image: string;
        addFile: string;
    };
}