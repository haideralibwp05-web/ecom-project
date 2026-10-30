
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    CheckCircle2,
    ChevronDown,
    CircleHelp,
    ClipboardCheck,
    MessageCircle,
    Package,
    PackageCheck,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";

import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";
import "../../../style.css";
import img_1 from "../../../assets/images/return_img1.jpeg";
import img_2 from "../../../assets/images/return_img2.jpeg";
const returnSteps = [
    {
        number: "01",
        icon: MessageCircle,
        title: "Contact our team",
        description:
            "Contact us with your order number and explain why you need a return or exchange.",
    },
    {
        number: "02",
        icon: ClipboardCheck,
        title: "Share the details",
        description:
            "Provide clear photos of the product and packaging if the item is damaged or incorrect.",
    },
    {
        number: "03",
        icon: Package,
        title: "Follow the instructions",
        description:
            "Our team will review your request and explain the next steps if it qualifies.",
    },
    {
        number: "04",
        icon: PackageCheck,
        title: "Request review",
        description:
            "Once the item and request have been reviewed, our team will discuss the available resolution with you.",
    },
];

const returnFAQs = [
    {
        question: "How do I request a return or exchange?",
        answer:
            "Contact our team through the Contact Us page. Include your order number, the reason for your request and photos where relevant. Our team will guide you through the next steps.",
    },
    {
        question: "Can I exchange an item for another size or colour?",
        answer:
            "Please contact us to discuss your request. An exchange may depend on product availability and the applicable store policy.",
    },
    {
        question: "What if I receive a damaged or incorrect product?",
        answer:
            "Contact us as soon as possible and share your order number with clear photos of the product and packaging. We will review the issue and advise you on the available options.",
    },
    {
        question: "Can I return a personalised or custom-printed product?",
        answer:
            "Custom-made and personalised products may have different eligibility rules. Contact our team if your item has a printing defect, is damaged or differs from what you ordered.",
    },
    {
        question: "How long does a return or exchange take?",
        answer:
            "The time required depends on the nature of the request, product assessment and delivery arrangements. Our team can explain the expected timeline after reviewing your case.",
    },
    {
        question: "Will I receive a refund?",
        answer:
            "Refund eligibility and the available resolution depend on the circumstances and the store's applicable policy. Contact our team before sending an item back.",
    },
    {
        question: "Who pays the return delivery charges?",
        answer:
            "Return delivery charges depend on the reason for the return and the applicable policy. Please contact our team for confirmation before arranging shipment.",
    },
];

const ReturnsExchanges = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(0);

    return (
        <>
            <Navbar />

            <main className="ReturnsPage">
                <section className="ReturnsHero">
                    <div className="ReturnsHeroContent">
                        <span className="ReturnsEyebrow">
                            RETURNS & EXCHANGES
                        </span>

                        <h1>
                            Let's make
                            <br />
                            <span>things right.</span>
                        </h1>

                        <p>
                            Need help with your order? Learn how to contact us
                            about a return, exchange, damaged item or incorrect
                            product.
                        </p>

                        <Link
                            to="/contact-us"
                            className="ReturnsPrimaryButton"
                        >
                            Request assistance
                            <ArrowRight size={18} />
                        </Link>

                        <div className="ReturnsHeroNote">
                            <ShieldCheck size={19} />
                            <span>
                                Every request is reviewed individually.
                            </span>
                        </div>
                    </div>

                    <div className="ReturnsHeroVisual">
                        <div className="ReturnsHeroImage">
                            <img
                                src={img_1}
                                alt="Preparing a parcel for a product return"
                            />
                        </div>

                        <div className="ReturnsFloatingCard">
                            <div className="ReturnsFloatingIcon">
                                <RefreshCw size={22} />
                            </div>
                            <div>
                                <strong>Here to help</strong>
                                <span>Returns and exchange support</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ReturnsHighlights">
                    <article className="ReturnsHighlight">
                        <div className="ReturnsHighlightIcon">
                            <MessageCircle size={23} />
                        </div>
                        <div>
                            <h3>Contact our team</h3>
                            <p>Tell us about your order.</p>
                        </div>
                    </article>

                    <article className="ReturnsHighlight">
                        <div className="ReturnsHighlightIcon">
                            <ClipboardCheck size={23} />
                        </div>
                        <div>
                            <h3>Request review</h3>
                            <p>Share the details for assessment.</p>
                        </div>
                    </article>

                    <article className="ReturnsHighlight">
                        <div className="ReturnsHighlightIcon">
                            <CheckCircle2 size={23} />
                        </div>
                        <div>
                            <h3>Get guidance</h3>
                            <p>Understand your available options.</p>
                        </div>
                    </article>
                </section>

                <section className="ReturnsProcessSection">
                    <div className="ReturnsSectionHeading">
                        <span className="ReturnsEyebrow">
                            HOW IT WORKS
                        </span>
                        <h2>Four steps to get help</h2>
                        <p>
                            Start by sharing your order details with our team.
                            We will guide you through the process.
                        </p>
                    </div>

                    <div className="ReturnsSteps">
                        {returnSteps.map((step) => {
                            const StepIcon = step.icon;

                            return (
                                <article
                                    className="ReturnsStep"
                                    key={step.number}
                                >
                                    <div className="ReturnsStepTop">
                                        <span className="ReturnsStepNumber">
                                            {step.number}
                                        </span>
                                        <div className="ReturnsStepIcon">
                                            <StepIcon size={25} />
                                        </div>
                                    </div>

                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="ReturnsEligibilitySection">
                    <div className="ReturnsEligibilityImage">
                        <img
                            src={img_2}
                            alt="Clothing items displayed neatly"
                        />
                    </div>

                    <div className="ReturnsEligibilityContent">
                        <span className="ReturnsEyebrow">
                            BEFORE YOU CONTACT US
                        </span>

                        <h2>Help us understand your request.</h2>

                        <p className="ReturnsEligibilityIntro">
                            A few details can help our team assess your request
                            more efficiently.
                        </p>

                        <div className="ReturnsEligibilityItem">
                            <CheckCircle2 size={21} />
                            <div>
                                <h3>Keep your order details handy</h3>
                                <p>
                                    Share your order number and the product
                                    name so we can identify your purchase.
                                </p>
                            </div>
                        </div>

                        <div className="ReturnsEligibilityItem">
                            <CheckCircle2 size={21} />
                            <div>
                                <h3>Keep the product and packaging</h3>
                                <p>
                                    If possible, keep the product, tags and
                                    original packaging until your request has
                                    been reviewed.
                                </p>
                            </div>
                        </div>

                        <div className="ReturnsEligibilityItem">
                            <CheckCircle2 size={21} />
                            <div>
                                <h3>Share clear photos when relevant</h3>
                                <p>
                                    Photos can help explain damage, printing
                                    issues or a product that differs from your
                                    order.
                                </p>
                            </div>
                        </div>

                        <div className="ReturnsPolicyNote">
                            <CircleHelp size={21} />
                            <p>
                                Return deadlines, eligibility, shipping costs
                                and refund options depend on the applicable
                                store policy. Please confirm these details with
                                our team before sending a parcel.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="ReturnsFAQSection">
                    <div className="ReturnsSectionHeading">
                        <span className="ReturnsEyebrow">
                            QUICK ANSWERS
                        </span>
                        <h2>Returns & exchanges FAQs</h2>
                        <p>
                            Have a question? Find helpful information below.
                        </p>
                    </div>

                    <div className="ReturnsAccordion">
                        {returnFAQs.map((faq, index) => (
                            <article
                                className={`ReturnsFAQItem ${openFAQ === index ? "is-open" : ""
                                    }`}
                                key={faq.question}
                            >
                                <button
                                    type="button"
                                    className="ReturnsFAQQuestion"
                                    aria-expanded={openFAQ === index}
                                    onClick={() =>
                                        setOpenFAQ(
                                            openFAQ === index ? null : index
                                        )
                                    }
                                >
                                    <span>{faq.question}</span>
                                    <ChevronDown
                                        size={20}
                                        className="ReturnsFAQChevron"
                                    />
                                </button>

                                {openFAQ === index && (
                                    <div className="ReturnsFAQAnswer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>

                    <div className="ReturnsMoreQuestions">
                        <div className="ReturnsMoreIcon">
                            <CircleHelp size={27} />
                        </div>
                        <div className="ReturnsMoreText">
                            <h3>Need help with a specific order?</h3>
                            <p>
                                Contact our team and include your order number
                                so we can help you with your request.
                            </p>
                        </div>
                        <Link
                            to="/contact-us"
                            className="ReturnsContactButton"
                        >
                            Contact us
                        </Link>
                    </div>
                </section>

                <section className="ReturnsBottomCTA">
                    <div>
                        <span>WE'RE HERE TO HELP</span>
                        <h2>Your shopping experience matters.</h2>
                        <p>
                            Get in touch with us if something isn't right with
                            your order.
                        </p>
                    </div>

                    <Link to="/contact-us" className="ReturnsShopButton">
                        Get in touch
                    </Link>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default ReturnsExchanges;
