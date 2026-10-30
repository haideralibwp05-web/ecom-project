
import { useState } from "react";
import { ratingData, faqsData } from "../../../data/rating";

interface RatingsProps {
    remainingDescription?: string;
}

const Ratings = ({ remainingDescription = "" }: RatingsProps) => {
    const [activeTab, setActiveTab] = useState("details");
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <section className="productReviews" aria-label="Product information">

            {/* Tabs */}
            <div className="ratingTabsWrapper">
                <nav className="ratingHeader" aria-label="Product sections">
                    {ratingData.productHeader.map((item) => {
                        const tabId =
                            item.id === 1
                                ? "details"
                                : item.id === 2
                                    ? "reviews"
                                    : "faqs";

                        return (
                            <button
                                key={item.id}
                                type="button"
                                className={`ratingTab ${activeTab === tabId ? "activeRatingTab" : ""
                                    }`}
                                onClick={() => setActiveTab(tabId)}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="DifferenceBorder" />

                <div
                    className={`ratingActiveIndicator ${activeTab === "details"
                            ? "indicatorDetails"
                            : activeTab === "reviews"
                                ? "indicatorReviews"
                                : "indicatorFaqs"
                        }`}
                />
            </div>
            {/* Product Details Tab */}
            {activeTab === "details" && (
                <div className="ratingProductDescription">
                    <h1>Product Details</h1>

                    <div className="ratingDescriptionText">
                        {remainingDescription ||
                            "No additional product details available."}
                    </div>
                </div>
            )}

            {/* Rating & Reviews Tab */}
            {activeTab === "reviews" && (
                <div className="reviewCards">
                    {ratingData.reviewCards.map((item) => (
                        <div className="reviewCard" key={item.id}>
                            <div className="reviewCardTop">
                                <div>
                                    <img src={item.stars} alt="Rating stars" />
                                </div>

                                <div>
                                    <img src={item.threeDots} alt="More options" />
                                </div>
                            </div>

                            <div className="reviewCardCenter">
                                <p>{item.name}</p>

                                <div>
                                    <img
                                        src={item.verified}
                                        alt="Verified customer"
                                    />
                                </div>
                            </div>

                            <p className="reviewCardDesc">
                                {item.Desc}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* FAQs Tab */}
            {activeTab === "faqs" && (
                <div className="ratingFaqs">
                    <h2>Frequently Asked Questions</h2>

                    <p className="ratingFaqsSubtitle">
                        Find answers to common questions about our products.
                    </p>

                    <div className="ratingFaqList">
                        {faqsData.map((faq) => {
                            const isOpen = openFaq === faq.id;

                            return (
                                <div
                                    className={`ratingFaqItem ${isOpen ? "activeFaq" : ""
                                        }`}
                                    key={faq.id}
                                >
                                    <button
                                        type="button"
                                        className="ratingFaqQuestion"
                                        onClick={() =>
                                            setOpenFaq(
                                                isOpen ? null : faq.id
                                            )
                                        }
                                        aria-expanded={isOpen}
                                    >
                                        <span>{faq.question}</span>

                                        <span className="ratingFaqIcon">
                                            {isOpen ? "−" : "+"}
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <div className="ratingFaqAnswer">
                                            <p>{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

        </section>
    );
};

export default Ratings;
