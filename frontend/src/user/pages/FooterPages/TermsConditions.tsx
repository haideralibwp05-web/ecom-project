
import { Link } from "react-router-dom";
import {
    FileText,
    ShoppingBag,
    CreditCard,
    Truck,
    RefreshCw,
    UserRound,
    ShieldCheck,
    Scale,
    Mail,
    ChevronRight,
} from "lucide-react";

import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";
import "../../../style.css";
import { FaArrowRightLong } from "react-icons/fa6";

const termsSections = [
    {
        id: "acceptance",
        icon: FileText,
        title: "1. Acceptance of Terms",
        content:
            "By accessing or using the SHOP.CO website, you agree to these Terms & Conditions. If you do not agree with these terms, please do not use the website. These terms apply to your use of the website and the services made available through it.",
    },
    {
        id: "products",
        icon: ShoppingBag,
        title: "2. Products and Availability",
        content:
            "We aim to display product descriptions, images, colours and sizes as accurately as possible. Actual colours may vary depending on your screen or device. Product availability may change, and we cannot guarantee that every listed item will remain available. Please review the product details and selected size before placing an order.",
    },
    {
        id: "orders",
        icon: FileText,
        title: "3. Orders and Confirmation",
        content:
            "When you place an order, please provide accurate contact and delivery information. An order submission does not necessarily mean that the order has been finally accepted. We may contact you to verify order details or inform you about availability. If an order cannot be fulfilled, we should notify you and address any payment already received in accordance with applicable law and our stated policies.",
    },
    {
        id: "pricing",
        icon: CreditCard,
        title: "4. Prices and Payments",
        content:
            "Prices, discounts and delivery charges should be reviewed at checkout before you confirm your order. The final amount payable depends on the items and delivery options selected. Available payment methods may include cash on delivery or online payment, depending on what is offered at checkout. Online payments may be processed by third-party payment providers under their applicable terms.",
    },
    {
        id: "delivery",
        icon: Truck,
        title: "5. Shipping and Delivery",
        content:
            "Delivery estimates are provided as a guide and may be affected by location, courier operations, weather or other circumstances beyond our control. Please ensure that your delivery address and phone number are correct. For more information, please review our Shipping & Delivery page.",
    },
    {
        id: "cancellations",
        icon: RefreshCw,
        title: "6. Cancellations, Returns and Exchanges",
        content:
            "Cancellation requests, returns and exchanges are subject to the applicable policy and the circumstances of the order. Before ordering, review our Returns & Exchanges page for the conditions and instructions that apply. Nothing in these terms is intended to remove any consumer rights that cannot legally be excluded.",
    },
    {
        id: "accounts",
        icon: UserRound,
        title: "7. Customer Accounts",
        content:
            "You are responsible for providing accurate account information and taking reasonable steps to keep your login credentials secure. Please notify us if you believe that your account has been accessed without your permission. We may take reasonable steps to protect the website and its users where account activity raises security concerns.",
    },
    {
        id: "conduct",
        icon: ShieldCheck,
        title: "8. Acceptable Website Use",
        content:
            "You must not misuse the website, attempt unauthorized access, interfere with its operation, submit misleading information or use the website for unlawful purposes. We may investigate activity that appears to compromise website security or violate applicable law.",
    },
    {
        id: "intellectual-property",
        icon: Scale,
        title: "9. Intellectual Property",
        content:
            "Unless otherwise stated, website content such as text, graphics, logos, product photographs and page designs belongs to SHOP.CO or the relevant rights holders. You may not reproduce, distribute or commercially use protected content without permission, except where permitted by applicable law.",
    },
    {
        id: "liability",
        icon: Scale,
        title: "10. Liability and Applicable Law",
        content:
            "We aim to keep the website available and its information accurate, but we cannot guarantee uninterrupted access or that every page will always be error-free. To the extent permitted by applicable law, we are not responsible for losses arising from events beyond our reasonable control. These terms are subject to applicable laws, and nothing in them limits rights or remedies that cannot legally be limited.",
    },
    {
        id: "changes",
        icon: FileText,
        title: "11. Changes to These Terms",
        content:
            "We may revise these Terms & Conditions when our website, services or legal obligations change. Updated terms will be published on this page. Your continued use of the website after an update means you are using the website under the revised terms, to the extent permitted by applicable law.",
    },
];

const TermsConditions = () => {
    return (
        <>
            <Navbar />

            <main className="policy-page">
                <section className="policy-hero">
                    <div className="policy-hero-inner">
                        <div className="policy-icon">
                            <FileText size={34} strokeWidth={1.6} />
                        </div>

                        <span className="policy-eyebrow">
                            SHOP WITH CONFIDENCE
                        </span>

                        <h1>
                            Terms <span>&amp; Conditions</span>
                        </h1>

                        <p>
                            Please read the terms that apply when you browse
                            our website, create an account or place an order
                            with SHOP.CO.
                        </p>

                        <div className="policy-meta">
                            <span>
                                <ShieldCheck size={15} />
                                Website Terms
                            </span>

                            <span className="policy-meta-divider" />

                            <span>Last reviewed: October 27, 2026</span>
                        </div>
                    </div>
                </section>

                <div className="policy-layout">
                    <aside className="policy-sidebar">
                        <h2>On this page</h2>

                        <nav aria-label="Terms and conditions sections">
                            {termsSections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#terms-${section.id}`}
                                >
                                    {section.title.replace(/^\d+\.\s*/, "")}
                                    <ChevronRight size={15} />
                                </a>
                            ))}

                            <a href="#terms-contact">
                                Contact Us
                                <ChevronRight size={15} />
                            </a>
                        </nav>

                        <div className="policy-sidebar-note">
                            <Mail size={21} />

                            <strong>Need clarification?</strong>

                            <p>
                                Contact our team if you have questions about
                                these terms or an order.
                            </p>

                            <Link to="/contact-us">
                                Contact us <FaArrowRightLong />
                            </Link>
                        </div>
                    </aside>

                    <article className="policy-content">
                        <div className="policy-intro">
                            <h2>Welcome to SHOP.CO</h2>

                            <p>
                                These Terms &amp; Conditions describe the
                                general rules for using our online store.
                                Please review them before making a purchase.
                                Additional policies may apply to particular
                                services or orders and should be read
                                alongside these terms.
                            </p>
                        </div>

                        {termsSections.map((section) => {
                            const Icon = section.icon;

                            return (
                                <section
                                    className="policy-section"
                                    id={`terms-${section.id}`}
                                    key={section.id}
                                >
                                    <div className="policy-section-icon">
                                        <Icon
                                            size={21}
                                            strokeWidth={1.7}
                                        />
                                    </div>

                                    <div>
                                        <h2>{section.title}</h2>
                                        <p>{section.content}</p>

                                        {section.id === "delivery" && (
                                            <Link
                                                to="/shipping-delivery"
                                                className="policy-inline-link"
                                            >
                                                Read Shipping &amp; Delivery
                                                <ChevronRight size={16} />
                                            </Link>
                                        )}

                                        {section.id === "cancellations" && (
                                            <Link
                                                to="/returns-exchanges"
                                                className="policy-inline-link"
                                            >
                                                Read Returns &amp; Exchanges
                                                <ChevronRight size={16} />
                                            </Link>
                                        )}
                                    </div>
                                </section>
                            );
                        })}

                        <section
                            className="policy-contact"
                            id="terms-contact"
                        >
                            <div className="policy-contact-icon">
                                <Mail size={23} />
                            </div>

                            <div>
                                <h2>Questions about our terms?</h2>

                                <p>
                                    If anything in these Terms &amp;
                                    Conditions is unclear, please contact
                                    our team before placing your order.
                                </p>

                                <Link to="/contact-us">
                                    Contact SHOP.CO
                                    <ChevronRight size={17} />
                                </Link>
                            </div>
                        </section>
                    </article>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default TermsConditions;
