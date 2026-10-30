
import { useEffect, useState } from "react";
import {
    getProductsByCategory,
    deleteProduct,
} from "../../../../services/productApi";
import "../../../../style.css";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { createCategoryData as data } from "../../../data/createCategory";
import ConfirmPopup from "../../../components/shared/ConfirmPopup";
import {
    createCategory,
    getCategory,
    getCategories,
    updateCategory,
    type Category,
} from "../../../../services/categoryApi";
import {
    validateCategoryForm,
    type CategoryFormErrors,
} from "../../../../utils/validations/admin";

const Create_Category = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const isEditMode = Boolean(id);

    // Parent ID query string se mil sakti hai:
    // /admin/categories/create?parent=1
    const requestedParentId = searchParams.get("parent");
    const isParentLocked = !isEditMode && requestedParentId !== null;

    const [name, setName] = useState("");
    const [parent, setParent] = useState<number | null>(
        requestedParentId ? Number(requestedParentId) : null
    );

    const [categories, setCategories] = useState<Category[]>([]);
    const [apiError, setApiError] = useState("");

    const [image, setImage] = useState<File | null>(null);
    const [existingImage, setExistingImage] = useState("");

    const [errors, setErrors] = useState<CategoryFormErrors>({});
    const [saving, setSaving] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(false);

    const [products, setProducts] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [deletingProduct, setDeletingProduct] = useState(false);

    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedEditProduct, setSelectedEditProduct] =
        useState<any | null>(null);

    // Current mode:
    // parent === null means main category.
    // parent !== null means subcategory.
    const isSubcategory = parent !== null;
    const isMainCategory = !isSubcategory;

    const currentCategory = categories.find(
        (category) => category.id === Number(id)
    );

    const parentOptions = categories.filter(
        (category) =>
            category.parent === null &&
            category.id !== Number(id)
    );

    const selectedParent = categories.find(
        (category) => category.id === parent
    );

    const validateField = (
        field: keyof CategoryFormErrors,
        overrides: {
            name?: string;
            hasImage?: boolean;
        } = {}
    ) => {
        const validationErrors = validateCategoryForm({
            name,
            // Main category ke liye image validation disable.
            hasImage: isSubcategory
                ? Boolean(image || existingImage)
                : true,
            ...overrides,
        });

        setErrors((previous) => ({
            ...previous,
            [field]: validationErrors[field],
        }));
    };

    // Fetch categories
    useEffect(() => {
        getCategories()
            .then((result) => {
                setCategories(result);

                // Add Subcategory route mein parent validate karo.
                if (!isEditMode && requestedParentId !== null) {
                    const parentId = Number(requestedParentId);
                    const validParent = result.find(
                        (category) =>
                            category.id === parentId &&
                            category.parent === null
                    );

                    if (validParent) {
                        setParent(validParent.id);
                    } else {
                        setParent(null);
                        setApiError(
                            "Selected parent category was not found."
                        );
                    }
                }
            })
            .catch((error) => {
                console.error("CATEGORIES FETCH ERROR:", error);
                setApiError("Unable to load categories.");
            });
    }, [id, isEditMode, requestedParentId]);

    // Fetch category details only in edit mode.
    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchCategory = async () => {
            try {
                setLoadingCategory(true);

                const categoryId = Number(id);
                const result = await getCategory(categoryId);

                setName(result.name);
                setParent(result.parent ?? null);
                setExistingImage(result.image ?? "");

                // Parent categories should not display a products panel.
                if (result.parent !== null) {
                    setLoadingProducts(true);

                    const categoryProducts =
                        await getProductsByCategory(categoryId);

                    setProducts(categoryProducts);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("CATEGORY FETCH ERROR:", error);
                setApiError("Unable to load category details.");
            } finally {
                setLoadingCategory(false);
                setLoadingProducts(false);
            }
        };

        fetchCategory();
    }, [id]);

    // Delete product from the subcategory.
    const handleDeleteProduct = async () => {
        if (!selectedProduct || deletingProduct) {
            return;
        }

        try {
            setDeletingProduct(true);

            await deleteProduct(selectedProduct.id);

            setProducts((previousProducts) =>
                previousProducts.filter(
                    (product) => product.id !== selectedProduct.id
                )
            );

            setSelectedProduct(null);
            setShowDeletePopup(false);
        } catch (error) {
            console.error("CATEGORY PRODUCT DELETE ERROR:", error);
            setApiError(
                error instanceof Error
                    ? error.message
                    : "Unable to delete product."
            );
            setShowDeletePopup(false);
        } finally {
            setDeletingProduct(false);
        }
    };

    // Edit product confirmation.
    const handleEditProduct = () => {
        if (!selectedEditProduct) {
            return;
        }

        navigate(`/admin/products/edit/${selectedEditProduct.id}`, {
            state: {
                product: selectedEditProduct,
                returnTo: `/admin/categories/${id}`,
                categoryId: Number(id),
            },
        });

        setShowEditPopup(false);
        setSelectedEditProduct(null);
    };

    // Change parent category in create mode.
    const handleParentChange = (value: string) => {
        const newParent = value ? Number(value) : null;

        setParent(newParent);
        setApiError("");
        setImage(null);
        setExistingImage("");

        ((previous:any) => ({
            ...previous,
            image: undefined,
        }));
    };

    // Save / Update category.
    const handleSave = async () => {
        if (saving) {
            return;
        }

        const validationErrors = validateCategoryForm({
            name,
            // Image is required only for subcategories.
            hasImage: isSubcategory
                ? Boolean(image || existingImage)
                : true,
        });

        setErrors(validationErrors);
        setApiError("");

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        // A locked parent must still be a valid main category.
        if (isSubcategory) {
            const validParent = categories.some(
                (category) =>
                    category.id === parent &&
                    category.parent === null
            );

            if (!validParent) {
                setApiError(
                    "Please select a valid parent category."
                );
                return;
            }

            if (!image && !existingImage && !isEditMode) {
                setErrors((previous) => ({
                    ...previous,
                    image: "An image is required for a subcategory.",
                }));
                return;
            }
        }

        try {
            setSaving(true);

            if (isEditMode) {
                await updateCategory(
                    Number(id),
                    name.trim(),
                    image ?? undefined,
                    parent
                );
            } else {
                await createCategory(
                    name.trim(),
                    isSubcategory ? image ?? undefined : undefined,
                    parent
                );
            }

            navigate("/admin/categories");
        } catch (error) {
            console.error(
                isEditMode
                    ? "CATEGORY UPDATE ERROR:"
                    : "CATEGORY CREATE ERROR:",
                error
            );

            setApiError(
                error instanceof Error
                    ? error.message
                    : "Unable to save category."
            );
        } finally {
            setSaving(false);
        }
    };

    const pageTitle = isEditMode
        ? name || "Edit Category"
        : isSubcategory
            ? "Add Subcategory"
            : "Create Category";

    return (
        <main className="adminPages">
            {(saving || loadingCategory) && (
                <div className="PageLoading">
                    <div className="pageLoadingSpinner"></div>
                </div>
            )}

            <div className="adminPagesHeader">
                <div>
                    <Link
                        to="/admin/categories"
                        className="adminAddProductBack"
                    >
                        <img src={data.BackButton.img} alt="" />
                        <p>{data.BackButton.text}</p>
                    </Link>

                    <h2>{pageTitle}</h2>
                </div>

                <div className="adminPagesHeader_buttons">
                    <Link
                        to="/admin/categories"
                        className="adminPagesHeader_button1"
                    >
                        {data.actions.cancel}
                    </Link>

                    <button
                        type="button"
                        className="adminPagesHeader_button2"
                        onClick={handleSave}
                        disabled={saving || loadingCategory}
                    >
                        {saving
                            ? "Saving..."
                            : isEditMode
                                ? "Update"
                                : data.actions.save}
                    </button>
                </div>
            </div>

            <div
                className={
                    isSubcategory && isEditMode
                        ? "adminCategoryDetails"
                        : "adminCategoryDetails adminCategoryDetails--create"
                }
            >
                {/* Products panel: subcategory edit only */}
                {isEditMode && isSubcategory && (
                    <div className="adminCategoryProducts">
                        <div className="adminCategoryProductsTitle">
                            <h3>{data.products.title}</h3>
                            <span>{products.length}</span>

                            <div>
                                <button type="button"></button>
                                <button type="button"></button>
                            </div>
                        </div>

                        {loadingProducts ? (
                            <p>Loading products...</p>
                        ) : products.length === 0 ? (
                            <p className="adminEmptyCategory">
                                No products in this category.
                            </p>
                        ) : (
                            products.map((product) => (
                                <div
                                    className="adminCategoryProduct"
                                    key={product.id}
                                >
                                    <div className="adminCategoryProduct_left">
                                        <span>
                                            <img
                                                src={data.products.items[0]?.dots}
                                                alt=""
                                            />
                                        </span>

                                        {product.images?.length > 0 && (
                                            <img
                                                src={`http://127.0.0.1:8000${product.images[0].image}`}
                                                alt={product.name}
                                                className="adminCategoryProduct_img"
                                            />
                                        )}

                                        <span>{product.name}</span>
                                    </div>

                                    <div className="adminCreateCategoryactions">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedEditProduct(product);
                                                setShowEditPopup(true);
                                            }}
                                        >
                                            <img
                                                src={data.products.items[0]?.edit}
                                                alt="Edit"
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setShowDeletePopup(true);
                                            }}
                                        >
                                            <img
                                                src={data.products.items[0]?.delete}
                                                alt="Delete"
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                        <Link
                            to="/admin/products/add"
                            state={{
                                returnTo: `/admin/categories/${id}`,
                                categoryId: Number(id),
                            }}
                            className="adminCategoryAddProduct"
                        >
                            + Add Product
                        </Link>
                    </div>
                )}

                {/* Category information */}
                <div className="adminCategoryInfo">
                    <h3>{data.categoryInfo.title}</h3>

                    <label htmlFor="categoryName">Category Name</label>

                    <input
                        id="categoryName"
                        type="text"
                        value={name}
                        onChange={(event) => {
                            const value = event.target.value;

                            setName(value);
                            ((previous:any) => ({
                                ...previous,
                                name: undefined,
                            }));

                            validateField("name", {
                                name: value,
                            });
                        }}
                        placeholder="Enter category name"
                    />

                    {errors.name && (
                        <p
                            style={{
                                color: "#dc2626",
                                fontSize: "12px",
                                margin: "5px 0 12px",
                            }}
                        >
                            {errors.name}
                        </p>
                    )}

                    {/* Parent selection is shown only during creation. */}
                    {!isEditMode && (
                        <>
                            <label htmlFor="parentCategory">
                                Parent Category
                            </label>

                            <select
                                id="parentCategory"
                                className="adminCategoryParentSelect"
                                value={parent ?? ""}
                                disabled={isParentLocked}
                                onChange={(event) =>
                                    handleParentChange(event.target.value)
                                }
                            >
                                <option value="">
                                    None (Main Category)
                                </option>

                                {parentOptions.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            {isParentLocked && selectedParent && (
                                <p className="adminCategoryParentHint">
                                    Parent category: {selectedParent.name}
                                </p>
                            )}
                        </>
                    )}

                    {/* On edit, parent is visible but locked only for subcategories. */}
                    {isEditMode && isSubcategory && (
                        <>
                            <label htmlFor="lockedParentCategory">
                                Parent Category
                            </label>

                            <select
                                id="lockedParentCategory"
                                className="adminCategoryParentSelect"
                                value={parent ?? ""}
                                disabled
                            >
                                {selectedParent && (
                                    <option value={selectedParent.id}>
                                        {selectedParent.name}
                                    </option>
                                )}
                            </select>
                        </>
                    )}

                    {/* Image field: subcategories only */}
                    {isSubcategory && (
                        <>
                            <label htmlFor="categoryImage">
                                Image
                            </label>

                            <div className="adminCreateCategoryUpload">
                                <label
                                    htmlFor="categoryImage"
                                    className="adminCreateCategoryFileButton"
                                    style={{ color: "#1E5EFF" }}
                                >
                                    {isEditMode
                                        ? "Change Image"
                                        : "Choose Image"}
                                </label>

                                <input
                                    id="categoryImage"
                                    type="file"
                                    accept="image/*"
                                    className="adminCreateCategoryFileInput"
                                    onChange={(event) => {
                                        const file =
                                            event.target.files?.[0] ?? null;

                                        setImage(file);
                                        ((previous:any) => ({
                                            ...previous,
                                            image: undefined,
                                        }));

                                        validateField("image", {
                                            hasImage: Boolean(
                                                file || existingImage
                                            ),
                                        });

                                        event.target.value = "";
                                    }}
                                />

                                {image && (
                                    <span className="adminCreateCategoryFileName">
                                        {image.name}
                                    </span>
                                )}

                                {!image && existingImage && (
                                    <span className="adminCreateCategoryFileName">
                                        {existingImage.split("/").pop()}
                                    </span>
                                )}

                                {!image && !existingImage && (
                                    <span>Choose an image file</span>
                                )}
                            </div>

                            {errors.image && (
                                <p
                                    style={{
                                        color: "#dc2626",
                                        fontSize: "12px",
                                        margin: "5px 0 0",
                                    }}
                                >
                                    {errors.image}
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>

            {apiError && (
                <p role="alert" className="adminCategoryApiError">
                    {apiError}
                </p>
            )}

            <ConfirmPopup
                open={showDeletePopup}
                message={
                    selectedProduct
                        ? `Are you sure you want to delete "${selectedProduct.name}"?`
                        : "Are you sure you want to delete this product?"
                }
                cancelText="Cancel"
                confirmText={deletingProduct ? "Deleting..." : "Delete"}
                onCancel={() => {
                    if (!deletingProduct) {
                        setShowDeletePopup(false);
                        setSelectedProduct(null);
                    }
                }}
                onConfirm={handleDeleteProduct}
            />

            <ConfirmPopup
                open={showEditPopup}
                message={
                    selectedEditProduct
                        ? `Are you sure you want to edit "${selectedEditProduct.name}"?`
                        : "Are you sure you want to edit this product?"
                }
                cancelText="Cancel"
                confirmText="Edit"
                onCancel={() => {
                    setShowEditPopup(false);
                    setSelectedEditProduct(null);
                }}
                onConfirm={handleEditProduct}
            />
        </main>
    );
};

export default Create_Category;
