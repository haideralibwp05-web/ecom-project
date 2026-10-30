
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Slider from "@mui/material/Slider";
import { ShoppingCart, Eye } from "lucide-react";
import { getCategories } from "../../../../services/categoryApi";
import { getProducts } from "../../../../services/productApi";
import ProductQuickView from "../../../components/shared/ProductQuickView";
import { categoryPageData as data } from "../../../data/categoryPage";

import type {
    Category,
    Product,
    FilterState,
} from "../../../types/categoryPage";

const PAGE_SIZE = data.products.perPage || 10;

const API_BASE_URL = "http://127.0.0.1:8000";

const createDefaultFilters = (maxPrice: number): FilterState => ({
    minPrice: 0,
    maxPrice,
    colors: [],
    sizes: [],
    subcategoryIds: [],
});

// --------------------------------------
// PRICE HELPERS
// --------------------------------------

const getProductPrice = (product: Product): number => {
    const price = Number(product.price);
    const discountPrice = Number(product.discount_price);

    if (
        product.discount_price !== null &&
        product.discount_price !== undefined &&
        discountPrice > 0 &&
        discountPrice < price
    ) {
        return discountPrice;
    }

    return price;
};

const formatPrice = (price: number): string => {
    return price.toLocaleString("en-PK", {
        maximumFractionDigits: 2,
    });
};

// --------------------------------------
// IMAGE HELPER
// --------------------------------------

const getImageUrl = (image?: string | null): string => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

// --------------------------------------
// API RESPONSE HELPER
// Supports both arrays and DRF paginated results.
// --------------------------------------

const normalizeArray = <T,>(response: unknown): T[] => {
    if (Array.isArray(response)) {
        return response as T[];
    }

    if (
        response &&
        typeof response === "object" &&
        "results" in response &&
        Array.isArray(response.results)
    ) {
        return response.results as T[];
    }

    return [];
};

// --------------------------------------
// CATEGORY ID HELPERS
// --------------------------------------

const getProductCategoryId = (product: Product): number | null => {
    const categoryValue: unknown = product.category;

    // Your current Django API returns category as a number.
    if (
        typeof categoryValue === "number" &&
        Number.isFinite(categoryValue)
    ) {
        return categoryValue;
    }

    // Also support APIs that return category as an object.
    if (
        categoryValue &&
        typeof categoryValue === "object" &&
        "id" in categoryValue
    ) {
        const id = Number(categoryValue.id);

        if (Number.isFinite(id)) {
            return id;
        }
    }

    // Optional fallback if your API uses category_id.
    const categoryId = (
        product as Product & { category_id?: number | string }
    ).category_id;

    if (categoryId !== undefined && categoryId !== null) {
        const id = Number(categoryId);

        if (Number.isFinite(id)) {
            return id;
        }
    }

    return null;
};

const getParentCategoryId = (category: Category): number | null => {
    const parent: unknown = category.parent;

    if (
        parent === null ||
        parent === undefined ||
        parent === ""
    ) {
        return null;
    }

    const parentId = Number(parent);

    return Number.isFinite(parentId) ? parentId : null;
};

// --------------------------------------
// CATEGORY PAGE
// --------------------------------------

const CategoryPageContent = () => {
    const { id, categoryId } = useParams<{
        id?: string;
        categoryId?: string;
    }>();
const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    const selectedCategoryId = id ?? categoryId;

    // API DATA
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // FILTER STATES
    const [draftFilters, setDraftFilters] = useState<FilterState>(
        createDefaultFilters(0)
    );

    const [appliedFilters, setAppliedFilters] = useState<FilterState>(
        createDefaultFilters(0)
    );

    // SORT AND PAGINATION
    const [sortBy, setSortBy] = useState("popular");
    const [currentPage, setCurrentPage] = useState(1);

    // MOBILE FILTER
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // --------------------------------------
    // FETCH CATEGORIES AND PRODUCTS
    // --------------------------------------

    useEffect(() => {
        let active = true;

        const fetchData = async () => {
            setLoading(true);
            setError("");

            try {
                const [categoryResponse, productResponse] =
                    await Promise.all([
                        getCategories(),
                        getProducts(),
                    ]);

                if (!active) return;

                const categoryList = normalizeArray<Category>(
                    categoryResponse
                );

                const productList = normalizeArray<Product>(
                    productResponse
                );

                setCategories(categoryList);
                setProducts(productList);
            } catch (err) {
                console.error("Category page API error:", err);

                if (active) {
                    setError(
                        "Failed to load categories or products. Please check the Django API."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            active = false;
        };
    }, []);

    // --------------------------------------
    // SELECTED CATEGORY
    // --------------------------------------

    const selectedCategory = useMemo(() => {
        if (!selectedCategoryId) return undefined;

        return categories.find(
            (category) => Number(category.id) === Number(selectedCategoryId)
        );
    }, [categories, selectedCategoryId]);

    const isParentCategory =
        selectedCategory !== undefined &&
        getParentCategoryId(selectedCategory) === null;

    // --------------------------------------
    // DIRECT SUBCATEGORIES
    // --------------------------------------

    const subcategories = useMemo(() => {
        if (!selectedCategory) return [];

        return categories.filter(
            (category) =>
                getParentCategoryId(category) ===
                Number(selectedCategory.id)
        );
    }, [categories, selectedCategory]);

    // --------------------------------------
    // ALLOWED CATEGORY IDS
    //
    // Parent selected:
    // Parent's products + all direct subcategory products.
    //
    // Subcategory selected:
    // Only that subcategory's products.
    // --------------------------------------

    const allowedCategoryIds = useMemo(() => {
        if (!selectedCategory) return [];

        const selectedId = Number(selectedCategory.id);
        const parentId = getParentCategoryId(selectedCategory);

        // A subcategory is selected.
        if (parentId !== null) {
            return [selectedId];
        }

        // A parent category is selected.
        const childIds = categories
            .filter(
                (category) =>
                    getParentCategoryId(category) === selectedId
            )
            .map((category) => Number(category.id));

        return [selectedId, ...childIds];
    }, [categories, selectedCategory]);

    // --------------------------------------
    // PRODUCTS FOR CURRENT CATEGORY
    // --------------------------------------

    const categoryProducts = useMemo(() => {
        if (!selectedCategory) return [];

        const result = products.filter((product) => {
            const productCategoryId = getProductCategoryId(product);

            return (
                productCategoryId !== null &&
                allowedCategoryIds.includes(productCategoryId)
            );
        });

        return result;
    }, [products, allowedCategoryIds, selectedCategory]);


    // PRODUCTS USED FOR SIDEBAR FILTER OPTIONS
    // Parent category: selected subcategories ke mutabiq.
    // Subcategory page: sirf us subcategory ke products.

    const filterOptionProducts = useMemo(() => {
        if (!selectedCategory) return [];

        // Parent category page par koi subcategory select nahi hui
        // to parent + direct subcategories ke products use honge.
        if (
            isParentCategory &&
            draftFilters.subcategoryIds.length > 0
        ) {
            return categoryProducts.filter((product) => {
                const productCategoryId = getProductCategoryId(product);

                return (
                    productCategoryId !== null &&
                    draftFilters.subcategoryIds.includes(productCategoryId)
                );
            });
        }

        // Subcategory page par categoryProducts pehle se
        // sirf selected subcategory ke products rakhta hai.
        return categoryProducts;
    }, [
        selectedCategory,
        isParentCategory,
        categoryProducts,
        draftFilters.subcategoryIds,
    ]);


    // --------------------------------------
    // DYNAMIC COLORS FROM CURRENT CATEGORY PRODUCTS
    // --------------------------------------

    const availableColors = useMemo(() => {
        const uniqueColors = new Map<
            string,
            { name: string; hex: string; value: string }
        >();

        filterOptionProducts.forEach((product) => {
            const name = (product.color_name || "").trim();
            const hex = (product.color_hex || "").trim();

            if (!name && !hex) return;

            const value = hex || name;
            const key = value.toLowerCase();

            if (!uniqueColors.has(key)) {
                uniqueColors.set(key, {
                    name: name || hex,
                    hex: hex || "#cccccc",
                    value,
                });
            }
        });

        return Array.from(uniqueColors.values());
    }, [filterOptionProducts]);


    // --------------------------------------
    // DYNAMIC SIZES FROM CURRENT CATEGORY PRODUCTS
    // --------------------------------------


    const availableSizes = useMemo(() => {
        const allSizes: string[] = filterOptionProducts.flatMap(
            (product) =>
                Array.isArray(product.sizes) ? product.sizes : []
        );

        const uniqueSizes: string[] = [
            ...new Set(allSizes.filter(Boolean)),
        ];

        const standardOrder = ["XS", "S", "M", "L", "XL", "XXL"];

        return uniqueSizes.sort((a, b) => {
            const indexA = standardOrder.indexOf(a);
            const indexB = standardOrder.indexOf(b);

            if (indexA === -1 && indexB === -1) {
                return a.localeCompare(b);
            }

            if (indexA === -1) return 1;
            if (indexB === -1) return -1;

            return indexA - indexB;
        });
    }, [filterOptionProducts]);

    // --------------------------------------
    // MAXIMUM PRICE
    // --------------------------------------


    const maximumPrice = useMemo(() => {
        const prices = filterOptionProducts.map(getProductPrice);

        if (prices.length === 0) return 0;

        return Math.ceil(Math.max(...prices) / 100) * 100;
    }, [filterOptionProducts]);


    useEffect(() => {
        setDraftFilters((previous) => ({
            ...previous,
            minPrice: Math.min(previous.minPrice, maximumPrice),
            maxPrice: maximumPrice,
        }));
    }, [maximumPrice]);

    // --------------------------------------
    // RESET FILTERS WHEN CATEGORY CHANGES
    // --------------------------------------


    useEffect(() => {
        const defaults = createDefaultFilters(maximumPrice);

        setDraftFilters(defaults);
        setAppliedFilters(defaults);

        setCurrentPage(1);
        setSortBy("popular");
        setMobileFilterOpen(false);
    }, [selectedCategoryId, categoryProducts]);


    // --------------------------------------
    // UPDATE FILTERS
    // --------------------------------------

    const updateDraftFilters = (changes: Partial<FilterState>) => {
        setDraftFilters((previous) => ({
            ...previous,
            ...changes,
        }));
    };

    // SUBCATEGORY FILTER
    const toggleSubcategory = (id: number) => {
        setDraftFilters((previous) => ({
            ...previous,
            subcategoryIds: previous.subcategoryIds.includes(id)
                ? previous.subcategoryIds.filter(
                    (item) => item !== id
                )
                : [...previous.subcategoryIds, id],
        }));
    };

    // COLOR FILTER
    const toggleColor = (color: string) => {
        setDraftFilters((previous) => ({
            ...previous,
            colors: previous.colors.includes(color)
                ? previous.colors.filter((item) => item !== color)
                : [...previous.colors, color],
        }));
    };

    // SIZE FILTER
    const toggleSize = (size: string) => {
        setDraftFilters((previous) => ({
            ...previous,
            sizes: previous.sizes.includes(size)
                ? previous.sizes.filter((item) => item !== size)
                : [...previous.sizes, size],
        }));
    };

    // --------------------------------------
    // APPLY FILTERS
    // --------------------------------------

    const applyFilters = () => {
        setAppliedFilters({
            ...draftFilters,
            colors: [...draftFilters.colors],
            sizes: [...draftFilters.sizes],
            subcategoryIds: [...draftFilters.subcategoryIds],
        });

        setCurrentPage(1);
        setMobileFilterOpen(false);
    };

    // --------------------------------------
    // CLEAR FILTERS
    // --------------------------------------

    const clearFilters = () => {
        const defaults = createDefaultFilters(maximumPrice);

        setDraftFilters(defaults);
        setAppliedFilters(defaults);

        setCurrentPage(1);
        setMobileFilterOpen(false);
    };

    // --------------------------------------
    // FILTER PRODUCTS
    // --------------------------------------

    const filteredProducts = useMemo(() => {
        return categoryProducts.filter((product) => {
            const price = getProductPrice(product);

            const matchesPrice =
                price >= appliedFilters.minPrice &&
                (appliedFilters.maxPrice === 0 ||
                    price <= appliedFilters.maxPrice);


            const matchesColor =
                appliedFilters.colors.length === 0 ||
                appliedFilters.colors.some(
                    (color) =>
                        color.toLowerCase() ===
                        (product.color_hex || "").toLowerCase() ||
                        color.toLowerCase() ===
                        (product.color_name || "").toLowerCase()
                );



            const matchesSize =
                appliedFilters.sizes.length === 0 ||
                appliedFilters.sizes.some((size) =>
                    (product.sizes || []).includes(size)
                );

            const productCategoryId = getProductCategoryId(product);

            const matchesCategory =
                appliedFilters.subcategoryIds.length === 0 ||
                (
                    productCategoryId !== null &&
                    appliedFilters.subcategoryIds.includes(
                        productCategoryId
                    )
                );

            return (
                matchesPrice &&
                matchesColor &&
                matchesSize &&
                matchesCategory
            );
        });
    }, [categoryProducts, appliedFilters]);

    // --------------------------------------
    // SORT PRODUCTS
    // --------------------------------------

    const sortedProducts = useMemo(() => {
        const result = [...filteredProducts];

        switch (sortBy) {
            case "price-low":
                return result.sort(
                    (a, b) =>
                        getProductPrice(a) - getProductPrice(b)
                );

            case "price-high":
                return result.sort(
                    (a, b) =>
                        getProductPrice(b) - getProductPrice(a)
                );

            case "newest":
                return result.sort((a, b) => b.id - a.id);

            default:
                return result;
        }
    }, [filteredProducts, sortBy]);

    // --------------------------------------
    // PAGINATION
    // --------------------------------------

    const totalPages = Math.max(
        1,
        Math.ceil(sortedProducts.length / PAGE_SIZE)
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;

    const visibleProducts = sortedProducts.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );

    const showingStart =
        sortedProducts.length === 0 ? 0 : startIndex + 1;

    const showingEnd = Math.min(
        startIndex + PAGE_SIZE,
        sortedProducts.length
    );

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages) return;

        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // --------------------------------------
    // SHARED FILTERS: DESKTOP + MOBILE
    // --------------------------------------

    const renderFilters = () => (
        <>
            {/* CATEGORY FILTER */}
            <div>
                <div className="CategoryPageSectionHeadingRow">
                    <h2>{data.filters.heading}</h2>
                    <img src={data.filters.icon} alt="" />
                </div>

                <div className="DifferenceBorder" />

                <div className="CategoryPageSectionCol">
                    {isParentCategory ? (
                        subcategories.length > 0 ? (
                            subcategories.map((subcategory) => (
                                <label
                                    key={subcategory.id}
                                    className="CategoryPageSectionitemsRow"
                                >
                                    <span>{subcategory.name}</span>

                                    <input
                                        type="checkbox"
                                        checked={draftFilters.subcategoryIds.includes(
                                            Number(subcategory.id)
                                        )}
                                        onChange={() =>
                                            toggleSubcategory(
                                                Number(subcategory.id)
                                            )
                                        }
                                    />
                                </label>
                            ))
                        ) : (
                            <span>No subcategories found.</span>
                        )
                    ) : (
                        <span>{selectedCategory?.name}</span>
                    )}
                </div>

                <div className="DifferenceBorder" />
            </div>

            {/* PRICE FILTER */}
            <div>
                <div className="CategoryPageSectionHeadingRow">
                    <h2>{data.filters.price}</h2>
                    <img src={data.filters.arrowUp} alt="" />
                </div>

                <div className="PriceDiv">
                    <Slider
                        value={[
                            draftFilters.minPrice,
                            draftFilters.maxPrice,
                        ]}
                        onChange={(_, value) => {
                            const [min, max] = value as number[];

                            if (
                                typeof min !== "number" ||
                                typeof max !== "number"
                            ) {
                                return;
                            }

                            updateDraftFilters({
                                minPrice: min,
                                maxPrice: max,
                            });
                        }}
                        valueLabelDisplay="auto"
                        min={0}
                        max={Math.max(maximumPrice, 1)}
                        step={1}
                        disableSwap
                        sx={{ color: "#000000" }}
                    />

                    <div className="CategoryPriceValues">
                        <span>
                            Rs. {formatPrice(draftFilters.minPrice)}
                        </span>

                        <span>
                            Rs. {formatPrice(draftFilters.maxPrice)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="DifferenceBorder" />


            {/* COLORS */}
            <div>
                <div className="CategoryPageSectionHeadingRow">
                    <h2>{data.filters.colors}</h2>
                    <img src={data.filters.arrowUp} alt="" />
                </div>

                <div className="ColorBoxArrange">
                    {availableColors.length > 0 ? (
                        availableColors.map((color) => {
                            const isSelected =
                                draftFilters.colors.includes(color.value);

                            return (
                                <button
                                    type="button"
                                    key={color.value}
                                    className={`color-box ${isSelected ? "selected" : ""
                                        }`}
                                    style={{
                                        backgroundColor: color.hex,
                                        border: color.hex.toLowerCase() === "#ffffff"
                                            ? "1px solid #cccccc"
                                            : undefined,
                                    }}
                                    onClick={() => toggleColor(color.value)}
                                    aria-label={`Select ${color.name}`}
                                    title={color.name}
                                >
                                    {isSelected && (
                                        <span className="CategoryColorCheck">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <span>No colors available.</span>
                    )}
                </div>
            </div>


            <div className="DifferenceBorder" />


            {/* SIZES */}
            <div>
                <div className="CategoryPageSectionHeadingRow">
                    <h2>{data.filters.sizes}</h2>
                    <img src={data.filters.arrowUp} alt="" />
                </div>

                <div className="CategoryPageSizeBuuttons">
                    {availableSizes.length > 0 ? (
                        availableSizes.map((size) => (
                            <button
                                type="button"
                                key={size}
                                className={`CategoryPageSizeButton ${draftFilters.sizes.includes(size)
                                    ? "selected"
                                    : ""
                                    }`}
                                onClick={() => toggleSize(size)}
                            >
                                {size}
                            </button>
                        ))
                    ) : (
                        <span>No sizes available.</span>
                    )}
                </div>
            </div>


            <div className="DifferenceBorder" />

            {/* DRESS STYLE */}
            {/* <div className="CategoryStyles">
                <div className="CategoryPageSectionHeadingRow">
                    <h2>{data.filters.dressStyle}</h2>
                    <img src={data.filters.arrowUp} alt="" />
                </div>

                <div className="CategoryPageSectionCol">
                    {data.filters.styles.map((style) => {
                        const matchingCategory = categories.find(
                            (category) =>
                                category.name.toLowerCase() ===
                                style.toLowerCase()
                        );

                        return matchingCategory ? (
                            <Link
                                key={style}
                                className="CategoryPageSectionitemsRow"
                                to={`/category/${matchingCategory.id}`}
                                onClick={() =>
                                    setMobileFilterOpen(false)
                                }
                            >
                                <span>{style}</span>
                                <img src={data.filters.arrow} alt="" />
                            </Link>
                        ) : (
                            <div
                                key={style}
                                className="CategoryPageSectionitemsRow"
                            >
                                <span>{style}</span>
                            </div>
                        );
                    })}
                </div>
            </div> */}

            {/* APPLY FILTERS */}
            <button
                type="button"
                className="CategoryPageApplyFiltersBtn"
                onClick={applyFilters}
            >
                {data.filters.apply}
            </button>

            {/* CLEAR FILTERS */}
            <button
                type="button"
                className="CategoryClearFiltersBtn"
                onClick={clearFilters}
            >
                {data.filters.clear}
            </button>
        </>
    );

    // --------------------------------------
    // PAGE UI
    // --------------------------------------

    return (
        <div>
            {/* <Navbar /> */}


            {/* BREADCRUMB */}
            <div className="CategoryPageSidebarHeadings">
                <Link to="/">Home</Link>

                <img src={data.breadcrumb.arrow} alt="" />

                {selectedCategory && (() => {
                    const parentId = getParentCategoryId(selectedCategory);

                    const parentCategory =
                        parentId !== null
                            ? categories.find(
                                (category) => Number(category.id) === parentId
                            )
                            : undefined;

                    return (
                        <>
                            {parentCategory && (
                                <>
                                    <Link to={`/category/${parentCategory.id}`}>
                                        {parentCategory.name}
                                    </Link>

                                    <img src={data.breadcrumb.arrow} alt="" />
                                </>
                            )}

                            <span>{selectedCategory.name}</span>
                        </>
                    );
                })()}

                {!selectedCategory && <span>Category</span>}
            </div>


            <div className="Category_Page">
                {/* LEFT SIDEBAR */}
                <aside className="CategoryPageSidebar">
                    {renderFilters()}
                </aside>

                {/* RIGHT PRODUCT SECTION */}
                <section className="CategoryProductSection">
                    {/* HEADER */}
                    <div className="CategoryP_H">
                        <b>
                            {selectedCategory?.name || "Products"}
                        </b>

                        <div className="CategoryP_H_rightSide">
                            <p>
                                Showing {showingStart}-{showingEnd} of{" "}
                                {sortedProducts.length} Products
                            </p>

                            <div className="CategoryP_H_rightSide_Sort">
                                <p>{data.products.sortText}</p>

                                <select
                                    className="CategoryPopularSort"
                                    value={sortBy}
                                    onChange={(event) => {
                                        setSortBy(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="popular">
                                        {data.products.defaultSort}
                                    </option>

                                    <option value="newest">
                                        Newest
                                    </option>

                                    <option value="price-low">
                                        Price: Low to High
                                    </option>

                                    <option value="price-high">
                                        Price: High to Low
                                    </option>
                                </select>
                            </div>

                            <button
                                type="button"
                                className="CategoryMobileFilterButton"
                                onClick={() =>
                                    setMobileFilterOpen(true)
                                }
                            >
                                <img
                                    src={data.filters.icon}
                                    alt="Open filters"
                                />
                            </button>
                        </div>
                    </div>

                    {/* PRODUCTS */}
                    {/* PRODUCTS */}
                    {loading ? (
                        <div className="PageLoading">
                            <span className="pageLoadingSpinner"></span>
                        </div>
                    ) : error ? (
                        <p>{error}</p>
                    ) : !selectedCategory ? (
                        <p>
                            Category not found. Please check the category
                            ID in the URL.
                        </p>
                    ) : visibleProducts.length === 0 ? (
                        <p>{data.products.empty}</p>
                    ) : (
                        <div className="Category_Products">
                            {visibleProducts.map((product) => {
                                const price = Number(product.price);
                                const currentPrice =
                                    getProductPrice(product);

                                const hasDiscount =
                                    currentPrice < price;

                                const discount =
                                    hasDiscount && price > 0
                                        ? Math.round(
                                            ((price - currentPrice) /
                                                price) *
                                            100
                                        )
                                        : 0;

                                const firstImage =
                                    product.images?.[0]?.image;

                                return (
                                    <div
                                        key={product.id}
                                        className="CategoryProductCard"
                                    >
                                        <div className="productImageWrapper">
                                            <Link to={`/product/${product.id}`} className="productImageLink">
                                                {firstImage ? (
                                                    <>
                                                        <img
                                                            className="productImg productPrimaryImg"
                                                            src={getImageUrl(firstImage)}
                                                            alt={product.name}
                                                        />

                                                        {product.images?.length > 1 && (
                                                            <img
                                                                className="productImg productSecondaryImg"
                                                                src={getImageUrl(product.images[1]!.image)}
                                                                alt={`${product.name} - alternate view`}
                                                            />
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="CategoryNoImage">
                                                        No Image
                                                    </div>
                                                )}
                                            </Link>

                                            {/* IMAGE HOVER BUTTONS */}
                                            <div className="productHoverActions">
                                                <button
                                                    type="button"
                                                    className="productAddToCartBtn"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        setQuickViewProduct(product);
                                                    }}
                                                >
                                                    {/* <ShoppingCart size={18} /> */}
                                                    Quick View
                                                </button>

                                                {/* <Link
                                                    to={`/product/${product.id}`}
                                                    className="productQuickViewBtn"
                                                    title="View Product"
                                                    aria-label={`View ${product.name}`}
                                                >
                                                    <Eye size={20} />
                                                </Link> */}
                                            </div>
                                        </div>

                                        <div className="ProductDesc">
                                            <Link
                                                to={`/product/${product.id}`}
                                            >
                                                <h3>{product.name}</h3>
                                            </Link>
                                            <div className="ratings">
                                                <span className="ratingStars">
                                                    {"★".repeat(
                                                        Math.max(
                                                            0,
                                                            Math.min(5, Math.round(Number(product.rating)))
                                                        )
                                                    )}
                                                    {"☆".repeat(
                                                        5 -
                                                        Math.max(
                                                            0,
                                                            Math.min(5, Math.round(Number(product.rating)))
                                                        )
                                                    )}
                                                </span>

                                                <span>
                                                    {Number(product.rating).toFixed(1)}/5
                                                </span>
                                            </div>

                                            <div className="pricing">
                                                <b className="currentPrice">
                                                    Rs.{" "}
                                                    {formatPrice(
                                                        currentPrice
                                                    )}
                                                </b>

                                                {hasDiscount && (
                                                    <>
                                                        <del className="realPrice">
                                                            Rs.{" "}
                                                            {formatPrice(
                                                                price
                                                            )}
                                                        </del>

                                                        <div className="discount">
                                                            -{discount}%
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* PAGINATION */}
                    {!loading &&
                        !error &&
                        selectedCategory &&
                        totalPages > 1 && (
                            <>
                                <div className="CategoryProducts_F_Border" />

                                <div className="CategoryP_F">
                                    <button
                                        type="button"
                                        className="CategoryP_F_Btns"
                                        disabled={safeCurrentPage === 1}
                                        onClick={() =>
                                            changePage(
                                                safeCurrentPage - 1
                                            )
                                        }
                                    >
                                        <img
                                            src={
                                                data.pagination.previousIcon
                                            }
                                            alt=""
                                        />

                                        <p>
                                            {data.pagination.previous}
                                        </p>
                                    </button>

                                    <div className="CategoryP_Nums">
                                        {Array.from(
                                            { length: totalPages },
                                            (_, index) => index + 1
                                        ).map((page) => (
                                            <button
                                                type="button"
                                                key={page}
                                                className={`CategoryP_Number ${safeCurrentPage === page
                                                    ? "active"
                                                    : ""
                                                    }`}
                                                onClick={() =>
                                                    changePage(page)
                                                }
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        className="CategoryP_F_Btns"
                                        disabled={
                                            safeCurrentPage === totalPages
                                        }
                                        onClick={() =>
                                            changePage(
                                                safeCurrentPage + 1
                                            )
                                        }
                                    >
                                        <p>
                                            {data.pagination.next}
                                        </p>

                                        <img
                                            src={data.pagination.nextIcon}
                                            alt=""
                                        />
                                    </button>
                                </div>
                            </>
                        )}
                </section>
            </div>

            {/* MOBILE FILTER SIDEBAR */}
            {mobileFilterOpen && (
                <>
                    <div
                        className="CategoryFilterOverlay"
                        onClick={() =>
                            setMobileFilterOpen(false)
                        }
                    />

                    <aside className="filterMenu filterMenuOpen">
                        <div className="CategoryMobileFilterHeading">
                            <h2>{data.filters.heading}</h2>

                            <button
                                type="button"
                                className="cross"
                                onClick={() =>
                                    setMobileFilterOpen(false)
                                }
                            >
                                <img
                                    src={data.filters.close}
                                    alt="Close filters"
                                />
                            </button>
                        </div>

                        {renderFilters()}
                    </aside>
                </>
            )}

            <ProductQuickView
                product={quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
            />
        </div>
    );
};

// A new navbar navigation creates a fresh page instance, even when
// the destination category ID is unchanged. This clears draft/applied
// filters, sorting, and pagination without changing existing UI.
const CategoryPage = () => {
    const location = useLocation();
    const { id, categoryId } = useParams<{
        id?: string;
        categoryId?: string;
    }>();

    return (
        <CategoryPageContent key={`${location.key}-${id ?? categoryId ?? ""}`} />
    );
};

export default CategoryPage;