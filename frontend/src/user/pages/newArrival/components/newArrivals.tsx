import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNewArrivals } from "../../../../services/productApi";
import "../../../../style.css";

interface NewArrivalProduct {
    id: number;
    name: string;
    description?: string;
    price: number | string;
    discount_price?: number | string | null;
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
    created_at?: string;
}

const BACKEND_URL = "http://127.0.0.1:8000";
const PRODUCTS_PER_PAGE = 8;

function getProductImage(product: NewArrivalProduct): string {
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

function getDiscount(product: NewArrivalProduct) {
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

    const sellingPrice = hasDiscount
        ? discountPrice
        : originalPrice;

    const discountPercentage = hasDiscount
        ? Math.round(
            ((originalPrice - discountPrice) / originalPrice) * 100
        )
        : 0;

    return {
        originalPrice,
        sellingPrice,
        hasDiscount,
        discountPercentage,
    };
}

function getRandomRating(productId: number): number {
    // Har product ID ke liye stable rating: 3.0 se 5.0
    const seed = Math.abs(
        Math.sin(productId * 12.9898) * 43758.5453
    );

    return Number((3 + (seed % 1) * 2).toFixed(1));
}

const NewArrivals = () => {
    const [products, setProducts] = useState<NewArrivalProduct[]>([]);
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getNewArrivals();

                const allProducts: NewArrivalProduct[] = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.results)
                        ? response.results
                        : Array.isArray(response?.data)
                            ? response.data
                            : [];

                // Latest products first.
                // Agar created_at available nahi hai,
                // backend API ki existing ordering preserve hogi.
                const latestProducts = [...allProducts];

                if (
                    latestProducts.length > 0 &&
                    latestProducts.every(
                        (product) =>
                            product.created_at &&
                            Number.isFinite(
                                Date.parse(product.created_at)
                            )
                    )
                ) {
                    latestProducts.sort(
                        (a, b) =>
                            Date.parse(b.created_at!) -
                            Date.parse(a.created_at!)
                    );
                }

                if (active) {
                    setProducts(latestProducts);
                    setVisibleCount(PRODUCTS_PER_PAGE);
                }
            } catch (err) {
                console.error("Failed to load new arrivals:", err);

                if (active) {
                    setError(
                        "New arrival products load nahi ho sake. Please try again."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadProducts();

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
        <main className="onSalePage newArrivalsPage">
            {/* HERO SECTION */}

            <section className="newArrivalsHero">
                <div className="newArrivalsHeroContent">
                    <span className="newArrivalsHeroTag">
                        FRESH DROPS • 2026
                    </span>

                    <h1>The New Addition<span>.</span></h1>

                    <p>
                        Fresh styles. New favourites.
                        <br />
                        Discover what's just arrived.
                    </p>

                    <a href="#newArrivalsCollection" className="newArrivalsHeroButton">
                        EXPLORE NEW ARRIVALS
                    </a>
                </div>
            </section>

            {/* PRODUCTS SECTION */}

            <section className="onSaleContent" id="newArrivalsCollection">
                <div className="onSaleHeading">
                    <div>
                        <h2>Latest Collection</h2>

                        <p>
                            {loading
                                ? "Finding our newest products..."
                                : `${products.length} ${products.length === 1
                                    ? "product"
                                    : "products"
                                } available`}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="onSaleMessage">
                        Loading new arrivals...
                    </div>
                ) : error ? (
                    <div className="onSaleMessage onSaleError">
                        {error}
                    </div>
                ) : products.length === 0 ? (
                    <div className="onSaleMessage">
                        <h3>No new arrivals right now</h3>

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
                                const hasHalfStar = rating - fullStars >= 0.5;
                                const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
                                return (
                                    <div
                                        key={product.id}
                                        className="onSaleCard"
                                    >
                                        {/* PRODUCT IMAGE */}

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

                                            {/* NEW BADGE */}

                                            <span className="newArrivalsBadge">
                                                NEW
                                            </span>

                                            {/* DISCOUNT BADGE */}

                                            {hasDiscount && (
                                                <span className="newArrivalsDiscountBadge">
                                                    -{discountPercentage}%
                                                </span>
                                            )}
                                        </div>

                                        {/* PRODUCT DETAILS */}

                                        <div className="onSaleProductInfo">
                                            <h3>{product.name}</h3>

                                            <div className="onSalePrices">
                                                <strong>
                                                    {formatPrice(sellingPrice)}
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

                                                <span>{rating.toFixed(1)}/5</span>
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

                        {/* VIEW MORE */}

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
    );
};

export default NewArrivals;