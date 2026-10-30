
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    createProduct,
    updateProduct,
} from "../../../../services/productApi";
import { getCategories } from "../../../../services/categoryApi";
import type { Category } from "../../../types/categories";
import { addProductData as data, mainColors } from "../../../data/addProduct";
import {
    validateProductForm,
    type ProductFormErrors,
    type ProductFormValidationData,
} from "../../../../utils/validations/admin";
import "../../../../style.css";

const AddProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const editProduct = location.state?.product;
    const isEditMode = Boolean(editProduct);
    const backPath = location.state?.returnTo || "/admin/products";
    const selectedCategoryId = location.state?.categoryId;

    // CATEGORY
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [expandedParentId, setExpandedParentId] = useState<number | null>(null);

    const parentCategories = categories.filter(
        (category) => category.parent === null
    );

    const getSubcategories = (parentId: number) =>
        categories.filter((category) => category.parent === parentId);

    // IMAGES
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [removedExistingImages, setRemovedExistingImages] = useState<number[]>([]);

    // COLOR
    const [colorSearch, setColorSearch] = useState("");
    const [selectedColor, setSelectedColor] = useState<{
        name: string;
        hex: string;
    } | null>(null);
    const [colorOpen, setColorOpen] = useState(false);

    const filteredColors = mainColors.filter((color) =>
        color.name.toLowerCase().includes(colorSearch.toLowerCase())
    );

    // SIZE
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [sizeOpen, setSizeOpen] = useState(false);
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

    // PRODUCT FIELDS
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [stock, setStock] = useState("");
    const [errors, setErrors] = useState<ProductFormErrors>({});

    // VALIDATION
    const getValidationData = (
        overrides: Partial<ProductFormValidationData> = {}
    ): ProductFormValidationData => ({
        name,
        description,
        price,
        discountPrice,
        selectedCategory,
        stock,
        selectedColor,
        selectedSizes,
        selectedImages,
        remainingExistingImages: existingImages.filter(
            (image) => !removedExistingImages.includes(image.id)
        ).length,
        ...overrides,
    });

    const validateField = (
        field: keyof ProductFormErrors,
        overrides: Partial<ProductFormValidationData> = {}
    ) => {
        const validationErrors = validateProductForm(
            getValidationData(overrides)
        );

        setErrors((previous) => ({
            ...previous,
            [field]: validationErrors[field],
        }));
    };

    const showError = (message?: string) =>
        message ? (
            <p
                className="adminProductValidationError"
                style={{
                    color: "#dc2626",
                    fontSize: "12px",
                    margin: "5px 0 0",
                }}
            >
                {message}
            </p>
        ) : null;

    // FETCH CATEGORIES AND RESTORE CATEGORY SELECTION
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result: Category[] = await getCategories();
                setCategories(result);

                const targetCategoryId = isEditMode
                    ? Number(editProduct.category)
                    : selectedCategoryId
                      ? Number(selectedCategoryId)
                      : null;

                if (!targetCategoryId) return;

                const category = result.find(
                    (item) => item.id === targetCategoryId
                );

                if (!category) return;

                if (category.parent !== null) {
                    // Existing or passed subcategory
                    setSelectedCategory(category.id);
                    setExpandedParentId(category.parent);
                } else {
                    // Parent passed from navigation: expand only
                    setSelectedCategory(null);
                    setExpandedParentId(category.id);
                }
            } catch (error) {
                console.error("CATEGORY FETCH ERROR:", error);
            }
        };

        fetchCategories();
    }, [selectedCategoryId, isEditMode, editProduct]);

    // RESTORE EXISTING PRODUCT DATA
    useEffect(() => {
        if (!editProduct) return;

        setName(editProduct.name || "");
        setDescription(editProduct.description || "");
        setPrice(editProduct.price?.toString() || "");
        setDiscountPrice(editProduct.discount_price?.toString() || "");
        setStock(editProduct.stock?.toString() || "");

        if (editProduct.color_name) {
            setSelectedColor({
                name: editProduct.color_name,
                hex: editProduct.color_hex || "#ffffff",
            });
        }

        setSelectedSizes(
            Array.isArray(editProduct.sizes) ? editProduct.sizes : []
        );
        setExistingImages(editProduct.images || []);
    }, [editProduct]);

    // PARENT CATEGORY CLICK
    const handleParentClick = (parent: Category) => {
        if (expandedParentId === parent.id) {
            setExpandedParentId(null);
            return;
        }

        setExpandedParentId(parent.id);

        const children = getSubcategories(parent.id);

        if (
            selectedCategory !== null &&
            !children.some((child) => child.id === selectedCategory)
        ) {
            setSelectedCategory(null);
            validateField("category", { selectedCategory: null });
        }
    };

    // SUBCATEGORY SELECT
    const handleSubcategorySelect = (subcategoryId: number) => {
        setSelectedCategory(subcategoryId);
        validateField("category", {
            selectedCategory: subcategoryId,
        });
    };

    // SIZE HANDLERS
    const handleSizeSelect = (size: string) => {
        const updated = selectedSizes.includes(size)
            ? selectedSizes.filter((item) => item !== size)
            : [...selectedSizes, size];

        setSelectedSizes(updated);
        validateField("size", { selectedSizes: updated });
    };

    const handleSizeRemove = (size: string) => {
        const updated = selectedSizes.filter((item) => item !== size);
        setSelectedSizes(updated);
        validateField("size", { selectedSizes: updated });
    };

    // IMAGE HANDLERS
    const handleImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const updated = [
                ...selectedImages,
                ...Array.from(event.target.files),
            ];

            setSelectedImages(updated);
            validateField("images", { selectedImages: updated });
            event.target.value = "";
        }
    };

    const handleRemoveExistingImage = (imageId: number) => {
        const updated = [...removedExistingImages, imageId];
        setRemovedExistingImages(updated);

        validateField("images", {
            remainingExistingImages: existingImages.filter(
                (item) => !updated.includes(item.id)
            ).length,
        });
    };

    const handleRemoveNewImage = (index: number) => {
        const updated = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updated);
        validateField("images", { selectedImages: updated });
    };

    // SAVE / UPDATE
    const handleSave = async () => {
        const validationErrors = validateProductForm(getValidationData());
        setErrors(validationErrors);

        if (Object.values(validationErrors).some(Boolean)) return;

        if (selectedCategory === null) {
            setErrors((previous) => ({
                ...previous,
                category: "Please select a subcategory.",
            }));
            return;
        }

        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price || "0");
            formData.append("discount_price", discountPrice || "0");

            // Save selected SUBCATEGORY ID
            formData.append("category", String(selectedCategory));

            formData.append("color_name", selectedColor?.name || "");
            formData.append("color_hex", selectedColor?.hex || "");

            selectedSizes.forEach((size) => {
                formData.append("sizes", size);
            });

            formData.append("stock", stock || "0");

            selectedImages.forEach((image) => {
                formData.append("images", image);
            });

            removedExistingImages.forEach((imageId) => {
                formData.append("removed_images", String(imageId));
            });

            if (isEditMode) {
                await updateProduct(editProduct.id, formData);
            } else {
                await createProduct(formData);
            }

            navigate(backPath);
        } catch (error) {
            console.error(
                isEditMode ? "PRODUCT UPDATE ERROR:" : "PRODUCT CREATE ERROR:",
                error
            );

            alert(
                error instanceof Error
                    ? error.message
                    : "Unable to save product. Please try again."
            );
        }
    };

    return (
        <main className="adminPages">
            {/* HEADER */}
            <div className="adminPagesHeader">
                <div>
                    <Link to={backPath} className="adminAddProductBack">
                        <img src={data.BackButton.img} alt="" />
                        <p>{data.BackButton.text}</p>
                    </Link>

                    <h2>{isEditMode ? "Update Product" : data.title}</h2>
                </div>

                <div className="adminPagesHeader_buttons">
                    <Link to={backPath} className="adminPagesHeader_button1">
                        {data.actions.cancel}
                    </Link>

                    <button
                        type="button"
                        className="adminPagesHeader_button2"
                        onClick={handleSave}
                    >
                        {isEditMode ? "Update" : data.actions.save}
                    </button>
                </div>
            </div>

            <div className="adminAddProduct">
                {/* LEFT COLUMN */}
                <div className="adminAddProductLeft">
                    {/* INFORMATION */}
                    <section className="adminAddProductSection">
                        <h3>{data.information.title}</h3>

                        <label>{data.information.productName}</label>
                        <input
                            type="text"
                            placeholder={data.information.productNamePlaceholder}
                            value={name}
                            onChange={(e) => {
                                const value = e.target.value;
                                setName(value);
                                validateField("name", { name: value });
                            }}
                        />
                        {showError(errors.name)}

                        <label>{data.information.description}</label>
                        <textarea
                            placeholder={data.information.descriptionPlaceholder}
                            value={description}
                            onChange={(e) => {
                                const value = e.target.value;
                                setDescription(value);
                                validateField("description", {
                                    description: value,
                                });
                            }}
                        />
                        {showError(errors.description)}

                        <hr />

                        <h3
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            {data.information.images}
                            <span
                                style={{
                                    color: "#1E5EFF",
                                    fontSize: "12px",
                                    fontWeight: 400,
                                }}
                            >
                                (Select Multiple Images)
                            </span>
                        </h3>

                        <div className="adminAddProductUpload">
                            <label className="adminAddProductUploadButton">
                                <p>{data.information.addFile}</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImages}
                                />
                            </label>

                            <span>{data.information.dragDrop}</span>
                        </div>

                        <div className="adminAddProductImageNames">
                            {isEditMode &&
                                existingImages
                                    .filter(
                                        (image) =>
                                            !removedExistingImages.includes(image.id)
                                    )
                                    .map((image, index) => (
                                        <div
                                            className="adminAddProductImageNameBox"
                                            key={`existing-${image.id || index}`}
                                        >
                                            <span>{image.image.split("/").pop()}</span>
                                            <button
                                                type="button"
                                                className="adminAddProductImageRemove"
                                                onClick={() =>
                                                    handleRemoveExistingImage(image.id)
                                                }
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}

                            {selectedImages.map((image, index) => (
                                <div
                                    className="adminAddProductImageNameBox"
                                    key={`new-${image.name}-${index}`}
                                >
                                    <span>{image.name}</span>
                                    <button
                                        type="button"
                                        className="adminAddProductImageRemove"
                                        onClick={() => handleRemoveNewImage(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        {showError(errors.images)}
                    </section>

                    {/* PRICE */}
                    <section className="adminAddProductSection">
                        <h3>{data.price.title}</h3>

                        <div className="adminAddProductFields">
                            <div>
                                <label>{data.price.productPrice}</label>
                                <input
                                    type="number"
                                    min={0}
                                    placeholder={data.price.productPricePlaceholder}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    value={price}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setPrice(value);
                                        validateField("price", { price: value });
                                        validateField("discountPrice", {
                                            price: value,
                                        });
                                    }}
                                />
                                {showError(errors.price)}
                            </div>

                            <div>
                                <label>{data.price.discountPrice}</label>
                                <input
                                    type="number"
                                    min={0}
                                    placeholder={data.price.discountPricePlaceholder}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    value={discountPrice}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setDiscountPrice(value);
                                        validateField("discountPrice", {
                                            discountPrice: value,
                                        });
                                    }}
                                />
                                {showError(errors.discountPrice)}
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN */}
                <div className="adminAddProductRight">
                    {/* CATEGORY TREE */}
                    <section className="adminAddProductCard adminaAddProductCategory">
                        <h3>{data.category.title}</h3>

                        <div className="adminProductCategoryTree">
                            {parentCategories.map((parent) => {
                                const children = getSubcategories(parent.id);
                                const isExpanded =
                                    expandedParentId === parent.id;

                                return (
                                    <div
                                        className="adminProductCategoryGroup"
                                        key={parent.id}
                                    >
                                        {/* Only name and arrow */}
                                        <button
                                            type="button"
                                            className={`adminProductParentButton ${
                                                isExpanded ? "active" : ""
                                            }`}
                                            aria-expanded={isExpanded}
                                            onClick={() => handleParentClick(parent)}
                                        >
                                            <span className="adminProductParentName">
                                                {parent.name}
                                            </span>

                                            <span className="adminProductCategoryChevron">
                                                {isExpanded ? "⌃" : "⌄"}
                                            </span>
                                        </button>

                                        {isExpanded && (
                                            <div className="adminProductSubcategoryList">
                                                {children.length > 0 ? (
                                                    children.map((subcategory) => (
                                                        <label
                                                            key={subcategory.id}
                                                            className={`adminProductSubcategoryOption ${
                                                                selectedCategory ===
                                                                subcategory.id
                                                                    ? "selected"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="productSubcategory"
                                                                value={subcategory.id}
                                                                checked={
                                                                    selectedCategory ===
                                                                    subcategory.id
                                                                }
                                                                onChange={() =>
                                                                    handleSubcategorySelect(
                                                                        subcategory.id
                                                                    )
                                                                }
                                                            />

                                                            <span className="adminProductSubcategoryName">
                                                                {subcategory.name}
                                                            </span>

                                                            {selectedCategory ===
                                                                subcategory.id && (
                                                                <span className="adminProductCategoryCheck">
                                                                    ✓
                                                                </span>
                                                            )}
                                                        </label>
                                                    ))
                                                ) : (
                                                    <p className="adminProductNoSubcategories">
                                                        No subcategories available.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {showError(errors.category)}
                    </section>

                    {/* INVENTORY, COLOR AND SIZE */}
                    <section className="adminAddProductSection">
                        <h3>{data.inventory.title}</h3>

                        {/* COLOR */}
                        <h3>{data.color.title}</h3>

                        <div className="adminAddProductColor">
                            <button
                                type="button"
                                className="adminAddProductColorSelect"
                                onClick={() => setColorOpen(!colorOpen)}
                            >
                                <span
                                    className="adminAddProductColorPreview"
                                    style={{
                                        backgroundColor:
                                            selectedColor?.hex || "#ffffff",
                                    }}
                                />
                                <span>
                                    {selectedColor?.name || "Select color"}
                                </span>
                            </button>

                            {colorOpen && (
                                <div className="adminAddProductColorDropdown">
                                    <input
                                        type="text"
                                        placeholder="Search Color..."
                                        value={colorSearch}
                                        onChange={(e) =>
                                            setColorSearch(e.target.value)
                                        }
                                        autoFocus
                                    />

                                    <div className="adminAddProductColorList">
                                        {filteredColors.map((color, index) => (
                                            <button
                                                type="button"
                                                key={`${color.hex}-${index}`}
                                                className="adminAddProductColorOption"
                                                onClick={() => {
                                                    setSelectedColor(color);
                                                    validateField("color", {
                                                        selectedColor: color,
                                                    });
                                                    setColorOpen(false);
                                                    setColorSearch("");
                                                }}
                                            >
                                                <span
                                                    className="adminAddProductColorCircle"
                                                    style={{
                                                        backgroundColor: color.hex,
                                                    }}
                                                />
                                                <span>{color.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {showError(errors.color)}

                        {/* SIZE */}
                        <h3>{data.size.title}</h3>

                        <div className="adminAddProductSize">
                            <button
                                type="button"
                                className="adminAddProductSizeSelect"
                                onClick={() => setSizeOpen(!sizeOpen)}
                            >
                                <span>
                                    {selectedSizes.length > 0
                                        ? `${selectedSizes.length} Size${
                                              selectedSizes.length > 1 ? "s" : ""
                                          } Selected`
                                        : data.size.placeholder}
                                </span>
                                <span>&#x2304;</span>
                            </button>

                            {sizeOpen && (
                                <div className="adminAddProductSizeDropdown">
                                    {sizes.map((size) => (
                                        <button
                                            type="button"
                                            key={size}
                                            className={`adminAddProductSizeOption ${
                                                selectedSizes.includes(size)
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() => handleSizeSelect(size)}
                                        >
                                            <span>{size}</span>
                                            {selectedSizes.includes(size) && (
                                                <span>✓</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {selectedSizes.length > 0 && (
                                <div className="adminAddProductSelectedSizes">
                                    {selectedSizes.map((size) => (
                                        <div
                                            key={size}
                                            className="adminAddProductSelectedSize"
                                        >
                                            <span>{size}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSizeRemove(size)
                                                }
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {showError(errors.size)}

                        {/* STOCK */}
                        <h3>{data.inventory.stock}</h3>
                        <input
                            type="number"
                            min={0}
                            placeholder={data.inventory.stockPlaceholder}
                            onWheel={(e) => e.currentTarget.blur()}
                            value={stock}
                            onChange={(e) => {
                                const value = e.target.value;
                                setStock(value);
                                validateField("stock", { stock: value });
                            }}
                        />
                        {showError(errors.stock)}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default AddProduct;
