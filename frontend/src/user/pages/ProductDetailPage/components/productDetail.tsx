import Ratings from "../components/rating";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../../../../services/productApi";
import { useCart } from "../../Cart/components/CartContext";

interface ProductImage {
    id: number;
    image: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    discount_price?: number | string | null;
    color_name?: string;
    color_hex?: string;
    sizes?: string[];
    stock?: number;
    images?: ProductImage[];
    rating?: number;
    reviews_count?: number;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const getImageUrl = (image?: string) => {
    if (!image) return "";

    if (image.startsWith("http")) {
        return image;
    }

    return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // success message
    const [cartMessage, setCartMessage] = useState("");
    useEffect(() => {
        if (!cartMessage) return;

        const timer = window.setTimeout(() => {
            setCartMessage("");
        }, 3000);

        return () => window.clearTimeout(timer);
    }, [cartMessage]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getProducts();

                const products: Product[] = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.results)
                        ? response.results
                        : Array.isArray(response?.data)
                            ? response.data
                            : [];

                const foundProduct = products.find(
                    (item) => String(item.id) === String(id)
                );

                if (!foundProduct) {
                    setProduct(null);
                    setError("Product not found.");
                    return;
                }

                setProduct(foundProduct);

                const firstImage = foundProduct.images?.[0]?.image;
                setSelectedImage(firstImage ? getImageUrl(firstImage) : "");

                setSelectedSize(foundProduct.sizes?.[0] ?? "");
                setQuantity(1);
            } catch (err) {
                console.error("Product loading error:", err);
                setError("Product load nahi ho saka. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return <div className="productDetailsMessage">Loading product...</div>;
    }

    if (error || !product) {
        return (
            <div className="productDetailsMessage">
                {error || "Product not found."}
            </div>
        );
    }
    const descriptionParts = (product.description || "")
        .trim()
        .split(/\r?\n\s*\r?\n/);

    const shortDescription = descriptionParts[0] || "";

    const remainingDescription = descriptionParts
        .slice(1)
        .join("\n\n");

    const price = Number(product.price);
    const discountPrice = Number(product.discount_price);

    const hasDiscount =
        discountPrice > 0 && discountPrice < price;

    const displayPrice = hasDiscount ? discountPrice : price;

    const productImages = product.images ?? [];

    const handleAddToCart = () => {
        if (!product) return;

        if (product.sizes?.length && !selectedSize) {
            alert("Please select a size.");
            return;
        }

        const stock = Number(product.stock ?? 0);

        if (stock <= 0) {
            alert("Product is out of stock.");
            return;
        }

        if (quantity > stock) {
            alert(`Only ${stock} items are available.`);
            return;
        }

        addToCart({
            productId: product.id,
            name: product.name,
            image: getImageUrl(product.images?.[0]?.image),
            price: displayPrice,
            originalPrice: price,
            size: selectedSize || "One Size",
            color: product.color_name || "Not specified",
            colorHex: product.color_hex || "",
            quantity,
            stock,
        });

        setCartMessage(`${product.name} added to cart successfully!`);
    };

    return (
        <>
            {cartMessage && (
                <div className="cartToast" role="status" aria-live="polite">
                    <span className="cartToastIcon">✓</span>

                    <div className="cartToastContent">
                        <strong>Added to Cart!</strong>
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
            <section className="ProductSection">

                {/* Column 1: Product ki tamam images */}
                <div className="ProductThumbnails">
                    {productImages.map((item, index) => {
                        const imageUrl = getImageUrl(item.image);

                        return (
                            <button
                                type="button"
                                className={`Row_1Images ${selectedImage === imageUrl
                                    ? "activeThumbnail"
                                    : ""
                                    }`}
                                key={item.id ?? index}
                                onClick={() => setSelectedImage(imageUrl)}
                                aria-label={`Show product image ${index + 1}`}
                            >
                                <img
                                    className="Row_1Image"
                                    src={imageUrl}
                                    alt={`${product.name} view ${index + 1}`}
                                />
                            </button>
                        );
                    })}
                </div>

                {/* Column 2: Selected product image */}
                <div className="ProductMainImage">
                    {selectedImage ? (
                        <img
                            src={selectedImage}
                            alt={product.name}
                        />
                    ) : (
                        <div className="productDetailsNoImage">
                            No image available
                        </div>
                    )}
                </div>

                {/* Column 3: Dynamic product details */}
                <div className="productDetails">

                    <h2>{product.name}</h2>

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

                    <div className="productPricing">
                        <p className="currentPrice">
                            Rs. {displayPrice.toLocaleString("en-PK")}
                        </p>

                        {hasDiscount && (
                            <>
                                <del className="realPrice">
                                    Rs. {price.toLocaleString("en-PK")}
                                </del>

                                <span className="discount">
                                    -{Math.round(
                                        ((price - discountPrice) / price) * 100
                                    )}%
                                </span>
                            </>
                        )}
                    </div>

                    <p className="productDesc">
                        {shortDescription || "No description available."}
                    </p>

                    <div className="DifferenceBorder" />

                    {/* Product color */}
                    <p className="productDetailLabel">
                        Color: {product.color_name || "Not specified"}
                    </p>

                    {product.color_hex && (
                        <div className="ColorCircles">
                            <div
                                className="ColorCircle selectedColorCircle"
                                style={{
                                    backgroundColor: product.color_hex,
                                }}
                                title={product.color_name || "Product color"}
                            />
                        </div>
                    )}

                    <div className="DifferenceBorder" />

                    {/* Product sizes */}
                    <p className="productDetailLabel">Choose Size</p>

                    <div className="productSizesButtons">
                        {product.sizes?.length ? (
                            product.sizes.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    className={`productSizebutton ${selectedSize === size
                                        ? "selectedProductSize"
                                        : ""
                                        }`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))
                        ) : (
                            <p>One size / No sizes specified</p>
                        )}
                    </div>

                    <div className="DifferenceBorder" />

                    {/* Quantity and Add to Cart */}
                    <div className="ProductActions">

                        <div className="productQuantity">
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((prev) => Math.max(1, prev - 1))
                                }
                                disabled={quantity <= 1}
                            >
                                −
                            </button>

                            <input
                                type="number"
                                value={quantity}
                                min={1}
                                max={product.stock}
                                readOnly
                                aria-label="Quantity"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((prev) =>
                                        product.stock !== undefined
                                            ? Math.min(product.stock, prev + 1)
                                            : prev + 1
                                    )
                                }
                                disabled={
                                    Number(product.stock ?? 0) <= 0 ||
                                    quantity >= Number(product.stock ?? 0)
                                }
                            >
                                +
                            </button>
                        </div>

                        <button
                            className="productCart"
                            type="button"
                            disabled={product.stock === 0}
                            onClick={handleAddToCart}
                        >
                            <p className="productCartText">
                                {product.stock === 0
                                    ? "Out of Stock"
                                    : "Add to Cart"}
                            </p>
                        </button>

                    </div>

                    {product.stock !== undefined && (
                        <p className="productStockText">
                            {product.stock > 0
                                ? `${product.stock} items in stock`
                                : "Currently out of stock"}
                        </p>
                    )}
                </div>

            </section>
            <Ratings remainingDescription={remainingDescription} />
        </>
    );
};

export default ProductDetails;
