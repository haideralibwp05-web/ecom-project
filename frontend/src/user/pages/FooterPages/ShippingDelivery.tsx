
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Truck,
    PackageCheck,
    MapPin,
    Clock,
    CreditCard,
    CircleHelp,
    ChevronDown,
    MessageCircle,
    Package,
} from "lucide-react";

import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";
import "../../../style.css";
import img_1 from "../../../assets/images/delivery_img1.jpeg";
import img_2 from "../../../assets/images/delivery_img2.jpeg";
const deliverySteps = [
    {
        number: "01",
        icon: Package,
        title: "Order placed",
        description:
            "Place your order through our website and provide your correct contact and delivery details.",
    },
    {
        number: "02",
        icon: PackageCheck,
        title: "Order processing",
        description:
            "Our team prepares your order and gets it ready for dispatch.",
    },
    {
        number: "03",
        icon: Truck,
        title: "On the way",
        description:
            "Your parcel is handed over for delivery to the address provided at checkout.",
    },
    {
        number: "04",
        icon: MapPin,
        title: "Delivered",
        description:
            "Receive your order at your doorstep. Please check your parcel when it arrives.",
    },
];

const deliveryFAQs = [
    {
        question: "How long does delivery take?",
        answer:
            "Delivery time depends on your location, product availability and courier service. We recommend confirming the estimated delivery time with our team before placing an urgent order.",
    },
    {
        question: "How much is the delivery fee?",
        answer:
            "Delivery charges are displayed during checkout where applicable. Your final order total will include the delivery fee shown before you place your order.",
    },
    {
        question: "Can I change my delivery address?",
        answer:
            "If you need to correct your address, contact us as soon as possible. Changes may not be possible after your order has been dispatched.",
    },
    {
        question: "Can I track my order?",
        answer:
            "If tracking details are provided for your shipment, use the courier's tracking service to check your parcel's progress. You can also contact our support team for assistance.",
    },
    {
        question: "What if my parcel is delayed?",
        answer:
            "Courier delays can occasionally happen. Contact our support team with your order details so we can help you check the delivery status.",
    },
    {
        question: "What if I receive a damaged or incorrect item?",
        answer:
            "Please contact us as soon as possible and share your order details along with clear photos of the item and packaging. Our team will guide you through the next steps.",
    },
];

const ShippingDelivery = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(0);

    return (
        <>
            <Navbar />

            <main className="ShippingPage">
                <section className="ShippingHero">
                    <div className="ShippingHeroContent">
                        <span className="ShippingEyebrow">
                            SHIPPING & DELIVERY
                        </span>

                        <h1>
                            From our store
                            <br />
                            <span>to your doorstep.</span>
                        </h1>

                        <p>
                            Everything you need to know about order processing,
                            delivery charges, shipping updates and receiving
                            your SHOP.CO order.
                        </p>

                        <a href="#shipping-process" className="ShippingPrimaryBtn">
                            Explore delivery information
                        </a>

                        <div className="ShippingHeroNote">
                            <Truck size={19} />
                            <span>
                                Clear information. A smoother delivery experience.
                            </span>
                        </div>
                    </div>

                    <div className="ShippingHeroVisual">
                        <div className="ShippingImageFrame">
                            <img
                                src={img_1}
                                alt="Parcel prepared for delivery"
                            />
                        </div>

                        <div className="ShippingFloatingCard">
                            <div className="ShippingFloatingIcon">
                                <PackageCheck size={22} />
                            </div>
                            <div>
                                <strong>Your order, our care</strong>
                                <span>From checkout to delivery</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ShippingHighlights">
                    <article className="ShippingHighlight">
                        <div className="ShippingHighlightIcon">
                            <PackageCheck size={23} />
                        </div>
                        <div>
                            <h3>Order processing</h3>
                            <p>We prepare your order for dispatch.</p>
                        </div>
                    </article>

                    <article className="ShippingHighlight">
                        <div className="ShippingHighlightIcon">
                            <Truck size={23} />
                        </div>
                        <div>
                            <h3>Delivery updates</h3>
                            <p>Get in touch for help with your shipment.</p>
                        </div>
                    </article>

                    <article className="ShippingHighlight">
                        <div className="ShippingHighlightIcon">
                            <MessageCircle size={23} />
                        </div>
                        <div>
                            <h3>Need assistance?</h3>
                            <p>Our team can help with delivery questions.</p>
                        </div>
                    </article>
                </section>

                <section
                    className="ShippingProcessSection"
                    id="shipping-process"
                >
                    <div className="ShippingSectionHeading">
                        <span className="ShippingEyebrow">
                            HOW IT WORKS
                        </span>
                        <h2>Your order's journey</h2>
                        <p>
                            Here is what happens after you place an order on
                            SHOP.CO.
                        </p>
                    </div>

                    <div className="ShippingSteps">
                        {deliverySteps.map((step) => {
                            const StepIcon = step.icon;

                            return (
                                <article
                                    className="ShippingStep"
                                    key={step.number}
                                >
                                    <div className="ShippingStepTop">
                                        <span className="ShippingStepNumber">
                                            {step.number}
                                        </span>
                                        <div className="ShippingStepIcon">
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

                <section className="ShippingDetailsSection">
                    <div className="ShippingDetailsImage">
                        <img
                            src={img_2}
                            alt="Cardboard parcel ready for doorstep delivery"
                        />
                    </div>

                    <div className="ShippingDetailsContent">
                        <span className="ShippingEyebrow">
                            BEFORE YOUR ORDER ARRIVES
                        </span>

                        <h2>A few things to keep in mind.</h2>

                        <div className="ShippingInfoItem">
                            <div className="ShippingInfoIcon">
                                <MapPin size={21} />
                            </div>
                            <div>
                                <h3>Enter the correct address</h3>
                                <p>
                                    Double-check your full address, city,
                                    postal code and phone number at checkout.
                                </p>
                            </div>
                        </div>

                        <div className="ShippingInfoItem">
                            <div className="ShippingInfoIcon">
                                <Clock size={21} />
                            </div>
                            <div>
                                <h3>Allow time for delivery</h3>
                                <p>
                                    Delivery timelines can vary by destination,
                                    courier availability and order processing.
                                </p>
                            </div>
                        </div>

                        <div className="ShippingInfoItem">
                            <div className="ShippingInfoIcon">
                                <CreditCard size={21} />
                            </div>
                            <div>
                                <h3>Review your order total</h3>
                                <p>
                                    Check your product prices, applicable
                                    delivery charges and payment method before
                                    confirming your purchase.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ShippingFAQSection">
                    <div className="ShippingSectionHeading">
                        <span className="ShippingEyebrow">
                            QUICK ANSWERS
                        </span>
                        <h2>Shipping questions?</h2>
                        <p>
                            Find answers to common questions about receiving
                            your order.
                        </p>
                    </div>

                    <div className="ShippingAccordion">
                        {deliveryFAQs.map((faq, index) => (
                            <article
                                className={`ShippingFAQItem ${openFAQ === index ? "is-open" : ""
                                    }`}
                                key={faq.question}
                            >
                                <button
                                    type="button"
                                    className="ShippingFAQQuestion"
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
                                        className="ShippingFAQChevron"
                                    />
                                </button>

                                {openFAQ === index && (
                                    <div className="ShippingFAQAnswer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>

                    <div className="ShippingMoreQuestions">
                        <div className="ShippingMoreIcon">
                            <CircleHelp size={27} />
                        </div>
                        <div className="ShippingMoreText">
                            <h3>Still have questions?</h3>
                            <p>
                                Contact our team for help with your order or
                                delivery information.
                            </p>
                        </div>
                        <Link
                            to="/contact-us"
                            className="ShippingContactBtn"
                        >
                            Contact us
                        </Link>
                    </div>
                </section>

                <section className="ShippingBottomCTA">
                    <div>
                        <span>READY TO FIND YOUR NEXT FAVORITE?</span>
                        <h2>Good things are worth the wait.</h2>
                        <p>
                            Explore our collection and find something you love.
                        </p>
                    </div>

                    <Link to="/" className="ShippingShopBtn">
                        Shop now
                    </Link>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default ShippingDelivery;
