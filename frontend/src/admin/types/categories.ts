
export interface CategoriesTypes {
    title: string;
    addCategory: string;

    items: {
    Delete_Icon: string;
    Edit_Icon: string;
    };

}


export interface Category {
    id: number;
    name: string;
    image: string | null;
    parent: number | null;
    parent_name: string | null;
}
