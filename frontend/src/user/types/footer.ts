export interface FooterTypes {
    FooterUpper: {
        heading: string;
        emailIcon: string;
        emailPlaceholder: string;
        subscribeText: string;
    };
    footer: {
        col_1: {
            logo: string;
            intro: string;
            socialIcons: {
                src: string;
                url: string;
            }[];
        };
        col_2: {
            heading: string;
            links: {
                label: string;
                url: string;
            }[];
        };
        col_3: {
            heading: string;
            links: {
                label: string;
                url: string;
            }[];
        };
        col_4: {
            heading: string;
            links: {
                label: string;
                url: string;
            }[];
        };
        col_5: {
            heading: string;
            links: {
                label: string;
                url: string;
            }[];
        };
        copyRight: string;
        bankImgs: {
            src: string;
            url: string;
        }[];
    };
}