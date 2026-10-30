import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { getProducts } from "../../../../services/productApi";
import { useCart } from "../../Cart/components/CartContext";

interface ProductImage {
    id: number;
    image: string;
}

interface Product {
    id: number;
    name: string;
    price: number | string;
    discount_price?: number | string | null;
    category: number | string;
    images?: ProductImage[];
    rating?: number;
    sizes?: string[];
    stock?: number;
    color_name?: string;
    color_hex?: string;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const getImageUrl = (image?: string) => {
    if (!image) return "";

    if (image.startsWith("http")) {
        return image;
    }

    return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

const formatPrice = (price: number) => {
    return price.toLocaleString("en-PK");
};

const SuggestProduct = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();

    const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cartMessage, setCartMessage] = useState("");

    useEffect(() => {
        const fetchSuggestedProducts = async () => {
            try {
                setLoading(true);

                const response = await getProducts();

                const products: Product[] = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.results)
                        ? response.results
                        : Array.isArray(response?.data)
                            ? response.data
                            : [];

                const currentProduct = products.find(
                    (item) => String(item.id) === String(id)
                );

                if (!currentProduct) {
                    setSuggestedProducts([]);
                    return;
                }

                // Current product ko exclude karo
                const otherProducts = products.filter(
                    (item) => item.id !== currentProduct.id
                );

                // Same subcategory products
                const sameCategoryProducts = otherProducts.filter(
                    (item) =>
                        String(item.category) ===
                        String(currentProduct.category)
                );

                let finalProducts: Product[] = [];

                if (sameCategoryProducts.length > 0) {
                    finalProducts = sameCategoryProducts.slice(0, 4);
                } else {
                    // Agar same category mein products nahi hain
                    // to random products show karo
                    const shuffledProducts = [...otherProducts].sort(
                        () => Math.random() - 0.5
                    );

                    finalProducts = shuffledProducts.slice(0, 4);
                }

                setSuggestedProducts(finalProducts);
            } catch (error) {
                console.error("Suggested products error:", error);
                setSuggestedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSuggestedProducts();
        }
    }, [id]);

    useEffect(() => {
        if (!cartMessage) return;

        const timer = window.setTimeout(() => {
            setCartMessage("");
        }, 3000);

        return () => window.clearTimeout(timer);
    }, [cartMessage]);

    const handleAddToCart = (item: Product) => {
        const stock = Number(item.stock ?? 0);

        if (stock <= 0) {
            setCartMessage("This product is out of stock.");
            return;
        }

        const price = Number(item.price);
        const discountPrice = Number(item.discount_price);

        const hasDiscount =
            discountPrice > 0 && discountPrice < price;

        const displayPrice = hasDiscount ? discountPrice : price;

        addToCart({
            productId: item.id,
            name: item.name,
            image: getImageUrl(item.images?.[0]?.image),
            price: displayPrice,
            originalPrice: price,
            size: item.sizes?.[0] || "One Size",
            color: item.color_name || "Not specified",
            colorHex: item.color_hex || "",
            quantity: 1,
            stock,
        });

        setCartMessage(`${item.name} added to cart successfully!`);
    };

    if (loading) {
        return (
            <section className="suggestProducts">
                <h2 className="ProductSectionHeading">
                    You Might Also Like
                </h2>
                <p>Loading products...</p>
            </section>
        );
    }

    if (suggestedProducts.length === 0) {
        return null;
    }

    return (
        <section className="suggestProducts">
            <h2 className="ProductSectionHeading">
                You Might Also Like
            </h2>

            {cartMessage && (
                <div
                    className="cartToast"
                    role="status"
                    aria-live="polite"
                >
                    <span className="cartToastIcon">✓</span>

                    <div className="cartToastContent">
                        <strong>Cart Notification</strong>
                        <p>{cartMessage}</p>
                    </div>

                    <button
                        type="button"
                        className="cartToastClose"
                        onClick={() => setCartMessage("")}
                        aria-label="Close notification"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="products suggestProductsGrid">
                {suggestedProducts.map((item) => {
                    const imageUrl = getImageUrl(
                        item.images?.[0]?.image
                    );

                    const secondImageUrl = getImageUrl(
                        item.images?.[1]?.image
                    );

                    const price = Number(item.price);
                    const discountPrice = Number(item.discount_price);

                    const hasDiscount =
                        discountPrice > 0 &&
                        discountPrice < price;

                    const discountPercentage = hasDiscount
                        ? Math.round(
                              ((price - discountPrice) / price) * 100
                          )
                        : 0;

                    const rating = Math.max(
                        0,
                        Math.min(
                            5,
                            Math.round(Number(item.rating || 0))
                        )
                    );

                    return (
                        <div
                            className="product"
                            key={item.id}
                        >
                            {/* PRODUCT IMAGE + HOVER ACTIONS */}

                            <div className="productImageWrapper">
                                <Link
                                    to={`/product/${item.id}`}
                                    className="productImageLink"
                                >
                                    {imageUrl ? (
                                        <>
                                            <img
                                                className="productImg productPrimaryImg"
                                                src={imageUrl}
                                                alt={item.name}
                                                onError={() => {
                                                    console.error(
                                                        "Image load failed:",
                                                        imageUrl
                                                    );
                                                }}
                                            />

                                            {secondImageUrl && (
                                                <img
                                                    className="productImg productSecondaryImg"
                                                    src={secondImageUrl}
                                                    alt={`${item.name} - alternate view`}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <div className="CategoryNoImage">
                                            No Image
                                        </div>
                                    )}
                                </Link>

                                <div className="productHoverActions">
                                    <button
                                        type="button"
                                        className="productAddToCartBtn"
                                        disabled={Number(item.stock ?? 0) <= 0}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            handleAddToCart(item);
                                        }}
                                    >
                                        <ShoppingCart size={18} />
                                        <span>
                                            {Number(item.stock ?? 0) <= 0
                                                ? "Out of Stock"
                                                : "Add to Cart"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* PRODUCT DETAILS */}

                            <div className="ProductDesc">
                                <Link
                                    to={`/product/${item.id}`}
                                    className="productTitleLink"
                                >
                                    <h3>{item.name}</h3>
                                </Link>

                                {/* RATING */}

                                <div className="ratings">
                                    <span className="ratingStars">
                                        {"★".repeat(rating)}
                                        {"☆".repeat(5 - rating)}
                                    </span>

                                    <span>
                                        {Number(
                                            item.rating || 0
                                        ).toFixed(1)}
                                        /5
                                    </span>
                                </div>

                                {/* PRICE + DISCOUNT */}

                                <div className="pricing">
                                    <p className="currentPrice">
                                        Rs.{" "}
                                        {formatPrice(
                                            hasDiscount
                                                ? discountPrice
                                                : price
                                        )}
                                    </p>

                                    {hasDiscount && (
                                        <>
                                            <del className="realPrice">
                                                Rs.{" "}
                                                {formatPrice(price)}
                                            </del>

                                            <span className="discount">
                                                -{discountPercentage}%
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default SuggestProduct;