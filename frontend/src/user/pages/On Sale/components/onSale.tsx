import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../../../services/productApi";
import "../../../../style.css";

interface SaleProduct {
    id: number;
    name: string;
    description?: string;
    price: number | string;
    discount_price: number | string | null;
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

function getProductImage(product: SaleProduct): string {
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
function getRandomRating(productId: number): number {
    const seed = Math.abs(
        Math.sin(productId * 12.9898) * 43758.5453
    );

    return Number((3 + (seed % 1) * 2).toFixed(1));
}
function isOnSale(product: SaleProduct): boolean {
    const originalPrice = Number(product.price);
    const salePrice = Number(product.discount_price);

    return (
        product.discount_price !== null &&
        product.discount_price !== "" &&
        Number.isFinite(originalPrice) &&
        Number.isFinite(salePrice) &&
        originalPrice > 0 &&
        salePrice > 0 &&
        salePrice < originalPrice
    );
}

function formatPrice(price: number | string): string {
    return `Rs. ${Number(price).toLocaleString("en-PK", {
        maximumFractionDigits: 2,
    })}`;
}

const OnSale = () => {
    const [products, setProducts] = useState<SaleProduct[]>([]);
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getProducts();

                const allProducts: SaleProduct[] = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.results)
                        ? response.results
                        : [];

                const saleProducts = allProducts
                    .filter(isOnSale)
                    .sort((a, b) => {
                        const discountA =
                            Number(a.price) - Number(a.discount_price);
                        const discountB =
                            Number(b.price) - Number(b.discount_price);

                        return discountB - discountA;
                    });

                if (active) {
                    setProducts(saleProducts);
                    setVisibleCount(PRODUCTS_PER_PAGE);
                }
            } catch (err) {
                console.error("Failed to load sale products:", err);

                if (active) {
                    setError(
                        "Sale products load nahi ho sake. Please try again."
                    );
                }
            } finally {
                if (active) setLoading(false);
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
        <main className="onSalePage">
            <section className="onSaleHero">
                <p className="onSaleEyebrow">SPECIAL OFFERS</p>
                <h1>On Sale</h1>
                <p>
                    Shop your favourite products at discounted prices.
                </p>
            </section>

            <section className="onSaleContent">
                <div className="onSaleHeading">
                    <div>
                        <h2>Sale Collection</h2>
                        <p>
                            {loading
                                ? "Finding the best deals..."
                                : `${products.length} discounted ${products.length === 1
                                    ? "product"
                                    : "products"
                                }`}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="onSaleMessage">
                        Loading sale products...
                    </div>
                ) : error ? (
                    <div className="onSaleMessage onSaleError">
                        {error}
                    </div>
                ) : products.length === 0 ? (
                    <div className="onSaleMessage">
                        <h3>No sale products right now</h3>
                        <p>Please check back later for new offers.</p>
                        <Link to="/" className="onSaleBackButton">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="onSaleGrid">
                            {visibleProducts.map((product) => {
                                const originalPrice = Number(product.price);
                                const salePrice = Number(
                                    product.discount_price
                                );

                                const discount = Math.round(
                                    ((originalPrice - salePrice) /
                                        originalPrice) *
                                    100
                                );

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

                                            <span className="onSaleBadge">
                                                -{discount}%
                                            </span>
                                        </div>

                                        <div className="onSaleProductInfo">
                                            <h3>{product.name}</h3>

                                            <div className="onSalePrices">
                                                <strong>
                                                    {formatPrice(salePrice)}
                                                </strong>
                                                <span>
                                                    {formatPrice(originalPrice)}
                                                </span>
                                            </div>

                                            <p className="onSaleSaveText">
                                                You save{" "}
                                                {formatPrice(
                                                    originalPrice - salePrice
                                                )}
                                            </p>
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

export default OnSale;