
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    getCategories,
    deleteCategory,
} from "../../../../services/categoryApi";
import { getProducts } from "../../../../services/productApi";
import ConfirmPopup from "../../../components/shared/ConfirmPopup";
import "../../../../style.css";
import { categoriesData as data } from "../../../data/categories";

interface Category {
    id: number;
    name: string;
    image: string | null;
    parent: number | null;
    parent_name: string | null;
}

interface Product {
    id: number;
    category: number | { id: number };
    category_id?: number;
}

const Categories = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [expandedParents, setExpandedParents] = useState<number[]>([]);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const [selectedCategory, setSelectedCategory] =
        useState<Category | null>(null);

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [deleting, setDeleting] = useState(false);

    // Fetch categories and products
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResult, productsResult] =
                    await Promise.all([getCategories(), getProducts()]);

                setCategories(categoriesResult);
                setProducts(productsResult);
            } catch (error) {
                console.error("CATEGORY FETCH ERROR:", error);
                setError("Failed to load categories.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Parent categories
    const parentCategories = categories.filter(
        (category) => category.parent === null
    );

    // Get subcategories belonging to a parent
    const getSubcategories = (parentId: number) =>
        categories.filter((category) => category.parent === parentId);

    // Expand or collapse parent category
    const toggleParent = (parentId: number) => {
        setExpandedParents((previous) =>
            previous.includes(parentId)
                ? previous.filter((id) => id !== parentId)
                : [...previous, parentId]
        );
    };

    // Open or close the three-dot menu
    const toggleMenu = (categoryId: number) => {
        setOpenMenuId((previous) =>
            previous === categoryId ? null : categoryId
        );
    };

    // Add subcategory under the selected parent
    const handleAddSubcategory = (parentId: number) => {
        setOpenMenuId(null);
        navigate(`/admin/categories/create?parent=${parentId}`);
    };

    // Get product's category ID
    const getProductCategoryId = (product: Product): number | null => {
        if (typeof product.category === "number") {
            return product.category;
        }

        if (
            product.category &&
            typeof product.category === "object" &&
            typeof product.category.id === "number"
        ) {
            return product.category.id;
        }

        if (typeof product.category_id === "number") {
            return product.category_id;
        }

        return null;
    };

    // Count products directly assigned to a category
    const getDirectProductCount = (categoryId: number) =>
        products.filter(
            (product) => getProductCategoryId(product) === categoryId
        ).length;

    // Count products in a parent and its subcategories
    const getParentProductCount = (parentId: number) => {
        const childIds = getSubcategories(parentId).map(
            (category) => category.id
        );

        return products.filter((product) => {
            const productCategoryId = getProductCategoryId(product);

            return (
                productCategoryId === parentId ||
                (productCategoryId !== null &&
                    childIds.includes(productCategoryId))
            );
        }).length;
    };

    // Open delete confirmation
    const openDeletePopup = (category: Category) => {
        setOpenMenuId(null);
        setSelectedCategory(category);
        setDeleteError("");
        setShowDeletePopup(true);
    };

    // Delete category
    const handleDeleteCategory = async () => {
        if (!selectedCategory || deleting) {
            return;
        }

        setDeleting(true);

        try {
            await deleteCategory(selectedCategory.id);

            setCategories((previous) =>
                previous.filter((category) => {
                    // Remove the selected category.
                    // Normally, a parent with children cannot be deleted.
                    return category.id !== selectedCategory.id;
                })
            );

            setExpandedParents((previous) =>
                previous.filter((id) => id !== selectedCategory.id)
            );

            setShowDeletePopup(false);
            setSelectedCategory(null);
            setDeleteError("");
        } catch (error) {
            console.error("CATEGORY DELETE ERROR:", error);

            setShowDeletePopup(false);
            setDeleteError(
                error instanceof Error
                    ? error.message
                    : "This category cannot be deleted."
            );
        } finally {
            setDeleting(false);
        }
    };

    // Render subcategory image card
    const renderCategoryCard = (category: Category) => (
        <div
            className="adminCategoriesCard adminSubcategoryCard"
            key={category.id}
        >
            <div className="adminCategoriesImage">
                <img
                    src={category.image ?? ""}
                    alt={category.name}
                />

                <Link
                    to={`/admin/categories/${category.id}`}
                    className="adminCategoriesEdit"
                >
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <img src={data.items.Edit_Icon} alt="" />
                        Edit
                    </span>
                </Link>
            </div>

            <div className="adminCategoriesInfo">
                <div className="adminCategoryCardText">
                    <strong>{category.name}</strong>

                    {/* <span className="adminCategoryType">
                        Subcategory of {category.parent_name || "Parent"}
                    </span> */}

                    <span className="adminCategoryProductCount">
                        {getDirectProductCount(category.id)} Products
                    </span>
                </div>

                <button
                    type="button"
                    className="adminCategoriesDelete"
                    onClick={() => openDeletePopup(category)}
                    aria-label={`Delete ${category.name}`}
                >
                    <img src={data.items.Delete_Icon} alt="Delete" />
                </button>
            </div>
        </div>
    );

    return (
        <main className="adminPages">
            <div className="adminPagesHeader">
                <h2>{data.title}</h2>

                <div className="adminPagesHeader_buttons">
                    <Link
                        to="/admin/categories/create"
                        className="adminPagesHeader_button2"
                    >
                        + {data.addCategory}
                    </Link>
                </div>
            </div>

            {loading ? (
                <p>Loading categories...</p>
            ) : error ? (
                <p>{error}</p>
            ) : parentCategories.length === 0 ? (
                <p>No parent categories found.</p>
            ) : (
                <div className="adminCategoryHierarchy">
                    {parentCategories.map((parent) => {
                        const children = getSubcategories(parent.id);
                        const isExpanded = expandedParents.includes(parent.id);
                        const isMenuOpen = openMenuId === parent.id;

                        return (
                            <div
                                className="adminCategoryGroup"
                                key={parent.id}
                            >
                                {/* Parent category row */}
                                <div className="adminCategoryParentHeader">
                                    <button
                                        type="button"
                                        className="adminCategoryParentToggle"
                                        onClick={() => toggleParent(parent.id)}
                                        aria-expanded={isExpanded}
                                    >
                                        <span>{parent.name}</span>

                                        <span className="adminCategoryExpandIcon">
                                            {isExpanded ? "−" : "+"}
                                        </span>
                                    </button>

                                    <span className="adminCategoryParentCount">
                                        {getParentProductCount(parent.id)} Products
                                    </span>

                                    {/* Three-dot menu */}
                                    <div className="adminCategoryParentActions">
                                        <button
                                            type="button"
                                            className="adminCategoryMenuButton"
                                            onClick={() => toggleMenu(parent.id)}
                                            aria-label={`Actions for ${parent.name}`}
                                            aria-expanded={isMenuOpen}
                                        >
                                            ⋮
                                        </button>

                                        {isMenuOpen && (
                                            <div className="adminCategoryDropdown">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleAddSubcategory(parent.id)
                                                    }
                                                >
                                                    <span>+</span>
                                                    Add Subcategory
                                                </button>

                                                <Link
                                                    to={`/admin/categories/${parent.id}`}
                                                    onClick={() =>
                                                        setOpenMenuId(null)
                                                    }
                                                >
                                                    <span>✎</span>
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    className="adminCategoryDropdownDelete"
                                                    onClick={() =>
                                                        openDeletePopup(parent)
                                                    }
                                                >
                                                    <span>×</span>
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Subcategories */}
                                {isExpanded && (
                                    <div className="adminSubcategorySection">
                                        <div className="adminSubcategoryHeader">
                                            {/* <h3>
                                                {parent.name} Subcategories
                                            </h3> */}

                                            <span>
                                                {children.length} Categories
                                            </span>
                                        </div>

                                        {children.length === 0 ? (
                                            <p className="adminEmptyCategory">
                                                No subcategories added yet.
                                            </p>
                                        ) : (
                                            <div className="adminCategories">
                                                {children.map((child) =>
                                                    renderCategoryCard(child)
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Delete error popup */}
            {deleteError ? (
                <ConfirmPopup
                    open={true}
                    message={deleteError}
                    confirmText="OK"
                    showCancel={false}
                    onCancel={() => setDeleteError("")}
                    onConfirm={() => setDeleteError("")}
                />
            ) : (
                <ConfirmPopup
                    open={showDeletePopup}
                    message={
                        selectedCategory
                            ? `Are you sure you want to delete "${selectedCategory.name}"?`
                            : ""
                    }
                    cancelText="Cancel"
                    confirmText={deleting ? "Deleting..." : "Delete"}
                    onCancel={() => {
                        if (deleting) return;

                        setShowDeletePopup(false);
                        setSelectedCategory(null);
                    }}
                    onConfirm={handleDeleteCategory}
                />
            )}
        </main>
    );
};

export default Categories;
