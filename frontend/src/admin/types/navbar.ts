export interface NavbarData {
    logo: {
        image: string;
        text: string;
    };

    search: {
        icon: string;
        placeholder: string;
    };

    message: {
        icon: string;
    };

    notification: {
        icon: string;
        count: number;
    };

    profile: {
        name_spell:string;
        name: string;
    };
}