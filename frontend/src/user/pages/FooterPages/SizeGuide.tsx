import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Ruler,
    Shirt,
    CheckCircle2,
    ChevronDown,
    ArrowRight,
} from "lucide-react";

import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";
import "../../../style.css";

const sizeData = [
    { size: "XS", chest: "32–34", waist: "26–28", hips: "34–36" },
    { size: "S", chest: "35–37", waist: "29–31", hips: "37–39" },
    { size: "M", chest: "38–40", waist: "32–34", hips: "40–42" },
    { size: "L", chest: "41–43", waist: "35–37", hips: "43–45" },
    { size: "XL", chest: "44–46", waist: "38–40", hips: "46–48" },
    { size: "XXL", chest: "47–49", waist: "41–43", hips: "49–51" },
];

const measurementGuides = [
    {
        number: "01",
        title: "Chest",
        description:
            "Wrap the measuring tape around the fullest part of your chest, keeping it level under your arms.",
    },
    {
        number: "02",
        title: "Waist",
        description:
            "Measure around your natural waistline without pulling the tape too tight.",
    },
    {
        number: "03",
        title: "Hips",
        description:
            "Stand with your feet together and measure around the fullest part of your hips.",
    },
];

const faqs = [
    {
        question: "What if I am between two sizes?",
        answer:
            "If you prefer a relaxed fit, consider choosing the larger size. For a closer fit, the smaller size may suit you better.",
    },
    {
        question: "Are these measurements for the body or the garment?",
        answer:
            "This is a general body measurement guide. Actual garment measurements can vary depending on the product, cut and fabric.",
    },
    {
        question: "How should I measure myself?",
        answer:
            "Use a soft measuring tape, keep it level and measure without pulling it too tight. For the best result, ask someone to help you.",
    },
    {
        question: "Does every product have the same fit?",
        answer:
            "Not necessarily. Oversized, relaxed and slim-fit styles can fit differently. Always check the individual product details before ordering.",
    },
];

const SizeGuide = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <>
            <Navbar />

            <main className="size-guide-page">
                <section className="size-guide-hero">
                    <div className="size-guide-hero-content">
                        <span className="size-guide-eyebrow">
                            YOUR PERFECT FIT
                        </span>

                        <h1>
                            Find Your
                            <br />
                            <span>Perfect Size.</span>
                        </h1>

                        <p>
                            The right fit makes all the difference. Use our
                            size guide to find the size that feels right for you.
                        </p>

                        <a href="#size-chart" className="size-guide-button">
                            Explore Size Chart
                            <ArrowRight size={18} />
                        </a>
                    </div>

                    <div className="size-guide-hero-visual">
                        <div className="size-guide-visual-card">
                            <div className="size-guide-ruler-icon">
                                <Ruler size={34} strokeWidth={1.5} />
                            </div>

                            <span>SIZE GUIDE</span>
                            <h2>Fit that feels right.</h2>

                            <div className="size-guide-size-pills">
                                {["XS", "S", "M", "L", "XL", "XXL"].map(
                                    (size) => (
                                        <span key={size}>{size}</span>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="size-guide-floating-tag">
                            <CheckCircle2 size={18} />
                            Find your fit
                        </div>
                    </div>
                </section>

                <section
                    className="size-guide-chart-section"
                    id="size-chart"
                >
                    <div className="size-guide-section-heading">
                        <span className="size-guide-eyebrow">
                            SIZE CONVERSION
                        </span>

                        <h2>Clothing Size Chart</h2>

                        <p>
                            Use these general body measurements as a starting
                            point when selecting your size.
                        </p>
                    </div>

                    <div className="size-guide-table-wrap">
                        <table className="size-guide-table">
                            <thead>
                                <tr>
                                    <th>Size</th>
                                    <th>Chest (in)</th>
                                    <th>Waist (in)</th>
                                    <th>Hips (in)</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sizeData.map((item) => (
                                    <tr key={item.size}>
                                        <td>
                                            <span className="size-guide-size-label">
                                                {item.size}
                                            </span>
                                        </td>
                                        <td>{item.chest}</td>
                                        <td>{item.waist}</td>
                                        <td>{item.hips}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="size-guide-disclaimer">
                        Note: These are general reference measurements, not
                        verified measurements for every product. Check the
                        individual product's size information before ordering.
                    </p>
                </section>

                <section className="size-guide-measure-section">
                    <div className="size-guide-measure-intro">
                        <span className="size-guide-eyebrow">
                            MEASURE WITH CONFIDENCE
                        </span>

                        <h2>How to Measure Yourself</h2>

                        <p>
                            All you need is a soft measuring tape and a few
                            minutes to get started.
                        </p>

                        <div className="size-guide-tip">
                            <Ruler size={22} />
                            <div>
                                <strong>Quick tip</strong>
                                <p>
                                    Keep the measuring tape comfortably snug,
                                    not tight.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="size-guide-measure-list">
                        {measurementGuides.map((item) => (
                            <article
                                className="size-guide-measure-item"
                                key={item.number}
                            >
                                <span className="size-guide-measure-number">
                                    {item.number}
                                </span>

                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="size-guide-fit-section">
                    <div className="size-guide-fit-icon">
                        <Shirt size={30} strokeWidth={1.5} />
                    </div>

                    <div className="size-guide-fit-content">
                        <span className="size-guide-eyebrow">
                            BEFORE YOU ORDER
                        </span>

                        <h2>Every fit is a little different.</h2>

                        <p>
                            Oversized, regular and slim-fit clothing can feel
                            different even in the same size. Check the product
                            description and available size options to make a
                            confident choice.
                        </p>

                        <Link to="/" className="size-guide-text-link">
                            Explore Collection
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                </section>

                <section className="size-guide-faq-section">
                    <div className="size-guide-section-heading">
                        <span className="size-guide-eyebrow">
                            NEED A LITTLE HELP?
                        </span>

                        <h2>Size Guide FAQs</h2>

                        <p>
                            A few helpful answers before you choose your size.
                        </p>
                    </div>

                    <div className="size-guide-faq-list">
                        {faqs.map((faq, index) => (
                            <div
                                className={`size-guide-faq-item ${
                                    openFaq === index ? "is-open" : ""
                                }`}
                                key={faq.question}
                            >
                                <button
                                    type="button"
                                    className="size-guide-faq-question"
                                    onClick={() =>
                                        setOpenFaq(
                                            openFaq === index ? null : index
                                        )
                                    }
                                    aria-expanded={openFaq === index}
                                >
                                    <span>{faq.question}</span>

                                    <ChevronDown
                                        size={20}
                                        className="size-guide-faq-chevron"
                                    />
                                </button>

                                {openFaq === index && (
                                    <div className="size-guide-faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default SizeGuide;