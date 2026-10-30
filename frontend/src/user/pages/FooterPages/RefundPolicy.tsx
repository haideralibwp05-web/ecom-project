
import { Link } from "react-router-dom";
import {
    Wallet,
    ShieldCheck,
    ClipboardCheck,
    PackageX,
    CreditCard,
    Clock3,
    Truck,
    Mail,
    ChevronRight,
    CircleHelp,
} from "lucide-react";

import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";
import "../../../style.css";

const refundSections = [
    {
        id: "overview",
        icon: ShieldCheck,
        title: "1. Refund Policy Overview",
        content:
            "At SHOP.CO, we want customers to feel confident about their purchases. This page explains how refund requests are reviewed, what information may be needed and how approved refunds are handled. Refund decisions are subject to the applicable return conditions and consumer protection laws.",
    },
    {
        id: "eligibility",
        icon: ClipboardCheck,
        title: "2. Refund Eligibility",
        content:
            "Refund eligibility depends on the circumstances of the purchase, the condition of the item and the applicable return policy. Customers may contact our support team if they receive an incorrect, damaged or defective item. Eligibility is assessed based on the order details and supporting information.",
    },
    {
        id: "request",
        icon: CircleHelp,
        title: "3. How to Request a Refund",
        content:
            "To request a refund, contact our support team and provide your order number, contact information, the reason for your request and photographs where relevant. Our team can review the information and advise you about the next steps. Do not send an item back before receiving return instructions.",
    },
    {
        id: "damaged",
        icon: PackageX,
        title: "4. Damaged or Incorrect Products",
        content:
            "If your order arrives damaged, defective or different from what you ordered, please contact us as soon as reasonably possible. Include clear photographs of the product and packaging where available. We will review the issue and explain the available resolution, subject to applicable law.",
    },
    {
        id: "payments",
        icon: CreditCard,
        title: "5. Refund Methods",
        content:
            "For orders paid online, an approved refund may be returned through the original payment provider where supported. For cash-on-delivery orders, our team will need to confirm an appropriate refund method with the customer. The method used may depend on the original transaction and the payment services available.",
    },
    {
        id: "processing",
        icon: Clock3,
        title: "6. Refund Processing Time",
        content:
            "The time required to process an approved refund may vary depending on order verification, product inspection and the payment provider involved. We will communicate the applicable processing details when a refund is approved. Additional time may be required for a bank or payment provider to reflect the transaction.",
    },
    {
        id: "shipping",
        icon: Truck,
        title: "7. Shipping and Return Charges",
        content:
            "Any return shipping charges and their responsibility will depend on the reason for the return, the applicable store policy and consumer protection requirements. If an item was delivered incorrectly or arrived defective, contact us before arranging return shipping so the appropriate next steps can be confirmed.",
    },
    {
        id: "exceptions",
        icon: ShieldCheck,
        title: "8. Refund Exceptions",
        content:
            "Some items may have special return conditions due to their nature, condition or customization. Any such restrictions should be clearly communicated before purchase and must comply with applicable law. Statutory consumer rights are not excluded by this policy.",
    },
    {
        id: "updates",
        icon: ClipboardCheck,
        title: "9. Changes to This Policy",
        content:
            "We may update this Refund Policy when our store operations, payment methods or legal requirements change. Any updated version will be published on this page. Please review the policy when placing an order.",
    },
];

const RefundPolicy = () => {
    return (
        <>
            <Navbar />

            <main className="policy-page">
                {/* HERO */}
                <section className="policy-hero">
                    <div className="policy-hero-inner">
                        <div className="policy-icon">
                            <Wallet size={34} strokeWidth={1.6} />
                        </div>

                        <span className="policy-eyebrow">
                            SHOP WITH CONFIDENCE
                        </span>

                        <h1>
                            Refund <span>Policy</span>
                        </h1>

                        <p>
                            We believe in a clear and transparent shopping
                            experience. Learn how refund requests work and
                            what to expect during the process.
                        </p>

                        <div className="policy-meta">
                            <span>
                                <ShieldCheck size={15} />
                                Customer Support
                            </span>

                            <span className="policy-meta-divider" />

                            <span>Refunds &amp; Payments</span>
                        </div>
                    </div>
                </section>

                {/* MAIN CONTENT */}
                <div className="policy-layout">
                    {/* SIDEBAR */}
                    <aside className="policy-sidebar">
                        <h2>On this page</h2>

                        <nav aria-label="Refund policy sections">
                            {refundSections.map((section) => (
                                <a
                                    href={`#refund-${section.id}`}
                                    key={section.id}
                                >
                                    {section.title.replace(/^\d+\.\s*/, "")}
                                    <ChevronRight size={15} />
                                </a>
                            ))}

                            <a href="#refund-contact">
                                Contact Support
                                <ChevronRight size={15} />
                            </a>
                        </nav>

                        <div className="policy-sidebar-note">
                            <Mail size={22} />

                            <strong>Need help with a refund?</strong>

                            <p>
                                Our support team can help you understand
                                the refund request process.
                            </p>

                            <Link to="/contact-us">
                                Contact Support
                                <ChevronRight size={15} />
                            </Link>
                        </div>
                    </aside>

                    {/* POLICY DETAILS */}
                    <article className="policy-content">
                        <div className="policy-intro">
                            <h2>Understanding Our Refund Process</h2>

                            <p>
                                We aim to handle refund requests fairly
                                and clearly. Please read the information
                                below before submitting a request, and
                                review our Returns &amp; Exchanges policy
                                for related return conditions.
                            </p>
                        </div>

                        {refundSections.map((section) => {
                            const Icon = section.icon;

                            return (
                                <section
                                    className="policy-section"
                                    id={`refund-${section.id}`}
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

                                        {section.id === "eligibility" && (
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

                        {/* CONTACT BOX */}
                        <section
                            className="policy-contact"
                            id="refund-contact"
                        >
                            <div className="policy-contact-icon">
                                <Mail size={23} />
                            </div>

                            <div>
                                <h2>Still have questions?</h2>

                                <p>
                                    If you need help with an order or
                                    would like to request a refund,
                                    please contact our support team.
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

export default RefundPolicy;
