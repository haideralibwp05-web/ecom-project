
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getCategories,
    type Category,
} from "../../../services/categoryApi";
import { getProducts } from "../../../services/productApi";
import "../../../style.css";
import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";
interface MenProduct {
    id: number;
    name: string;
    price: number | string;
    discount_price?: number | string | null;
    category: number;
    images?: Array<
        | string
        | {
            image?: string;
            image_url?: string;
            url?: string;
        }
    >;
    image?: string;
    stock?: number;
}

const BACKEND_URL = "http://127.0.0.1:8000";
const PRODUCTS_PER_PAGE = 8;

function getProductImage(product: MenProduct): string {
    const firstImage = product.images?.[0];

    let image = "";

    if (typeof firstImage === "string") {
        image = firstImage;
    } else if (firstImage) {
        image =
            firstImage.image_url ||
            firstImage.image ||
            firstImage.url ||
            "";
    }

    image = image || product.image || "";

    if (!image) return "";

    if (/^https?:\/\//i.test(image)) return image;

    return `${BACKEND_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

function formatPrice(price: number | string): string {
    return `Rs. ${Number(price).toLocaleString("en-PK", {
        maximumFractionDigits: 2,
    })}`;
}

function getDiscount(product: MenProduct) {
    const originalPrice = Number(product.price);
    const discountPrice = Number(product.discount_price);

    const hasDiscount =
        product.discount_price !== null &&
        product.discount_price !== undefined &&
        product.discount_price !== "" &&
        Number.isFinite(originalPrice) &&
        Number.isFinite(discountPrice) &&
        originalPrice > 0 &&
        discountPrice > 0 &&
        discountPrice < originalPrice;

    return {
        originalPrice,
        sellingPrice: hasDiscount ? discountPrice : originalPrice,
        hasDiscount,
        discountPercentage: hasDiscount
            ? Math.round(
                ((originalPrice - discountPrice) / originalPrice) * 100
            )
            : 0,
    };
}

function getRandomRating(productId: number): number {
    const seed = Math.abs(
        Math.sin(productId * 12.9898) * 43758.5453
    );

    return Number((3 + (seed % 1) * 2).toFixed(1));
}

const Men = () => {
    const [products, setProducts] = useState<MenProduct[]>([]);
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadMenProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const [categoriesResponse, productsResponse] =
                    await Promise.all([
                        getCategories(),
                        getProducts(),
                    ]);

                const categories: Category[] = categoriesResponse;

                const allProducts: MenProduct[] = Array.isArray(
                    productsResponse
                )
                    ? productsResponse
                    : Array.isArray(productsResponse?.results)
                        ? productsResponse.results
                        : Array.isArray(productsResponse?.data)
                            ? productsResponse.data
                            : [];

                // Find the main Men category.
                const menCategory = categories.find(
                    (category) =>
                        category.name.trim().toLowerCase() === "men" &&
                        category.parent === null
                );

                if (!menCategory) {
                    if (active) {
                        setProducts([]);
                    }
                    return;
                }

                // Include Men and all nested subcategories.
                const categoryIds = new Set<number>([
                    menCategory.id,
                ]);

                let changed = true;

                while (changed) {
                    changed = false;

                    for (const category of categories) {
                        if (
                            category.parent !== null &&
                            categoryIds.has(category.parent) &&
                            !categoryIds.has(category.id)
                        ) {
                            categoryIds.add(category.id);
                            changed = true;
                        }
                    }
                }

                const menProducts = allProducts.filter(
                    (product) =>
                        categoryIds.has(Number(product.category))
                );

                if (active) {
                    setProducts(menProducts);
                    setVisibleCount(PRODUCTS_PER_PAGE);
                }
            } catch (err) {
                console.error("Failed to load Men products:", err);

                if (active) {
                    setError(
                        "Men products load nahi ho sake. Please try again."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadMenProducts();

        return () => {
            active = false;
        };
    }, []);

    const visibleProducts = products.slice(0, visibleCount);
    const hasMoreProducts = visibleCount < products.length;

    const handleViewMore = () => {
        setVisibleCount((previous) =>
            Math.min(previous + PRODUCTS_PER_PAGE, products.length)
        );
    };

    return (
        <><Navbar />
            <main className="onSalePage newArrivalsPage menPage">
                {/* HERO SECTION */}

                <section className="newArrivalsHero">
                    <div className="newArrivalsHeroContent">
                        <span className="newArrivalsHeroTag">
                            MEN'S COLLECTION • 2026
                        </span>

                        <h1>
                            Made For Men<span>.</span>
                        </h1>

                        <p>
                            Discover your everyday essentials.
                            <br />
                            Modern styles. Timeless confidence.
                        </p>

                        <a
                            href="#menCollection"
                            className="newArrivalsHeroButton"
                        >
                            EXPLORE MEN'S COLLECTION
                        </a>
                    </div>
                </section>

                {/* PRODUCTS SECTION */}

                <section
                    className="onSaleContent"
                    id="menCollection"
                >
                    <div className="onSaleHeading">
                        <div>
                            <h2>Men's Collection</h2>

                            <p>
                                {loading
                                    ? "Finding men's products..."
                                    : `${products.length} ${products.length === 1
                                        ? "product"
                                        : "products"
                                    } available`}
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="onSaleMessage">
                            Loading men's collection...
                        </div>
                    ) : error ? (
                        <div className="onSaleMessage onSaleError">
                            {error}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="onSaleMessage">
                            <h3>No men's products available</h3>

                            <p>
                                Please check back later for new products.
                            </p>

                            <Link
                                to="/"
                                className="onSaleBackButton"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="onSaleGrid">
                                {visibleProducts.map((product) => {
                                    const {
                                        originalPrice,
                                        sellingPrice,
                                        hasDiscount,
                                        discountPercentage,
                                    } = getDiscount(product);

                                    const imageUrl = getProductImage(product);
                                    const rating = getRandomRating(product.id);
                                    const fullStars = Math.floor(rating);
                                    const hasHalfStar =
                                        rating - fullStars >= 0.5;
                                    const emptyStars =
                                        5 -
                                        fullStars -
                                        (hasHalfStar ? 1 : 0);

                                    return (
                                        <div
                                            key={product.id}
                                            className="onSaleCard"
                                        >
                                            <div className="onSaleImageWrapper">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        className="onSaleProductImage"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="onSaleNoImage">
                                                        No image available
                                                    </div>
                                                )}

                                                {hasDiscount && (
                                                    <span className="newArrivalsDiscountBadge">
                                                        -{discountPercentage}%
                                                    </span>
                                                )}
                                            </div>

                                            <div className="onSaleProductInfo">
                                                <h3>{product.name}</h3>

                                                <div className="onSalePrices">
                                                    <strong>
                                                        {formatPrice(
                                                            sellingPrice
                                                        )}
                                                    </strong>

                                                    {hasDiscount && (
                                                        <span>
                                                            {formatPrice(
                                                                originalPrice
                                                            )}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="ratings">
                                                    <span className="ratingStars">
                                                        {"★".repeat(fullStars)}
                                                        {hasHalfStar ? "⯨" : ""}
                                                        {"☆".repeat(emptyStars)}
                                                    </span>

                                                    <span>
                                                        {rating.toFixed(1)}/5
                                                    </span>
                                                </div>

                                                <Link
                                                    to={`/product/${product.id}`}
                                                    className="onSaleViewProduct"
                                                    aria-label={`View ${product.name}`}
                                                >
                                                    View Product
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {hasMoreProducts && (
                                <div className="onSaleViewMoreWrapper">
                                    <button
                                        type="button"
                                        className="onSaleViewMoreButton"
                                        onClick={handleViewMore}
                                    >
                                        View More
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Men;
