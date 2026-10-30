import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { getSessionUsername } from "../../../../services/authSession";

export interface CartItem {
    cartId: string;
    productId: number;
    name: string;
    image: string;
    price: number;
    originalPrice: number;
    size: string;
    color: string;
    colorHex: string;
    quantity: number;
    stock: number;
}

type AddToCartItem = Omit<CartItem, "cartId">;

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: AddToCartItem) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    removeFromCart: (cartId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const USER_CHANGED_EVENT = "Shop.Co-user-changed";

const getCurrentUsername = (): string => {
    return getSessionUsername("user").trim() || "guest";
};

const normalizeUsername = (username: string): string => {
    return username.trim().toLowerCase() || "guest";
};

const getStorageKey = (username: string): string => {
    return `Shop.Co-cart:${normalizeUsername(username)}`;
};

const getSavedCart = (username: string): CartItem[] => {
    try {
        const saved = localStorage.getItem(getStorageKey(username));

        if (!saved) return [];

        const parsed: unknown = JSON.parse(saved);

        if (!Array.isArray(parsed)) return [];

        return parsed.filter(
            (item): item is CartItem =>
                item !== null &&
                typeof item === "object" &&
                typeof item.cartId === "string" &&
                typeof item.productId === "number" &&
                typeof item.quantity === "number" &&
                typeof item.stock === "number"
        );
    } catch {
        return [];
    }
};

const mergeCarts = (
    savedUserCart: CartItem[],
    guestCart: CartItem[]
): CartItem[] => {
    const merged = savedUserCart.map((item) => ({ ...item }));

    for (const guestItem of guestCart) {
        const existingIndex = merged.findIndex(
            (item) => item.cartId === guestItem.cartId
        );

        if (existingIndex === -1) {
            merged.push({
                ...guestItem,
                quantity: Math.min(
                    Math.max(guestItem.quantity, 1),
                    Math.max(guestItem.stock, 1)
                ),
            });
            continue;
        }

        const existing = merged[existingIndex];

        if (!existing) continue;

        const stock = Math.min(existing.stock, guestItem.stock);

        merged[existingIndex] = {
            ...existing,
            stock,
            quantity: Math.min(
                existing.quantity + guestItem.quantity,
                stock
            ),
        };
    }

    return merged;
};

export const CartProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [cartState, setCartState] = useState(() => {
        const username = getCurrentUsername();

        return {
            username,
            cartItems: getSavedCart(username),
        };
    });

    const { username, cartItems } = cartState;

    // Save each cart under its own user's username.
    useEffect(() => {
        localStorage.setItem(
            getStorageKey(username),
            JSON.stringify(cartItems)
        );
    }, [username, cartItems]);

    // Switch to the user cart after login/profile identity changes.
    useEffect(() => {
        const handleUserChanged = () => {
            const nextUsername = getCurrentUsername();

            setCartState((current) => {
                if (
                    normalizeUsername(current.username) ===
                    normalizeUsername(nextUsername)
                ) {
                    return current;
                }

                const savedUserCart = getSavedCart(nextUsername);

                if (
                    normalizeUsername(current.username) === "guest" &&
                    normalizeUsername(nextUsername) !== "guest"
                ) {
                    const guestCart = getSavedCart("guest");

                    const mergedGuestCart = mergeCarts(
                        guestCart,
                        current.cartItems.filter(
                            (item) =>
                                !guestCart.some(
                                    (saved) => saved.cartId === item.cartId
                                )
                        )
                    );

                    const mergedCart = mergeCarts(
                        savedUserCart,
                        mergedGuestCart
                    );

                    localStorage.setItem(
                        getStorageKey(nextUsername),
                        JSON.stringify(mergedCart)
                    );

                    localStorage.removeItem(getStorageKey("guest"));

                    return {
                        username: nextUsername,
                        cartItems: mergedCart,
                    };
                }

                return {
                    username: nextUsername,
                    cartItems: savedUserCart,
                };
            });
        };

        window.addEventListener(
            USER_CHANGED_EVENT,
            handleUserChanged
        );

        return () => {
            window.removeEventListener(
                USER_CHANGED_EVENT,
                handleUserChanged
            );
        };
    }, []);

    const addToCart = (item: AddToCartItem) => {
        if (item.stock <= 0 || item.quantity <= 0) return;

        const cartId = JSON.stringify([
            item.productId,
            item.size,
            item.color,
        ]);

        setCartState((current) => {
            const existing = current.cartItems.find(
                (cartItem) => cartItem.cartId === cartId
            );

            let nextCart: CartItem[];

            if (existing) {
                nextCart = current.cartItems.map((cartItem) =>
                    cartItem.cartId === cartId
                        ? {
                              ...cartItem,
                              name: item.name,
                              image: item.image,
                              price: item.price,
                              originalPrice: item.originalPrice,
                              colorHex: item.colorHex,
                              stock: item.stock,
                              quantity: Math.min(
                                  cartItem.quantity + item.quantity,
                                  item.stock
                              ),
                          }
                        : cartItem
                );
            } else {
                nextCart = [
                    ...current.cartItems,
                    {
                        ...item,
                        cartId,
                        quantity: Math.min(
                            item.quantity,
                            item.stock
                        ),
                    },
                ];
            }

            return {
                ...current,
                cartItems: nextCart,
            };
        });
    };

    const updateQuantity = (
        cartId: string,
        quantity: number
    ) => {
        setCartState((current) => ({
            ...current,
            cartItems: current.cartItems.map((item) =>
                item.cartId === cartId
                    ? {
                          ...item,
                          quantity: Math.max(
                              1,
                              Math.min(
                                  Math.floor(quantity),
                                  item.stock
                              )
                          ),
                      }
                    : item
            ),
        }));
    };

    const removeFromCart = (cartId: string) => {
        setCartState((current) => ({
            ...current,
            cartItems: current.cartItems.filter(
                (item) => item.cartId !== cartId
            ),
        }));
    };

    const clearCart = () => {
        setCartState((current) => ({
            ...current,
            cartItems: [],
        }));
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider"
        );
    }

    return context;
};
