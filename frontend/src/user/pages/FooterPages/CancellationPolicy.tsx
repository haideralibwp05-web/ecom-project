
import { Link } from "react-router-dom";
import {
    Ban,
    ShieldCheck,
    ClipboardList,
    Clock3,
    Truck,
    CreditCard,
    RefreshCw,
    PackageCheck,
    Mail,
    ChevronRight,
} from "lucide-react";

import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";
import "../../../style.css";

const cancellationSections = [
    {
        id: "overview",
        icon: ShieldCheck,
        title: "1. Cancellation Policy Overview",
        content:
            "At SHOP.CO, we understand that plans can change. This policy explains how customers can request an order cancellation, when cancellation may be possible and what happens to payments if a cancellation is approved.",
    },
    {
        id: "eligibility",
        icon: Clock3,
        title: "2. Cancellation Eligibility",
        content:
            "Cancellation requests are reviewed based on the current order status. Orders that have not yet been processed or dispatched may be eligible for cancellation. Once an order has entered the shipping process, cancellation may no longer be possible.",
    },
    {
        id: "request",
        icon: ClipboardList,
        title: "3. How to Cancel an Order",
        content:
            "To request cancellation, contact our customer support team and provide your order number, name and contact details. Our team will review the order status and confirm whether the cancellation can be completed. Submitting a request does not automatically cancel the order.",
    },
    {
        id: "processing",
        icon: PackageCheck,
        title: "4. Orders Being Processed",
        content:
            "If your order is being prepared or packed, please contact us as soon as possible. We will check whether the order can still be cancelled. Cancellation availability depends on how far the order has progressed through fulfillment.",
    },
    {
        id: "shipped",
        icon: Truck,
        title: "5. Shipped or Dispatched Orders",
        content:
            "Orders that have already been handed over for delivery may not be eligible for cancellation. If your order has been dispatched, please contact our support team for available options and review our Returns & Exchanges Policy where applicable.",
    },
    {
        id: "cod",
        icon: CreditCard,
        title: "6. Cash on Delivery Orders",
        content:
            "For Cash on Delivery (COD) orders, an approved cancellation before payment normally does not require a payment refund. Please request cancellation through customer support rather than assuming that an order has been cancelled.",
    },
    {
        id: "online-payments",
        icon: RefreshCw,
        title: "7. Online Payments and Refunds",
        content:
            "If an order was paid online and cancellation is approved, any applicable refund will be handled according to our Refund Policy. Processing time may depend on the payment provider and transaction status. Our support team can provide information about the next steps.",
    },
    {
        id: "store-cancellation",
        icon: Ban,
        title: "8. Cancellation by SHOP.CO",
        content:
            "In certain situations, we may be unable to fulfill an order because of product unavailability, incorrect order information, payment verification issues or other operational circumstances. If this happens, we will aim to inform the customer and address any payment received in accordance with applicable law.",
    },
    {
        id: "changes",
        icon: ClipboardList,
        title: "9. Changes to This Policy",
        content:
            "We may update this Cancellation Policy to reflect changes in our order fulfillment process, payment methods or applicable legal requirements. Updated information will be published on this page.",
    },
];

const CancellationPolicy = () => {
    return (
        <>
            <Navbar />

            <main className="policy-page">
                {/* HERO SECTION */}
                <section className="policy-hero">
                    <div className="policy-hero-inner">
                        <div className="policy-icon">
                            <Ban size={34} strokeWidth={1.6} />
                        </div>

                        <span className="policy-eyebrow">
                            ORDER INFORMATION
                        </span>

                        <h1>
                            Cancellation <span>Policy</span>
                        </h1>

                        <p>
                            Need to cancel an order? Learn how cancellation
                            requests work, when an order may be cancelled
                            and what happens after approval.
                        </p>

                        <div className="policy-meta">
                            <span>
                                <ShieldCheck size={15} />
                                Order Support
                            </span>

                            <span className="policy-meta-divider" />

                            <span>Cancellation &amp; Payments</span>
                        </div>
                    </div>
                </section>

                {/* MAIN LAYOUT */}
                <div className="policy-layout">
                    {/* SIDEBAR */}
                    <aside className="policy-sidebar">
                        <h2>On this page</h2>

                        <nav aria-label="Cancellation policy sections">
                            {cancellationSections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#cancellation-${section.id}`}
                                >
                                    {section.title.replace(/^\d+\.\s*/, "")}
                                    <ChevronRight size={15} />
                                </a>
                            ))}

                            <a href="#cancellation-contact">
                                Contact Support
                                <ChevronRight size={15} />
                            </a>
                        </nav>

                        <div className="policy-sidebar-note">
                            <Mail size={22} />

                            <strong>Need to cancel an order?</strong>

                            <p>
                                Contact our team with your order details
                                so we can review your request.
                            </p>

                            <Link to="/contact-us">
                                Contact Support
                                <ChevronRight size={15} />
                            </Link>
                        </div>
                    </aside>

                    {/* POLICY CONTENT */}
                    <article className="policy-content">
                        <div className="policy-intro">
                            <h2>Understanding Order Cancellations</h2>

                            <p>
                                We aim to make the cancellation process
                                clear and straightforward. Please review
                                the information below before submitting
                                a cancellation request.
                            </p>
                        </div>

                        {cancellationSections.map((section) => {
                            const Icon = section.icon;

                            return (
                                <section
                                    className="policy-section"
                                    id={`cancellation-${section.id}`}
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

                                        {section.id === "shipped" && (
                                            <Link
                                                to="/returns-exchanges"
                                                className="policy-inline-link"
                                            >
                                                Read Returns &amp; Exchanges
                                                <ChevronRight size={16} />
                                            </Link>
                                        )}

                                        {section.id === "online-payments" && (
                                            <Link
                                                to="/refund-policy"
                                                className="policy-inline-link"
                                            >
                                                Read Refund Policy
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
                            id="cancellation-contact"
                        >
                            <div className="policy-contact-icon">
                                <Mail size={23} />
                            </div>

                            <div>
                                <h2>Need help cancelling an order?</h2>

                                <p>
                                    If you would like to request an order
                                    cancellation, please contact our
                                    customer support team with your
                                    order number and relevant details.
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

export default CancellationPolicy;
