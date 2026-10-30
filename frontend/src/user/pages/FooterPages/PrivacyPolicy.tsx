
import { Link } from "react-router-dom";
import {
    ShieldCheck,
    LockKeyhole,
    UserRound,
    Database,
    CreditCard,
    Cookie,
    Mail,
    ChevronRight,
} from "lucide-react";

import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";
import "../../../style.css";
import { FaArrowRightLong } from "react-icons/fa6";

const policySections = [
    {
        id: "information",
        icon: UserRound,
        title: "1. Information We Collect",
        content:
            "When you create an account, place an order or contact us, you may provide information such as your name, email address, phone number, shipping address and account details. We may also collect order history and information you submit through our website forms.",
    },
    {
        id: "usage",
        icon: Database,
        title: "2. How We Use Your Information",
        content:
            "We use the information you provide to process and deliver orders, manage your account, respond to your questions, provide customer support, improve our shopping experience and help protect our website against fraud or unauthorized activity.",
    },
    {
        id: "payments",
        icon: CreditCard,
        title: "3. Payments and Order Security",
        content:
            "Your payment method and the information required to process a transaction depend on the payment option you choose. Payments handled by third-party payment providers are subject to their own privacy and security practices. Do not share your password or payment credentials with anyone.",
    },
    {
        id: "cookies",
        icon: Cookie,
        title: "4. Cookies and Website Data",
        content:
            "Our website may use browser storage or similar technologies to support features such as shopping carts, account sessions and website preferences. The technologies actually used depend on the website configuration. You can manage cookies through your browser settings, although some features may not work as expected if they are disabled.",
    },
    {
        id: "sharing",
        icon: LockKeyhole,
        title: "5. Sharing of Information",
        content:
            "We may need to share relevant information with service providers that help us operate the store, process payments, deliver orders or provide technical support. Information may also be disclosed when required by applicable law. We do not promise that information is never shared; sharing depends on the services used and applicable legal requirements.",
    },
    {
        id: "security",
        icon: ShieldCheck,
        title: "6. Data Security and Retention",
        content:
            "We take reasonable steps to protect the information entrusted to us. However, no website or electronic storage system can guarantee absolute security. We retain information for as long as reasonably necessary for order processing, account management, legal obligations and legitimate business purposes.",
    },
    {
        id: "rights",
        icon: UserRound,
        title: "7. Your Privacy Choices",
        content:
            "You can contact us to ask about the personal information associated with your account or to request a correction. Requests to access or delete information are subject to applicable law and any records we are required or permitted to retain.",
    },
    {
        id: "updates",
        icon: Database,
        title: "8. Changes to This Policy",
        content:
            "We may update this Privacy Policy when our website, services or legal obligations change. The updated version will be published on this page. Please review this page periodically to stay informed about our privacy practices.",
    },
];

const PrivacyPolicy = () => {
    return (
        <>
            <Navbar />

            <main className="policy-page">
                <section className="policy-hero">
                    <div className="policy-hero-inner">
                        <div className="policy-icon">
                            <ShieldCheck size={34} strokeWidth={1.6} />
                        </div>

                        <span className="policy-eyebrow">
                            YOUR PRIVACY MATTERS
                        </span>

                        <h1>
                            Privacy <span>Policy</span>
                        </h1>

                        <p>
                            Your trust matters to us. Learn how SHOP.CO
                            handles the information you share while shopping
                            with us.
                        </p>

                        <div className="policy-meta">
                            <span>
                                <LockKeyhole size={15} />
                                Privacy & Data Protection
                            </span>

                            <span className="policy-meta-divider" />

                            <span>Last reviewed: October 27, 2026</span>
                        </div>
                    </div>
                </section>

                <div className="policy-layout">
                    <aside className="policy-sidebar">
                        <h2>On this page</h2>

                        <nav aria-label="Privacy policy sections">
                            {policySections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#privacy-${section.id}`}
                                >
                                    {section.title.replace(/^\d+\.\s*/, "")}
                                    <ChevronRight size={15} />
                                </a>
                            ))}

                            <a href="#privacy-contact">
                                Contact Us
                                <ChevronRight size={15} />
                            </a>
                        </nav>

                        <div className="policy-sidebar-note">
                            <Mail size={20} />

                            <strong>Have a question?</strong>

                            <p>
                                Contact our team if you have a question
                                about your privacy.
                            </p>

                            <Link to="/contact-us">
                                Contact us <FaArrowRightLong />
                            </Link>
                        </div>
                    </aside>

                    <article className="policy-content">
                        <div className="policy-intro">
                            <h2>Your information, treated with care.</h2>

                            <p>
                                This Privacy Policy explains the types of
                                information that may be collected through our
                                website and how that information may be used,
                                stored and shared. It applies to information
                                provided when you browse, register, place an
                                order or contact us.
                            </p>
                        </div>

                        {policySections.map((section) => {
                            const Icon = section.icon;

                            return (
                                <section
                                    className="policy-section"
                                    id={`privacy-${section.id}`}
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
                                    </div>
                                </section>
                            );
                        })}

                        <section
                            className="policy-contact"
                            id="privacy-contact"
                        >
                            <div className="policy-contact-icon">
                                <Mail size={23} />
                            </div>

                            <div>
                                <h2>Questions about your privacy?</h2>

                                <p>
                                    If you have a question or request
                                    concerning your personal information,
                                    please get in touch with our team.
                                </p>

                                <Link to="/contact-us">
                                    Visit Contact Us
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

export default PrivacyPolicy;
