
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";
import "../../../style.css";
import img_1 from "../../../assets/images/Faqs_1.jpeg";

const categories = [
    "All Questions",
    "Orders",
    "Shipping",
    "Payments",
    "Products",
    "Returns",
    "Account",
];

const faqData = [
    {
        category: "Orders",
        question: "How can I place an order?",
        answer:
            "Browse our collection, select a product you like, choose the available size and colour, and add it to your cart. Proceed to checkout, enter your delivery details and select an available payment method to place your order.",
    },
    {
        category: "Orders",
        question: "Can I change or cancel my order?",
        answer:
            "Order changes and cancellations depend on the current order status. Please contact our support team as soon as possible and include your order number so they can review your request.",
    },
    {
        category: "Orders",
        question: "How can I track my order?",
        answer:
            "If order tracking is available for your purchase, use the tracking information provided by the store or delivery service. You can also contact support with your order number for assistance.",
    },
    {
        category: "Orders",
        question: "Where can I find my order details?",
        answer:
            "Keep your order confirmation details safe. If your account includes an order history section, you can check it there. Otherwise, contact support with your order number and registered contact details.",
    },
    {
        category: "Shipping",
        question: "How long does delivery take?",
        answer:
            "Delivery time depends on your location, product availability and the delivery service. The estimated delivery time should be confirmed when your order is placed or by contacting customer support.",
    },
    {
        category: "Shipping",
        question: "How much does shipping cost?",
        answer:
            "Shipping charges may vary depending on the store's current delivery settings and your order. Check the delivery fee displayed during checkout before confirming your purchase.",
    },
    {
        category: "Shipping",
        question: "Do you deliver to my city?",
        answer:
            "Delivery availability depends on the locations served by the store's delivery partners. Enter your correct address during checkout or contact support to confirm delivery availability for your city.",
    },
    {
        category: "Shipping",
        question: "What should I do if my order is delayed?",
        answer:
            "If your order has not arrived within the estimated delivery period, contact customer support with your order number. They can help you check the available delivery information.",
    },
    {
        category: "Payments",
        question: "Which payment methods are available?",
        answer:
            "Available payment methods are shown during checkout. Depending on the store configuration, these may include Cash on Delivery and online card payments.",
    },
    {
        category: "Payments",
        question: "Is online payment secure?",
        answer:
            "Use only the payment options provided during checkout. If online card payment is enabled, the payment provider handles the payment process. Never share your password or payment verification codes with anyone.",
    },
    {
        category: "Payments",
        question: "When will I be charged for my order?",
        answer:
            "For online payments, the payment process takes place during checkout. For Cash on Delivery, payment is generally collected when the parcel is delivered. The available terms are shown during checkout.",
    },
    {
        category: "Products",
        question: "How do I choose the right size?",
        answer:
            "Check the size options available on the product page before adding an item to your cart. If a size guide is provided, compare its measurements with your own measurements to help choose a suitable fit.",
    },
    {
        category: "Products",
        question: "Will the product look exactly like the pictures?",
        answer:
            "Product photos are intended to show the item's appearance and details. Actual colours can vary slightly because of lighting, photography and individual screen settings. Read the product description for additional details.",
    },
    {
        category: "Products",
        question: "How can I check product availability?",
        answer:
            "Open the product page and review the available sizes, colours and stock information. An option may become unavailable if the item is out of stock.",
    },
    {
        category: "Products",
        question: "Can I find details about fabric and materials?",
        answer:
            "Check the product description for the fabric, material and care information provided for that item. If a detail is missing, contact support before placing your order.",
    },
    {
        category: "Returns",
        question: "Can I return or exchange a product?",
        answer:
            "Return and exchange eligibility depends on the store's official policy and the condition of the product. Contact support before sending an item back to confirm the applicable process and requirements.",
    },
    {
        category: "Returns",
        question: "What if I receive a damaged or incorrect item?",
        answer:
            "Contact customer support as soon as possible and provide your order number, a description of the issue and clear photos of the item if requested. Support can advise you on the next steps under the applicable policy.",
    },
    {
        category: "Returns",
        question: "How long does a refund take?",
        answer:
            "Refund timing depends on the approved refund process and the payment method used. Contact support to confirm your refund status and the expected processing time.",
    },
    {
        category: "Account",
        question: "How do I create an account?",
        answer:
            "Open the sign-up page and enter the information requested by the store. Follow the on-screen instructions to complete account registration.",
    },
    {
        category: "Account",
        question: "I forgot my password. What should I do?",
        answer:
            "Open the sign-in page and choose the Forgot Password option. Follow the instructions to reset your password using the email or verification process supported by the store.",
    },
    {
        category: "Account",
        question: "How can I update my account information?",
        answer:
            "Sign in to your account and open the available profile or account settings. If you cannot edit a particular detail, contact support for assistance.",
    },
];

const FAQs = () => {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All Questions");
    const [openQuestion, setOpenQuestion] = useState<number | null>(0);

    const filteredFAQs = faqData.filter((faq) => {
        const matchesCategory =
            activeCategory === "All Questions" ||
            faq.category === activeCategory;

        const matchesSearch =
            faq.question.toLowerCase().includes(search.toLowerCase()) ||
            faq.answer.toLowerCase().includes(search.toLowerCase()) ||
            faq.category.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        setOpenQuestion(null);
    };

    return (
        <>
            <Navbar />

            <main className="FAQsPage">
                {/* HERO */}
                <section className="FAQsHero">
                    <div className="FAQsHeroContent">
                        <span className="FAQsEyebrow">
                            WE'RE HERE TO HELP
                        </span>

                        <h1>
                            Frequently
                            <br />
                            <span>asked questions.</span>
                        </h1>

                        <p>
                            Find answers to common questions about your
                            shopping experience, orders, delivery and more.
                        </p>

                    </div>

                    <div className="FAQsHeroVisual">
                        <img
                            src={img_1}
                            alt="Fashion shopping and style inspiration"
                        />

                        <div className="FAQsHeroImageLabel">
                            <span>SHOP WITH CONFIDENCE</span>
                            <strong>We've got answers.</strong>
                        </div>
                    </div>
                </section>

                {/* FAQ CONTENT */}
                <section className="FAQsMain">
                    <div className="FAQsSectionHeading">
                        <span className="FAQsEyebrow">
                            HELP CENTRE
                        </span>

                        <h2>
                            How can we
                            <br />
                            <span>help you today?</span>
                        </h2>

                        <p>
                            Choose a topic or search for an answer below.
                        </p>
                    </div>

                    {/* CATEGORY FILTERS */}
                    <div
                        className="FAQsCategories"
                        aria-label="Filter questions by category"
                    >
                        {categories.map((category) => (
                            <button
                                type="button"
                                key={category}
                                className={
                                    activeCategory === category
                                        ? "FAQsCategoryButton active"
                                        : "FAQsCategoryButton"
                                }
                                onClick={() => handleCategoryChange(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* RESULTS */}
                    <div className="FAQsResults">
                        <div className="FAQsResultsHeader">
                            <h3>
                                {search
                                    ? "Search results"
                                    : activeCategory === "All Questions"
                                      ? "Popular questions"
                                      : activeCategory}
                            </h3>

                            <span>
                                {filteredFAQs.length}{" "}
                                {filteredFAQs.length === 1
                                    ? "question"
                                    : "questions"}
                            </span>
                        </div>

                        {filteredFAQs.length > 0 ? (
                            <div className="FAQsAccordion">
                                {filteredFAQs.map((faq, index) => {
                                    const isOpen = openQuestion === index;

                                    return (
                                        <article
                                            className={
                                                isOpen
                                                    ? "FAQsItem open"
                                                    : "FAQsItem"
                                            }
                                            key={faq.question}
                                        >
                                            <button
                                                type="button"
                                                className="FAQsQuestion"
                                                onClick={() =>
                                                    setOpenQuestion(
                                                        isOpen ? null : index
                                                    )
                                                }
                                                aria-expanded={isOpen}
                                            >
                                                <span className="FAQsQuestionText">
                                                    {faq.question}
                                                </span>

                                                <span className="FAQsQuestionIcon">
                                                    <ChevronDown
                                                        size={19}
                                                    />
                                                </span>
                                            </button>

                                            {isOpen && (
                                                <div className="FAQsAnswer">
                                                    <p>{faq.answer}</p>
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="FAQsEmpty">
                                <span className="FAQsEmptyIcon">
                                    <Search size={27} />
                                </span>

                                <h3>No questions found</h3>

                                <p>
                                    Try a different keyword or select
                                    another category to find your answer.
                                </p>

                                <button
                                    type="button"
                                    className="FAQsResetButton"
                                    onClick={() => {
                                        setSearch("");
                                        setActiveCategory("All Questions");
                                        setOpenQuestion(0);
                                    }}
                                >
                                    Show all questions
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* SUPPORT CTA */}
                <section className="FAQsContact">
                    <div className="FAQsContactIcon">?</div>

                    <div className="FAQsContactContent">
                        <span className="FAQsEyebrow">
                            STILL NEED HELP?
                        </span>

                        <h2>Couldn't find your answer?</h2>

                        <p>
                            We're happy to help. Visit our Contact Us page
                            to send your question to the team.
                        </p>
                    </div>

                    <Link
                        to="/contact-us"
                        className="FAQsContactButton"
                    >
                        Contact Us
                    </Link>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default FAQs;
