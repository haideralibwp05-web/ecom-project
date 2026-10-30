import "../../../style.css";
import { NavbarData } from "../../data/navbar";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "../../../services/categoryApi";
import type { Category } from "../../../services/categoryApi";
import dropDown from "../../../assets/icons/arrowDown.svg";
import { useCart } from "../../pages/Cart/components/CartContext";
import { getProducts } from "../../../services/productApi";
import UserProfilePopup from "./UserProfilePopup";
import { getAccessToken, logoutSession } from "../../../services/authSession";

interface SearchProduct {
    id: number;
    name: string;
    price: string | number;
    discount_price: string | number | null;
    category_name: string;
    images?: {
        id: number;
        image: string;
    }[];
}

const PRODUCT_IMAGE_BASE_URL = "http://127.0.0.1:8000";

const getProductImageUrl = (image?: string) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    return `${PRODUCT_IMAGE_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};
interface NavbarProps {
    className?: string;
}


const Navbar = ({ className = "" }: NavbarProps) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
    const [desktopParentOpen, setDesktopParentOpen] =
        useState<number | null>(null);
    const [mobileParentOpen, setMobileParentOpen] =
        useState<number | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<SearchProduct[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingSearchProducts, setLoadingSearchProducts] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => Boolean(getAccessToken("user"))
    );

    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await getCategories();
                setCategories(result);
            } catch (error) {
                console.error("Failed to load categories:", error);
            }
        };

        void fetchCategories();
    }, []);
    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            setLoadingSearchProducts(true);

            try {
                const result = await getProducts();

                if (isMounted) {
                    setProducts(
                        Array.isArray(result)
                            ? result
                            : Array.isArray(result?.results)
                                ? result.results
                                : []
                    );
                }
            } catch (error) {
                console.error("Failed to load search products:", error);
            } finally {
                if (isMounted) {
                    setLoadingSearchProducts(false);
                }
            }
        };

        void fetchProducts();

        return () => {
            isMounted = false;
        };
    }, []);
    useEffect(() => {
        const syncLoginState = () => {
            const loggedIn = Boolean(getAccessToken("user"));
            setIsLoggedIn(loggedIn);
            if (!loggedIn) setProfileOpen(false);
        };

        window.addEventListener("Shop.Co-user-changed", syncLoginState);
        window.addEventListener("storage", syncLoginState);

        return () => {
            window.removeEventListener("Shop.Co-user-changed", syncLoginState);
            window.removeEventListener("storage", syncLoginState);
        };
    }, []);

    const closeMenus = () => {
        setMenuOpen(false);
        setCategoriesOpen(false);
        setMobileCategoriesOpen(false);
        setMobileParentOpen(null);
        setDesktopParentOpen(null);
    };

    const handleLogout = () => {
        logoutSession("user");
        window.dispatchEvent(new Event("Shop.Co-user-changed"));
        setIsLoggedIn(false);
        setProfileOpen(false);
        closeMenus();
        navigate("/signin", { replace: true });
    };

    const handleProfileOpen = () => {
        if (!isLoggedIn) {
            navigate("/signin");
            return;
        }

        setProfileOpen((previous) => !previous);
    };

    const parentCategories = categories.filter(
        (category) => category.parent === null
    );

    const getSubcategories = (parentId: number) =>
        categories.filter((category) => category.parent === parentId);
    const filteredProducts = products
        .filter((product) => {
            const query = searchQuery.trim().toLowerCase();

            if (!query) return false;

            return (
                product.name.toLowerCase().includes(query) ||
                (product.category_name || "").toLowerCase().includes(query)
            );
        })
        .slice(0, 8);

    const getProductDisplayPrice = (product: SearchProduct) => {
        const price = Number(product.price);
        const discountPrice = Number(product.discount_price);

        return discountPrice > 0 && discountPrice < price
            ? discountPrice
            : price;
    };

    const closeProductSearch = () => {
        setSearchOpen(false);
        setSearchQuery("");
    };
    return (
        <>
            {isVisible && (
                <div className="topBar">
                    <div className="navSpacer" />

                    <p className="navUpperText">{NavbarData.label}</p>

                    <button
                        type="button"
                        className="navUppercross"
                        onClick={() => setIsVisible(false)}
                        aria-label="Close announcement"
                    >
                        <img src={NavbarData.crossIcon} alt="" />
                    </button>
                </div>
            )}

            <nav className="navbar">
                <button
                    type="button"
                    className={`hamburger ${menuOpen ? "active" : ""}`}
                    onClick={() => {
                        if (menuOpen) {
                            closeMenus();
                        } else {
                            setMenuOpen(true);
                        }
                    }}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                    aria-controls="mobileNavigation"
                >
                    <p className="mobileHamburgerIcon">
                        &#9776;
                    </p>
                </button>

                <Link to="/" aria-label="Home">
                    <img
                        className="navLogo"
                        src={NavbarData.logo}
                        alt="Logo"
                    />
                </Link>

                <ul className="navbarul">
                    {NavbarData.navlinks
                        ?.filter(
                            (item) =>
                                item.label.toLowerCase() !== "categories"
                        )
                        .map((item) => (
                            <li className="navbarli" key={item.id}>
                                <Link
                                    to={item.url || "/"}
                                    onClick={closeMenus}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}


                    <li className="navbarli navCategoryDropdown">
                        <button
                            type="button"
                            className="navCategoryTrigger"
                            onClick={() => {
                                setCategoriesOpen((previous) => !previous);
                                setDesktopParentOpen(null);
                            }}
                            aria-expanded={categoriesOpen}
                        >
                            Categories

                            <img
                                className={`navCategoryTrigger_img ${categoriesOpen ? "navArrowUp" : ""
                                    }`}
                                src={dropDown}
                                alt=""
                            />
                        </button>

                        {categoriesOpen && (
                            <div className="navCategoryMenu navCategoryAccordion">

                                {parentCategories.length === 0 ? (
                                    <p className="navCategoryEmpty">
                                        No categories available
                                    </p>
                                ) : (
                                    parentCategories.map((parent) => {
                                        const subcategories =
                                            getSubcategories(parent.id);

                                        const isOpen =
                                            desktopParentOpen === parent.id;

                                        return (
                                            <div
                                                key={parent.id}
                                                className="navAccordionParent"
                                            >
                                                <button
                                                    type="button"
                                                    className={`navAccordionParentTrigger ${isOpen ? "active" : ""
                                                        }`}
                                                    onClick={() =>
                                                        setDesktopParentOpen(
                                                            isOpen ? null : parent.id
                                                        )
                                                    }
                                                    aria-expanded={isOpen}
                                                >
                                                    <span>{parent.name}</span>

                                                    <img
                                                        src={dropDown}
                                                        alt=""
                                                        className={`navAccordionArrow ${isOpen ? "navArrowUp" : ""
                                                            }`}
                                                    />
                                                </button>

                                                {isOpen && (
                                                    <div className="navAccordionSubcategories">

                                                        <Link
                                                            to={`/category/${parent.id}`}
                                                            className="navAccordionViewAll"
                                                            onClick={closeMenus}
                                                        >
                                                            View All {parent.name}
                                                        </Link>

                                                        {subcategories.map((sub) => (
                                                            <Link
                                                                key={sub.id}
                                                                to={`/category/${sub.id}`}
                                                                className="navAccordionSubLink"
                                                                onClick={closeMenus}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        ))}

                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}

                            </div>
                        )}
                    </li>

                </ul>

                <div
                    className={`searchBox ${searchOpen ? "searchActive" : ""}`}
                >
                    <button
                        type="button"
                        className="navSearchButton"
                        onClick={() => {
                            setSearchOpen((previous) => !previous);

                            if (searchOpen) {
                                setSearchQuery("");
                            }
                        }}
                        aria-label="Toggle search"
                        aria-expanded={searchOpen}
                    >
                        <img
                            src={NavbarData.Searchinput?.searchIcon}
                            alt=""
                            className="icons"
                        />
                    </button>

                    <input
                        className="navInput"
                        type="text"
                        placeholder={NavbarData.Searchinput?.Placeholder || "Search products..."}
                        value={searchQuery}
                        onFocus={() => setSearchOpen(true)}
                        onChange={(event) => {
                            setSearchQuery(event.target.value);
                            setSearchOpen(true);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Escape") {
                                closeProductSearch();
                            }
                        }}
                        aria-label="Search products"
                        autoComplete="off"
                    />

                    {searchOpen && searchQuery.trim() !== "" && (
                        <div className="navSearchResults">
                            {loadingSearchProducts ? (
                                <p className="navSearchMessage">
                                    Loading products...
                                </p>
                            ) : filteredProducts.length === 0 ? (
                                <p className="navSearchMessage">
                                    No products found.
                                </p>
                            ) : (
                                filteredProducts.map((product) => {
                                    const imageUrl = getProductImageUrl(
                                        product.images?.[0]?.image
                                    );

                                    const displayPrice = getProductDisplayPrice(product);

                                    return (
                                        <Link
                                            key={product.id}
                                            to={`/product/${product.id}`}
                                            className="navSearchResultItem"
                                            onClick={closeProductSearch}
                                        >
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    className="navSearchProductImage"
                                                />
                                            ) : (
                                                <div className="navSearchProductImage navSearchNoImage">
                                                    No image
                                                </div>
                                            )}

                                            <div className="navSearchProductInfo">
                                                <span className="navSearchProductName">
                                                    {product.name}
                                                </span>

                                                <span className="navSearchCategoryName">
                                                    {product.category_name || "Uncategorized"}
                                                </span>
                                            </div>

                                            <div className="navSearchProductPrice">
                                                <span>
                                                    Rs. {displayPrice.toLocaleString("en-PK")}
                                                </span>

                                                {Number(product.discount_price) > 0 &&
                                                    Number(product.discount_price) <
                                                    Number(product.price) && (
                                                        <del>
                                                            Rs. {Number(product.price).toLocaleString("en-PK")}
                                                        </del>
                                                    )}
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>

                <div className="navIcons">
                    {NavbarData.NavIcons?.map((item) => {
                        const isCartIcon = item.id === 1;

                        if (!isCartIcon) {
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    className="navProfileButton"
                                    onClick={handleProfileOpen}
                                    aria-label="Open profile settings"
                                    aria-expanded={profileOpen}
                                >
                                    <img
                                        src={item.icon}
                                        alt="Profile"
                                    />
                                </button>
                            );
                        }

                        return (
                            <Link
                                to={item.url}
                                key={item.id}
                                className="navCartLink"
                                aria-label="Cart"
                            >
                                <img src={item.icon} alt="Cart" />

                                {cartCount > 0 && (
                                    <span className="navCartBadge">
                                        {cartCount > 99 ? "99+" : cartCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <UserProfilePopup
                    isOpen={profileOpen && isLoggedIn}
                    onClose={() => setProfileOpen(false)}
                    onLogout={handleLogout}
                />
            </nav>

            {/* MOBILE SIDEBAR */}

            <div
                id="mobileNavigation"
                className={`mobileMenu ${menuOpen ? "mobileMenuOpen" : ""
                    }`}
                aria-hidden={!menuOpen}
                inert={!menuOpen}
            >
                <div className="mobileMenuHeader">
                    <div>
                        <span className="mobileMenuTitle">
                            MENU
                        </span>
                        <p className="mobileMenuSubtitle">
                            Explore our collection
                        </p>
                    </div>

                    <button
                        type="button"
                        className="mobileMenuClose"
                        onClick={closeMenus}
                        aria-label="Close menu"
                    >
                        ×
                    </button>
                </div>

                <div className="mobileMenuBody">
                    <ul className="mobileMainLinks">
                        {NavbarData.navlinks
                            ?.filter(
                                (item) =>
                                    item.label.toLowerCase() !== "categories"
                            )
                            .map((item) => (
                                <li key={item.id}>
                                    <Link
                                        to={item.url || "/"}
                                        onClick={closeMenus}
                                    >
                                        <span>{item.label}</span>
                                        <span className="mobileLinkArrow">
                                            ›
                                        </span>
                                    </Link>
                                </li>
                            ))}
                    </ul>

                    <div className="mobileCategoriesSection">
                        <button
                            type="button"
                            className={`mobileCategoriesTrigger ${mobileCategoriesOpen ? "active" : ""
                                }`}
                            onClick={() => {
                                setMobileCategoriesOpen(
                                    (previous) => !previous
                                );
                                setMobileParentOpen(null);
                            }}
                            aria-expanded={mobileCategoriesOpen}
                        >
                            <span>Categories</span>

                            <img
                                src={dropDown}
                                alt=""
                                className={`mobileAccordionArrow ${mobileCategoriesOpen ? "mobileArrowUp" : ""
                                    }`}
                            />
                        </button>

                        {mobileCategoriesOpen && (
                            <div className="mobileCategoriesDropdown">
                                {parentCategories.length === 0 ? (
                                    <p className="mobileCategoryEmpty">
                                        No categories available
                                    </p>
                                ) : (
                                    parentCategories.map((parent) => {
                                        const subcategories =
                                            getSubcategories(parent.id);

                                        const isParentOpen =
                                            mobileParentOpen === parent.id;

                                        return (
                                            <div
                                                key={parent.id}
                                                className="mobileParentCategory"
                                            >
                                                <button
                                                    type="button"
                                                    className={`mobileParentTrigger ${isParentOpen
                                                        ? "active"
                                                        : ""
                                                        }`}
                                                    onClick={() =>
                                                        setMobileParentOpen(
                                                            isParentOpen
                                                                ? null
                                                                : parent.id
                                                        )
                                                    }
                                                    aria-expanded={isParentOpen}
                                                >
                                                    <span>
                                                        {parent.name}
                                                    </span>

                                                    <img
                                                        src={dropDown}
                                                        alt=""
                                                        className={`mobileParentArrowIcon ${isParentOpen ? "mobileArrowUp" : ""
                                                            }`}
                                                    />
                                                </button>

                                                {isParentOpen && (
                                                    <div className="mobileSubcategories">
                                                        <Link
                                                            to={`/category/${parent.id}`}
                                                            className="mobileViewAllCategory"
                                                            onClick={closeMenus}
                                                        >
                                                            View All {parent.name}
                                                        </Link>

                                                        {subcategories.map(
                                                            (sub) => (
                                                                <Link
                                                                    key={sub.id}
                                                                    to={`/category/${sub.id}`}
                                                                    className="mobileSubcategoryLink"
                                                                    onClick={closeMenus}
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>

                    {!isLoggedIn && (
                        <div className="mobileMenuAccount">
                            <Link
                                to="/signin"
                                onClick={closeMenus}
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>

                <div className="mobileMenuFooter">
                    <span>SHOP.CO</span>
                    <p>Discover your style.</p>
                </div>
            </div>

            <div
                className={`menuOverlay ${menuOpen ? "overlayShow" : ""
                    }`}
                onClick={closeMenus}
                aria-hidden="true"
            />

            <div className={`NavBottom_Border ${className}`} />
        </>
    );
};

export default Navbar;