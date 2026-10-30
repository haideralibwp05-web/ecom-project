import { useCart } from "./CartContext";
import { Cart_SectionData } from "../../../data/cartSide";
import TrashIcon from "../../../../assets/icons/TrashIcon.svg";

const Cartsection = () => {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
    } = useCart();

    return (
        <div>
            <div className="CartPageHeader">
                <div>
                    <p>{Cart_SectionData.HeaderLinks.label_1}</p>

                    <div>
                        <img
                            src={Cart_SectionData.HeaderLinks.dropright}
                            alt=""
                        />
                    </div>
                </div>

                <p>{Cart_SectionData.HeaderLinks.label_2}</p>
            </div>

            <b className="CartPageHeading">
                {Cart_SectionData.Heading}
            </b>

            <div className="CartPage_Box">
                {cartItems.length === 0 ? (
                    <div className="cartEmptyMessage">
                        Your cart is empty.
                    </div>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.cartId}>
                            <div
                                className="cart_item"
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "16px",
                                }}
                            >
                                {/* Image */}
                                <div>
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="CartProduct_img"
                                        />
                                    ) : (
                                        <div>No image</div>
                                    )}
                                </div>

                                <div className="cart_info">
                                    {/* Title + Delete */}
                                    <div className="cart_info_space">
                                        <b className="cart_title">
                                            {item.name}
                                        </b>

                                        <div>
                                            <button
                                                type="button"
                                                className="cartDeleteButton"
                                                onClick={() =>
                                                    removeFromCart(item.cartId)
                                                }
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <img
                                                    src={TrashIcon}
                                                    alt=""
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Size + Color */}
                                    <div>
                                        <div className="item_features">
                                            <span>Size:</span>
                                            <span className="feature">
                                                {item.size}
                                            </span>
                                        </div>

                                        <div className="item_features">
                                            <span>Color:</span>
                                            <span className="feature">
                                                {item.color}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price + Quantity */}
                                    <div className="cart_info_space">
                                        <div className="cartPriceWrapper">
                                            <b className="cart_Price">
                                                Rs.{" "}
                                                {(
                                                    item.price * item.quantity
                                                ).toLocaleString("en-PK")}
                                            </b>
                                            {item.originalPrice > item.price && (
                                                <del className="realPrice">
                                                    Rs.{" "}
                                                    {(item.originalPrice * item.quantity).toLocaleString("en-PK")}
                                                </del>
                                            )}
                                        </div>
                                        <div className="Cart_Item_Quantity">
                                            <button
                                                type="button"
                                                disabled={item.quantity <= 1}
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.cartId,
                                                        item.quantity - 1
                                                    )
                                                }
                                            >
                                                −
                                            </button>

                                            <input
                                                type="number"
                                                name="quantity"
                                                value={item.quantity}
                                                readOnly
                                            />

                                            <button
                                                type="button"
                                                disabled={
                                                    item.quantity >= item.stock
                                                }
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.cartId,
                                                        item.quantity + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="DifferenceBorder" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Cartsection;