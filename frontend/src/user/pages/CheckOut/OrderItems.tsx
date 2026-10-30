import type { CartItem } from "../../pages/Cart/components/CartContext";

interface OrderItemsProps {
    items: Pick<
        CartItem,
        "productId" | "name" | "image" | "quantity" | "size" | "color" | "price"
    >[];
}

const OrderItems = ({ items }: OrderItemsProps) => {
    if (items.length === 0) return null;

    return (
        <section className="checkoutOrderItems">
            <h2>Order Items</h2>

            <div className="checkoutOrderItemsList">
                {items.map((item, index) => (
                    <div
                        className="checkoutOrderItem"
                        key={`${item.productId}-${index}`}
                    >
                        <div className="checkoutOrderItemImage">
                            <img src={item.image} alt={item.name} />
                        </div>

                        <div className="checkoutOrderItemDetails">
                            <h3>{item.name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <p>Size: {item.size}</p>
                            <p>Color: {item.color}</p>

                        </div>
                        <p style={{fontWeight:"700"}}>
                            Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                        </p>
                        <div className="DifferenceBorder" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OrderItems;