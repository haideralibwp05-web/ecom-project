export interface SidebarTypes {
    sections: {
        
        title?: string;
        items: {
            label: string;
            icon: string;
            badge?: number;
            path?:string;
        }[];
    }[];
}