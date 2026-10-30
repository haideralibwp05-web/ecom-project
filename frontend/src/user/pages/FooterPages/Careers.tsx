
import "../../../style.css";
import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";
import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";
import img_1 from "../../../assets/images/careerImage_1.jpeg";
import img_2 from "../../../assets/images/careerImage_2.jpeg";
import img_3 from "../../../assets/images/careerImage_3.jpeg";
const careerValues = [
    {
        number: "01",
        title: "Creative Thinking",
        description:
            "We value fresh ideas, curiosity and people who enjoy finding better ways to do things.",
        icon: "✳",
    },
    {
        number: "02",
        title: "Teamwork",
        description:
            "Great work happens when people share ideas, support each other and grow together.",
        icon: "◇",
    },
    {
        number: "03",
        title: "Keep Growing",
        description:
            "We believe learning never stops. Every challenge is an opportunity to improve.",
        icon: "◎",
    },
];

const Careers = () => {
    return (
        <>
            <Navbar />

            <main className="CareersPage">
                {/* HERO */}
                <section className="CareersHero">
                    <div className="CareersHeroContent">
                        <span className="CareersEyebrow">
                            CAREERS AT SHOP.CO
                        </span>

                        <h1>
                            Do work
                            <br />
                            <span>that moves</span>
                            <br />
                            you forward.
                        </h1>

                        <p>
                            Love fashion, fresh ideas and creating great
                            experiences? Discover the values behind SHOP.CO
                            and imagine what we could build together.
                        </p>

                        <a href="#career-opportunities" className="CareersPrimaryButton">
                            Explore Opportunities
                        </a>

                        <div className="CareersHeroNote">
                            <span className="CareersStatusDot" />
                            <span>Good ideas start with good people.</span>
                        </div>
                    </div>

                    <div className="CareersHeroVisual">
                        <img
                            src={img_1}
                            alt="Creative team collaborating at work"
                        />

                        <div className="CareersImageCaption">
                            <span>ONE TEAM.</span>
                            <strong>ENDLESS POSSIBILITIES.</strong>
                        </div>

                        <div className="CareersFloatingCard">
                            <span className="CareersFloatingIcon">✦</span>
                            <div>
                                <strong>Bring your ideas.</strong>
                                <p>Make them matter.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* INTRODUCTION */}
                <section className="CareersIntro">
                    <span className="CareersEyebrow">MORE THAN A JOB</span>

                    <h2>
                        Build your future.
                        <br />
                        <span>Bring your own perspective.</span>
                    </h2>

                    <p>
                        Fashion is always evolving, and so are the ideas
                        behind it. We believe different perspectives can
                        inspire better products, better experiences and
                        better ways of working.
                    </p>

                    <p>
                        Our goal is to create a space where creativity,
                        responsibility and a willingness to learn can
                        come together.
                    </p>
                </section>

                {/* CULTURE */}
                <section className="CareersCulture">
                    <div className="CareersCultureImage">
                        <img
                            src={img_2}
                            alt="Bright and creative workspace"
                        />
                    </div>

                    <div className="CareersCultureContent">
                        <span className="CareersEyebrow">
                            LIFE AT SHOP.CO
                        </span>

                        <h2>
                            Good work starts
                            <br />
                            with a good mindset.
                        </h2>

                        <p>
                            We believe meaningful work comes from people
                            who feel encouraged to contribute, ask questions
                            and explore new possibilities.
                        </p>

                        <p>
                            Whether you enjoy creative problem-solving,
                            organizing projects or connecting with customers,
                            there is value in the perspective you bring.
                        </p>

                        <Link to="/our-story" className="CareersTextLink">
                            Get to know our story
                        </Link>
                    </div>
                </section>

                {/* VALUES */}
                <section className="CareersValues">
                    <div className="CareersSectionHeading">
                        <span className="CareersEyebrow">
                            WHAT WE BELIEVE IN
                        </span>

                        <h2>
                            The values that
                            <br />
                            <span>move us forward.</span>
                        </h2>

                        <p>
                            The best teams are built on shared principles
                            and the freedom to bring new ideas to the table.
                        </p>
                    </div>

                    <div className="CareersValuesGrid">
                        {careerValues.map((value) => (
                            <article
                                className="CareersValueCard"
                                key={value.number}
                            >
                                <div className="CareersValueTop">
                                    <span>{value.number}</span>
                                    <span className="CareersValueIcon">
                                        {value.icon}
                                    </span>
                                </div>

                                <h3>{value.title}</h3>

                                <p>{value.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* OPPORTUNITIES */}
                <section
                    className="CareersOpportunities"
                    id="career-opportunities"
                >
                    <div className="CareersSectionHeading">
                        <span className="CareersEyebrow">
                            FIND YOUR PLACE
                        </span>

                        <h2>
                            Where could
                            <br />
                            <span>you make a difference?</span>
                        </h2>

                        <p>
                            Explore the kinds of roles that can contribute
                            to a fashion retail business. These are example
                            role categories, not confirmed vacancies.
                        </p>
                    </div>

                    <div className="CareersJobsList">
                        <article className="CareersJobCard">
                            <div className="CareersJobIcon">✳</div>

                            <div className="CareersJobInfo">
                                <span className="CareersJobCategory">
                                    CREATIVE
                                </span>
                                <h3>Graphic & Visual Design</h3>
                                <p>
                                    Help shape visual content, campaign
                                    concepts and the way a brand communicates.
                                </p>
                            </div>

                            {/* <Link
                                to="/contact-us"
                                className="CareersJobLink"
                                aria-label="Contact SHOP.CO about graphic and visual design opportunities"
                            >
                                <span>↗</span>
                            </Link> */}
                        </article>

                        <article className="CareersJobCard">
                            <div className="CareersJobIcon">⌘</div>

                            <div className="CareersJobInfo">
                                <span className="CareersJobCategory">
                                    DIGITAL
                                </span>
                                <h3>Web & E-commerce</h3>
                                <p>
                                    Contribute to online shopping experiences,
                                    website improvements and digital solutions.
                                </p>
                            </div>

                            {/* <Link
                                to="/contact-us"
                                className="CareersJobLink"
                                aria-label="Contact SHOP.CO about web and e-commerce opportunities"
                            >
                                <span>↗</span>
                            </Link> */}
                        </article>

                        <article className="CareersJobCard">
                            <div className="CareersJobIcon">♡</div>

                            <div className="CareersJobInfo">
                                <span className="CareersJobCategory">
                                    CUSTOMER EXPERIENCE
                                </span>
                                <h3>Customer Support</h3>
                                <p>
                                    Help customers navigate their shopping
                                    journey with clear, friendly communication.
                                </p>
                            </div>

                            {/* <Link
                                to="/contact-us"
                                className="CareersJobLink"
                                aria-label="Contact SHOP.CO about customer support opportunities"
                            >
                                <span>↗</span>
                            </Link> */}
                        </article>

                        <article className="CareersJobCard">
                            <div className="CareersJobIcon">
                                <Megaphone size={24} />
                            </div>

                            <div className="CareersJobInfo">
                                <span className="CareersJobCategory">
                                    MARKETING
                                </span>
                                <h3>Marketing & Content</h3>
                                <p>
                                    Explore brand storytelling, social content
                                    and ways to connect with new audiences.
                                </p>
                            </div>

                            {/* <Link
                                to="/contact-us"
                                className="CareersJobLink"
                                aria-label="Contact SHOP.CO about marketing and content opportunities"
                            >
                                <span>↗</span>
                            </Link> */}
                        </article>
                    </div>

                    <p className="CareersJobsDisclaimer">
                        Interested in one of these areas? Contact us to
                        discuss potential opportunities. Availability and
                        hiring requirements have not been confirmed.
                    </p>
                </section>

                {/* HOW TO CONNECT */}
                <section className="CareersApplication">
                    <div className="CareersApplicationContent">
                        <span className="CareersEyebrow">
                            LET'S START A CONVERSATION
                        </span>

                        <h2>
                            Have something
                            <br />
                            special to bring?
                        </h2>

                        <p>
                            Tell us about your interests, the kind of work
                            you enjoy and how you would like to contribute.
                            You can get in touch with us to ask about
                            potential opportunities.
                        </p>

                        <Link
                            to="/contact-us"
                            className="CareersPrimaryButton"
                        >
                            Contact Us
                        </Link>
                    </div>

                    <div className="CareersApplicationVisual">
                        <img
                            src={img_3}
                            alt="Team members sharing ideas"
                        />
                        <div className="CareersApplicationOverlay">
                            GREAT THINGS
                            <br />
                            START TOGETHER.
                        </div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="CareersClosing">
                    <span className="CareersEyebrow">
                        YOUR NEXT CHAPTER
                    </span>

                    <h2>
                        Let's make
                        <br />
                        something meaningful.
                    </h2>

                    <p>
                        Every great journey begins with a conversation.
                    </p>

                    <Link to="/contact-us" className="CareersClosingButton">
                        Get in Touch
                    </Link>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default Careers;
