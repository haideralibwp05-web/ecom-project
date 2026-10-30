import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "../../pages/Cart/components/CartContext";
import type { Product } from "../../types/categoryPage";
import "../../../style.css";

interface ProductQuickViewProps {
    product: Product | null;
    onClose: () => void;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const getImageUrl = (image?: string | null) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;

    return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

const ProductQuickView = ({
    product,
    onClose,
}: ProductQuickViewProps) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [imageIndex, setImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!product) return;

        setImageIndex(0);
        setSelectedSize(product.sizes?.[0] ?? "");
        setQuantity(1);
        setMessage("");
    }, [product]);

    useEffect(() => {
        if (!product) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [product, onClose]);

    if (!product) return null;

    const images = product.images ?? [];
    const price = Number(product.price) || 0;
    const discountPrice = Number(product.discount_price) || 0;
    const hasDiscount =
        discountPrice > 0 && discountPrice < price;
    const displayPrice = hasDiscount ? discountPrice : price;
    const stock = Math.max(0, Number(product.stock) || 0);
    const rating = Math.max(
        0,
        Math.min(5, Math.round(Number(product.rating) || 0))
    );
    const shortDescription =
        (product.description || "").trim().split(/\r?\n\s*\r?\n/)[0] ||
        "No description available.";

    const selectedImage = getImageUrl(images[imageIndex]?.image);

    const validateSelection = () => {
        if (product.sizes?.length && !selectedSize) {
            setMessage("Please select a size.");
            return false;
        }

        if (stock <= 0) {
            setMessage("This product is out of stock.");
            return false;
        }

        if (quantity > stock) {
            setMessage(`Only ${stock} items are available.`);
            return false;
        }

        setMessage("");
        return true;
    };

    const getCartItem = () => ({
        productId: product.id,
        name: product.name,
        image: getImageUrl(images[0]?.image),
        price: displayPrice,
        originalPrice: price,
        size: selectedSize || "One Size",
        color: product.color_name || "Not specified",
        colorHex: product.color_hex || "",
        quantity,
        stock,
    });

    const handleAddToCart = () => {
        if (!validateSelection()) return;

        addToCart(getCartItem());
        onClose();
    };

    const handleBuyNow = () => {
        if (!validateSelection()) return;

        const buyNowItem = getCartItem();
        onClose();

        navigate("/checkout", {
            state: { buyNowItem },
        });
    };

    return (
        <div
            className="quickViewOverlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                className="quickViewModal"
                role="dialog"
                aria-modal="true"
                aria-label={`Quick view: ${product.name}`}
            >
                <div className="quickViewImageSection">


                    {selectedImage ? (
                        <img
                            className="quickViewMainImage"
                            src={selectedImage}
                            alt={product.name}
                        />
                    ) : (
                        <div className="quickViewNoImage">
                            No image available
                        </div>
                    )}

                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                className="quickViewArrow quickViewPrev"
                                onClick={() =>
                                    setImageIndex((current) =>
                                        (current - 1 + images.length) %
                                        images.length
                                    )
                                }
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <button
                                type="button"
                                className="quickViewArrow quickViewNext"
                                onClick={() =>
                                    setImageIndex((current) =>
                                        (current + 1) % images.length
                                    )
                                }
                                aria-label="Next image"
                            >
                                <ChevronRight size={24} />
                            </button>

                            <div className="quickViewImageCount">
                                {imageIndex + 1} / {images.length}
                            </div>
                        </>
                    )}
                </div>

                <div className="quickViewDetails">
                    <button
                        type="button"
                        className="quickViewClose"
                        onClick={onClose}
                        aria-label="Close quick view"
                    >
                        <X size={22} />
                    </button>
                    <h2>{product.name}</h2>

                    <div className="quickViewRating">
                        <span aria-label={`${rating} out of 5 stars`}>
                            {"★".repeat(rating)}
                            {"☆".repeat(5 - rating)}
                        </span>
                        <span>{Number(product.rating || 0).toFixed(1)}/5</span>
                    </div>

                    <div className="quickViewPrices">
                        <strong>
                            Rs. {displayPrice.toLocaleString("en-PK")}
                        </strong>

                        {hasDiscount && (
                            <>
                                <del>
                                    Rs. {price.toLocaleString("en-PK")}
                                </del>
                                <span>
                                    -{Math.round(
                                        ((price - discountPrice) / price) * 100
                                    )}%
                                </span>
                            </>
                        )}
                    </div>

                    <p className="quickViewDescription">
                        {shortDescription}
                    </p>

                    <div className="quickViewDivider" />

                    <div className="quickViewColor">
                        <strong>
                            Color: {product.color_name || "Not specified"}
                        </strong>

                        {product.color_hex && (
                            <span
                                className="quickViewColorCircle"
                                style={{
                                    backgroundColor: product.color_hex,
                                }}
                                title={product.color_name || "Product color"}
                            />
                        )}
                    </div>

                    <div className="quickViewDivider" />

                    <div className="quickViewSizeHeading">
                        <strong>Choose Size</strong>
                    </div>

                    <div className="quickViewSizes">
                        {product.sizes?.length ? (
                            product.sizes.map((size) => (
                                <button
                                    type="button"
                                    key={size}
                                    className={
                                        selectedSize === size
                                            ? "quickViewSize selected"
                                            : "quickViewSize"
                                    }
                                    onClick={() => {
                                        setSelectedSize(size);
                                        setMessage("");
                                    }}
                                >
                                    {size}
                                </button>
                            ))
                        ) : (
                            <span>One Size</span>
                        )}
                    </div>

                    <p className="quickViewStock">
                        {stock > 0
                            ? `${stock} items in stock`
                            : "Currently out of stock"}
                    </p>

                    <div className="quickViewBottomRow">
                        <div className="quickViewQuantity">
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((value) => Math.max(1, value - 1))
                                }
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>

                            <span>{quantity}</span>

                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((value) =>
                                        Math.min(stock, value + 1)
                                    )
                                }
                                disabled={stock <= 0 || quantity >= stock}
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>

                        <button
                            type="button"
                            className="quickViewDetailsLink"
                            onClick={() => {
                                onClose();
                                navigate(`/product/${product.id}`);
                            }}
                        >
                            View details &gt;&gt;
                        </button>
                    </div>

                    {message && (
                        <p className="quickViewMessage" role="status">
                            {message}
                        </p>
                    )}

                    <div className="quickViewActions">
                        <button
                            type="button"
                            className="quickViewAddButton"
                            onClick={handleAddToCart}
                            disabled={stock <= 0}
                        >
                            {stock <= 0 ? "Out of Stock" : "Add to Cart"}
                        </button>

                        <button
                            type="button"
                            className="quickViewBuyButton"
                            onClick={handleBuyNow}
                            disabled={stock <= 0}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductQuickView;