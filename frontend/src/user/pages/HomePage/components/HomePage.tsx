import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { getNewArrivals, getTopSelling } from "../../../../services/productApi";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import ProductQuickView from "../../../components/shared/ProductQuickView";
import type { Product } from "../../../types/categoryPage";

import {
    HeroData,
    NewArrivalsData,
    TopSellingData,
    BrowseData,
    TestimonialData,
} from "../../../data/HomePage";

const Home = () => {
    // ================= NEW ARRIVALS =================

    const [newArrivals, setNewArrivals] = useState<any[]>([]);
    const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);
    const [newArrivalsError, setNewArrivalsError] = useState("");
    const [visibleNewArrivals, setVisibleNewArrivals] = useState(4);
const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                setLoadingNewArrivals(true);
                setNewArrivalsError("");

                const data = await getNewArrivals();
                setNewArrivals(data);
            } catch (error) {
                console.error("New Arrivals error:", error);
                setNewArrivalsError("Products load nahi ho sake.");
            } finally {
                setLoadingNewArrivals(false);
            }
        };

        fetchNewArrivals();
    }, []);

    // ================= TOP SELLING =================

    const [topSelling, setTopSelling] = useState<any[]>([]);
    const [loadingTopSelling, setLoadingTopSelling] = useState(true);
    const [topSellingError, setTopSellingError] = useState("");
    const [visibleTopSelling, setVisibleTopSelling] = useState(4);

    useEffect(() => {
        const fetchTopSelling = async () => {
            try {
                setLoadingTopSelling(true);
                setTopSellingError("");

                const data = await getTopSelling();
                setTopSelling(data);
            } catch (error) {
                console.error("Top Selling error:", error);
                setTopSellingError(
                    "Top selling products load nahi ho sake."
                );
            } finally {
                setLoadingTopSelling(false);
            }
        };

        fetchTopSelling();
    }, []);

    const swiperRef = useRef<SwiperType | null>(null);

    // ================= IMAGE URL HELPER =================

    const getImageUrl = (imagePath?: string | null): string => {
        if (!imagePath) return "";

        if (imagePath.startsWith("http")) {
            return imagePath;
        }

        return `http://127.0.0.1:8000${imagePath.startsWith("/") ? "" : "/"
            }${imagePath}`;
    };

    // ================= PRICE FORMAT HELPER =================

    const formatPrice = (price: number): string => {
        return price.toLocaleString("en-PK");
    };

    return (
        <>
            {/* ================= HERO SECTION ================= */}

            <section className="HeroSection">
                <div className="HeroContent">
                    <div className="HeroText">
                        <h1>{HeroData.heading}</h1>
                        <p>{HeroData.description}</p>
                        <button>{HeroData.button}</button>

                        <div className="HeroPageStatus">
                            {HeroData.stats.map((item) => (
                                <div className="HeroStatus" key={item.id}>
                                    <h2>{item.number}</h2>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="HeroImageWrapper">
                        <img
                            className="HeroImage"
                            src={HeroData.heroImage}
                            alt="Hero"
                        />
                    </div>
                </div>

                <div className="HeroBottomBrands">
                    {HeroData.brands.map((brand) => (
                        <div className="HeroBottomBrand" key={brand.id}>
                            <img src={brand.image} alt="" />
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= NEW ARRIVALS ================= */}

            <section>
                <h2 className="ProductSectionHeading">
                    {NewArrivalsData.Heading}
                </h2>

                {loadingNewArrivals ? (
                    <p>Loading products...</p>
                ) : newArrivalsError ? (
                    <p>{newArrivalsError}</p>
                ) : newArrivals.length === 0 ? (
                    <p>No products available.</p>
                ) : (
                    <>
                        <div className="products">
                            {newArrivals
                                .slice(0, visibleNewArrivals)
                                .map((item) => {
                                    const imageUrl = getImageUrl(
                                        item.images?.[0]?.image
                                    );

                                    const secondImageUrl = getImageUrl(
                                        item.images?.[1]?.image
                                    );

                                    const price = Number(item.price);
                                    const discountPrice = Number(
                                        item.discount_price
                                    );

                                    const hasDiscount =
                                        item.discount_price !== null &&
                                        item.discount_price !== undefined &&
                                        discountPrice > 0 &&
                                        discountPrice < price;

                                    const discountPercentage =
                                        hasDiscount && price > 0
                                            ? Math.round(
                                                ((price - discountPrice) /
                                                    price) *
                                                100
                                            )
                                            : 0;

                                    const rating = Math.max(
                                        0,
                                        Math.min(
                                            5,
                                            Math.round(
                                                Number(item.rating) || 0
                                            )
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
                                                                    src={
                                                                        secondImageUrl
                                                                    }
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
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            setQuickViewProduct(item);
                                                        }}
                                                    >
                                                       
                                                        <span>
                                                            Quick View
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
                                                                {formatPrice(
                                                                    price
                                                                )}
                                                            </del>

                                                            <span className="discount">
                                                                -
                                                                {
                                                                    discountPercentage
                                                                }
                                                                %
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        {/* NEW ARRIVALS VIEW MORE */}

                        {visibleNewArrivals < newArrivals.length && (
                            <div className="onSaleViewMoreWrapper">
                                <button
                                    type="button"
                                    className="onSaleViewMoreButton"
                                    onClick={() =>
                                        setVisibleNewArrivals((previous) =>
                                            Math.min(
                                                previous + 4,
                                                newArrivals.length
                                            )
                                        )
                                    }
                                >
                                    View More
                                </button>
                            </div>
                        )}
                    </>
                )}

                <div className="ProductSectionBorder" />
            </section>

            {/* ================= TOP SELLING ================= */}

            <section>
                <h2 className="ProductSectionHeading">
                    {TopSellingData.Heading}
                </h2>

                {loadingTopSelling ? (
                    <p>Loading top selling products...</p>
                ) : topSellingError ? (
                    <p>{topSellingError}</p>
                ) : topSelling.length === 0 ? (
                    <p>No top selling products available yet.</p>
                ) : (
                    <>
                        <div className="products">
                            {topSelling
                                .slice(0, visibleTopSelling)
                                .map((item) => {
                                    const imageUrl = getImageUrl(
                                        item.images?.[0]?.image
                                    );

                                    const secondImageUrl = getImageUrl(
                                        item.images?.[1]?.image
                                    );

                                    const price = Number(item.price);
                                    const discountPrice = Number(
                                        item.discount_price
                                    );

                                    const hasDiscount =
                                        item.discount_price !== null &&
                                        item.discount_price !== undefined &&
                                        discountPrice > 0 &&
                                        discountPrice < price;

                                    const discountPercentage =
                                        hasDiscount && price > 0
                                            ? Math.round(
                                                ((price - discountPrice) /
                                                    price) *
                                                100
                                            )
                                            : 0;

                                    const rating = Math.max(
                                        0,
                                        Math.min(
                                            5,
                                            Math.round(
                                                Number(item.rating) || 0
                                            )
                                        )
                                    );

                                    return (
                                        <div
                                            className="product"
                                            key={item.id}
                                        >
                                            {/* PRODUCT IMAGE */}

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
                                                            />

                                                            {secondImageUrl && (
                                                                <img
                                                                    className="productImg productSecondaryImg"
                                                                    src={
                                                                        secondImageUrl
                                                                    }
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

                                                {/* HOVER ACTIONS */}

                                                <div className="productHoverActions">
                                                    <button
                                                        type="button"
                                                        className="productAddToCartBtn"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            setQuickViewProduct(item);
                                                        }}
                                                    >
                                                    
                                                        <span>
                                                            Quick View
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
                                                                {formatPrice(
                                                                    price
                                                                )}
                                                            </del>

                                                            <span className="discount">
                                                                -
                                                                {
                                                                    discountPercentage
                                                                }
                                                                %
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        {/* TOP SELLING VIEW MORE */}

                        {visibleTopSelling < topSelling.length && (
                            <div className="onSaleViewMoreWrapper">
                                <button
                                    type="button"
                                    className="onSaleViewMoreButton"
                                    onClick={() =>
                                        setVisibleTopSelling((previous) =>
                                            Math.min(
                                                previous + 4,
                                                topSelling.length
                                            )
                                        )
                                    }
                                >
                                    View More
                                </button>
                            </div>
                        )}
                    </>
                )}

                <div className="ProductSectionBtnDiv" />
            </section>

            {/* ================= BROWSE ================= */}

            <section className="BrowseSection">
                <h2 className="ProductSectionHeading">
                    {BrowseData.Heading}
                </h2>

                <div className="BrowseRow1">
                    {BrowseData.Row1.map((item) => (
                        <div key={item.id}>
                            <div className="BrowseImg">
                                <img
                                    className="Row1_Img"
                                    src={item.image}
                                    alt={item.imageText}
                                />
                                <h3 className="BrowseImgText">
                                    {item.imageText}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="BrowseRow2">
                    {BrowseData.Row2.map((item) => (
                        <div key={item.id}>
                            <div className="BrowseImg">
                                <img
                                    className="Row2_Img"
                                    src={item.image}
                                    alt={item.imageText}
                                />
                                <h3 className="BrowseImgText">
                                    {item.imageText}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= TESTIMONIALS ================= */}

            <section className="TestimonialSection">
                <div className="TestimonialHeader">
                    <h2 className="TestimonialHeading">
                        {TestimonialData.heading}
                    </h2>

                    <div className="NavigationButtons">
                        <div
                            className="NavButton"
                            onClick={() => swiperRef.current?.slidePrev()}
                        >
                            <img
                                src={TestimonialData.ArrowLeft}
                                alt="Previous"
                            />
                        </div>

                        <div
                            className="NavButton"
                            onClick={() => swiperRef.current?.slideNext()}
                        >
                            <img
                                src={TestimonialData.ArrowRight}
                                alt="Next"
                            />
                        </div>
                    </div>
                </div>

                <Swiper
                    modules={[Navigation, Autoplay]}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    spaceBetween={24}
                    slidesPerView={3}
                    loop={true}
                    speed={1000}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                        reverseDirection: false,
                    }}
                    breakpoints={{
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 15,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1200: {
                            slidesPerView: 3,
                            spaceBetween: 24,
                        },
                    }}
                >
                    {TestimonialData.cards.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="TestimonialCard">
                                <div className="Stars">
                                    <img src={item.rating} alt="" />
                                </div>

                                <div className="CustomerInfo">
                                    <h3 className="CustomerName">
                                        {item.name}
                                    </h3>

                                    <span className="VerifiedTick">
                                        <img
                                            src={item.verified}
                                            alt="Verified"
                                        />
                                    </span>
                                </div>

                                <p className="CustomerReview">
                                    "{item.review}"
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
            <ProductQuickView
                product={quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
            />
        </>

    );

};

export default Home;


