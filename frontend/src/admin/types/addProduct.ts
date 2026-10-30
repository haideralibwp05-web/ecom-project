export interface AddProductTypes {
    BackButton: {
        img: string;
        text: string;
    };
    

    title: string;

    actions: {
        cancel: string;
        save: string;
    };

    information: {
        title: string;
        productName: string;
        productNamePlaceholder: string;
        description: string;
        descriptionPlaceholder: string;
        images: string;
        addFile: string;
        dragDrop: string;
    };

    price: {
        title: string;
        productPrice: string;
        productPricePlaceholder: string;
        discountPrice: string;
        discountPricePlaceholder: string;
    };

    category: {
        title: string;
        label: string;
    };

    color: {
        title: string;
        placeholder: string;
    };

    size: {
        title: string;
        placeholder: string;
    };

    inventory: {
        title: string;
        stock: string;
        stockPlaceholder: string;
    };
}


export interface Color {
    name: string;
    hex: string;
}