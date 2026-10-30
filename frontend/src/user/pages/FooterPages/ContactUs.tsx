
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";
import "../../../style.css";
import { PiPlugsConnectedDuotone } from "react-icons/pi";
import { CiShop } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";
const ContactUs = () => {
    const [formStatus, setFormStatus] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormStatus(
            "This form is not connected to a backend yet. Your message has not been sent."
        );
    };

    return (
        <>
            <Navbar />

            <main className="ContactPage">
                {/* Hero */}
                <section className="ContactHero">
                    <div className="ContactHeroContent">
                        <span className="AboutEyebrow">WE ARE HERE TO HELP</span>

                        <h1>
                            LET'S TALK
                            <br />
                            <span>ABOUT IT.</span>
                        </h1>

                        <p>
                            Have a question about your order, our products,
                            or your shopping experience? We'd love to hear
                            from you.
                        </p>

                        <a href="#ContactForm" className="AboutShopButton">
                            SEND US A MESSAGE <span>↘</span>
                        </a>
                    </div>

                    <div className="ContactHeroVisual">
                        <span className="ContactVisualNumber">01 — CONTACT</span>
                        <div className="ContactVisualCircle">
                            <span>LET'S</span>
                            <strong>CONNECT.</strong>
                            <span className="ContactVisualStar"><PiPlugsConnectedDuotone size={"52px"}/></span>
                        </div>
                        <p>GOOD CONVERSATIONS START HERE.</p>
                    </div>
                </section>

                {/* Contact Information */}
                <section className="ContactInfoSection">
                    <div className="ContactSectionHeading">
                        <span className="AboutEyebrow">GET IN TOUCH</span>
                        <h2>HOW CAN WE HELP?</h2>
                        <p>
                            Choose the best way to get in touch with our team.
                        </p>
                    </div>

                    <div className="ContactInfoGrid">
                        <article className="ContactInfoCard">
                            <span className="ContactInfoIcon">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="14"
                                        rx="2"
                                    />
                                    <path d="m4 7 8 6 8-6" />
                                </svg>
                            </span>

                            <h3>EMAIL US</h3>
                            <p>
                                Have a question? Send us a message and
                                include your order details if relevant.
                            </p>
                            <span className="ContactInfoValue">
                                Contact email coming soon
                            </span>
                        </article>

                        <article className="ContactInfoCard">
                            <span className="ContactInfoIcon">
                                <IoCallOutline />
                            </span>

                            <h3>CALL US</h3>
                            <p>
                                Need assistance? Our contact number will
                                be listed here when available.
                            </p>
                            <span className="ContactInfoValue">
                                Phone number coming soon
                            </span>
                        </article>

                        <article className="ContactInfoCard">
                            <span className="ContactInfoIcon">
                               <CiShop />
                            </span>

                            <h3>SHOP ONLINE</h3>
                            <p>
                                Explore our collections and find pieces
                                that match your personal style.
                            </p>
                            <Link to="/" className="ContactInfoLink">
                                EXPLORE SHOP <span>→</span>
                            </Link>
                        </article>
                    </div>
                </section>

                {/* Contact Form */}
                <section className="ContactFormSection" id="ContactForm">
                    <div className="ContactFormIntro">
                        <span className="AboutEyebrow">DROP US A LINE</span>

                        <h2>
                            WE'RE
                            <br />
                            LISTENING.
                        </h2>

                        <p>
                            Fill in the details and tell us how we can help.
                            For order-related questions, include your order
                            number in the message.
                        </p>

                        <div className="ContactFormNote">
                            <p>
                                A little detail goes a long way in helping
                                us understand your question.
                            </p>
                        </div>
                    </div>

                    <form className="ContactForm" onSubmit={handleSubmit}>
                        <div className="ContactFormTitle">
                            <h3>SEND A MESSAGE</h3>
                            <span>ALL FIELDS REQUIRED</span>
                        </div>

                        <div className="ContactFieldRow">
                            <label>
                                FULL NAME
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your full name"
                                    required
                                />
                            </label>

                            <label>
                                EMAIL ADDRESS
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    required
                                />
                            </label>
                        </div>

                        <label>
                            SUBJECT
                            <select name="subject" required defaultValue="">
                                <option value="" disabled>
                                    Select a topic
                                </option>
                                <option value="order">Order enquiry</option>
                                <option value="product">Product question</option>
                                <option value="delivery">Shipping & delivery</option>
                                <option value="return">Returns & exchanges</option>
                                <option value="other">Other</option>
                            </select>
                        </label>

                        <label>
                            ORDER NUMBER
                            <input
                                type="text"
                                name="orderNumber"
                                placeholder="Optional — if applicable"
                            />
                        </label>

                        <label>
                            YOUR MESSAGE
                            <textarea
                                name="message"
                                placeholder="Tell us how we can help..."
                                rows={5}
                                required
                            />
                        </label>

                        <button type="submit" className="AboutShopButton">
                            SEND MESSAGE <span>↗</span>
                        </button>

                        {formStatus && (
                            <p className="ContactFormStatus" role="status">
                                {formStatus}
                            </p>
                        )}
                    </form>
                </section>

                {/* Help CTA */}
                {/* <section className="ContactHelp">
                    <div>
                        <span className="AboutEyebrow">NEED A QUICK ANSWER?</span>
                        <h2>WE'VE GOT YOU.</h2>
                        <p>
                            Find answers to common questions about shopping,
                            orders and delivery.
                        </p>
                    </div>

                    <Link to="/faqs" className="ContactHelpButton">
                        VISIT FAQs <span>→</span>
                    </Link>
                </section> */}
            </main>

            <Footer />
        </>
    );
};

export default ContactUs;
