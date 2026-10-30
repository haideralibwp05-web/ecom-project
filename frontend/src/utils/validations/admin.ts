// Add Product Validations//

export interface ProductFormValidationData {
    name: string;
    description: string;
    price: string;
    discountPrice: string;
    selectedCategory: number | null;
    stock: string;
    selectedColor: { name: string; hex: string } | null;
    selectedSizes: string[];
    selectedImages: File[];
    remainingExistingImages: number;
}

export interface ProductFormErrors {
    name?: string;
    description?: string;
    price?: string;
    discountPrice?: string;
    category?: string;
    stock?: string;
    color?: string;
    size?: string;
    images?: string;
}

export const validateProductForm = (
    data: ProductFormValidationData
): ProductFormErrors => {
    const errors: ProductFormErrors = {};

    // Product name
    if (!data.name.trim()) {
        errors.name = "Product name is required.";
    } else if (data.name.trim().length < 3) {
        errors.name = "Product name must be at least 3 characters.";
    }

    // Description
    if (!data.description.trim()) {
        errors.description = "Product description is required.";
    }

    // Category
    if (data.selectedCategory === null) {
        errors.category = "Please select a category.";
    }

    // Price
    if (!data.price.trim()) {
        errors.price = "Product price is required.";
    } else if (
        !Number.isFinite(Number(data.price)) ||
        Number(data.price) <= 0
    ) {
        errors.price = "Enter a valid price greater than 0.";
    }

    // Discount price is optional
    if (data.discountPrice.trim()) {
        const discount = Number(data.discountPrice);
        const price = Number(data.price);

        // if (!Number.isFinite(discount) || discount <= 0) {
        //     errors.discountPrice = "Enter a valid discount price.";
        // } else
             if (!errors.price && discount >= price) {
            errors.discountPrice =
                "Discount price must be less than the original price.";
        }
    }

    // Stock
    if (!data.stock.trim()) {
        errors.stock = "Stock quantity is required.";
    } else if (
        !Number.isInteger(Number(data.stock)) ||
        Number(data.stock) < 0
    ) {
        errors.stock =
            "Stock must be a whole number (0 or greater).";
    }

    // Color
    if (!data.selectedColor) {
        errors.color = "Please select a product color.";
    }

    // Size
    if (data.selectedSizes.length === 0) {
        errors.size = "Please select a product size.";
    }

    // Images are required only when no existing or new images remain.
    if (
        data.selectedImages.length === 0 &&
        data.remainingExistingImages === 0
    ) {
        errors.images = "Please select at least one product image.";
    }

    return errors;
};


// create category validation


export interface CategoryFormValidationData {
    name: string;
    hasImage: boolean;
}

export interface CategoryFormErrors {
    name?: string;
    image?: string;
}

export const validateCategoryForm = (
    data: CategoryFormValidationData
): CategoryFormErrors => {
    const errors: CategoryFormErrors = {};
    const categoryName = data.name.trim();

    if (!categoryName) {
        errors.name = "Category name is required.";
    } else if (categoryName.length < 3) {
        errors.name = "Category name must be at least 3 characters.";
    }

    if (!data.hasImage) {
        errors.image = "Please select a category image.";
    }

    return errors;
};
