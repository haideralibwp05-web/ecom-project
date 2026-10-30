import "../../../style.css";
import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import img_1 from "../../../assets/images/storyImage_1.jpeg";
import img_2 from "../../../assets/images/storyImage_2.jpeg";
import img_3 from "../../../assets/images/storyImage_3.jpeg";
const OurStory = () => {
    return (
        <>
            <Navbar />

            <main className="OurStoryPage">

                {/* HERO SECTION */}
                <section className="OurStoryHero">
                    <div className="OurStoryHeroContent">
                        <span className="OurStoryEyebrow">
                            MORE THAN JUST FASHION
                        </span>

                        <h1>
                            Our story.
                            <br />
                            <span>Our identity.</span>
                        </h1>

                        <p>
                            Every style has a story. Every outfit says
                            something about you. We believe fashion is more
                            than what you wear — it is a way to express who
                            you are.
                        </p>

                        <Link to="/products" className="OurStoryButton">
                            Explore Collection <FaArrowRightLong />
                        </Link>
                    </div>

                    <div className="OurStoryHeroImage">
                        <img
                            src={img_1}
                            alt="Modern fashion and personal style"
                        />

                        <div className="OurStoryImageLabel">
                            <span>YOUR STYLE.</span>
                            <strong>YOUR STORY.</strong>
                        </div>
                    </div>
                </section>

                {/* INTRODUCTION */}
                <section className="OurStoryIntro">
                    <span className="OurStoryEyebrow">
                        WHO WE ARE
                    </span>

                    <h2>
                        Fashion is personal.
                        <br />
                        <span>Your style should be too.</span>
                    </h2>

                    <p>
                        We believe the best style is the one that feels
                        naturally yours. It does not need to follow every
                        trend or fit into someone else's idea of fashion.
                        It simply needs to represent you.
                    </p>

                    <p>
                        Our Story is about the idea behind SHOP.CO — creating
                        a shopping experience where discovering your style
                        feels simple, inspiring and enjoyable.
                    </p>
                </section>

                {/* OUR PHILOSOPHY */}
                <section className="OurStoryPhilosophy">
                    <div className="OurStoryPhilosophyImage">
                        <img
                            src={img_2}
                            alt="Friends enjoying fashion together"
                        />
                    </div>

                    <div className="OurStoryPhilosophyContent">
                        <span className="OurStoryEyebrow">
                            OUR PHILOSOPHY
                        </span>

                        <h2>
                            Wear what you love.
                            <br />
                            Be who you are.
                        </h2>

                        <p>
                            Style is not about impressing everyone. It is
                            about finding pieces that make you feel
                            comfortable, confident and true to yourself.
                        </p>

                        <p>
                            From everyday essentials to statement looks,
                            fashion should give you the freedom to
                            experiment, discover and create your own
                            identity.
                        </p>

                        <p>
                            That is the feeling we want every visit to
                            SHOP.CO to inspire.
                        </p>

                        <Link to="/products" className="OurStoryTextLink">
                            Find your style <FaArrowRightLong />
                        </Link>
                    </div>
                </section>

                {/* WHAT MATTERS TO US */}
                <section className="OurStoryValues">
                    <div className="OurStorySectionHeading">
                        <span className="OurStoryEyebrow">
                            WHAT MATTERS TO US
                        </span>

                        <h2>
                            The values behind
                            <br />
                            <span>every choice.</span>
                        </h2>

                        <p>
                            The shopping experience we want to create starts
                            with a few simple principles.
                        </p>
                    </div>

                    <div className="OurStoryValuesGrid">
                        <article className="OurStoryValueCard">
                            <span className="OurStoryValueNumber">01</span>
                            <div className="OurStoryValueIcon">✳</div>

                            <h3>Individuality</h3>

                            <p>
                                Your style belongs to you. We celebrate
                                different tastes and encourage you to find
                                the looks that express your personality.
                            </p>
                        </article>

                        <article className="OurStoryValueCard">
                            <span className="OurStoryValueNumber">02</span>
                            <div className="OurStoryValueIcon">◇</div>

                            <h3>Simplicity</h3>

                            <p>
                                Finding something you love should feel
                                straightforward. We aim to make browsing
                                collections and discovering products easy.
                            </p>
                        </article>

                        <article className="OurStoryValueCard">
                            <span className="OurStoryValueNumber">03</span>
                            <div className="OurStoryValueIcon">♡</div>

                            <h3>Confidence</h3>

                            <p>
                                The right outfit can help you feel like
                                yourself. We want fashion to be a source of
                                confidence, comfort and self-expression.
                            </p>
                        </article>
                    </div>
                </section>

                {/* THE SHOPPING EXPERIENCE */}
                <section className="OurStoryExperience">
                    <div className="OurStoryExperienceContent">
                        <span className="OurStoryEyebrow">
                            THE SHOP.CO EXPERIENCE
                        </span>

                        <h2>
                            Discover pieces.
                            <br />
                            Create your look.
                            <br />
                            <span>Make it yours.</span>
                        </h2>

                        <p>
                            We want your journey to feel just as good as
                            finding something you love. Explore different
                            styles, discover new favourites and build looks
                            that work for your everyday life.
                        </p>

                        <ul>
                            <li>
                                <span>✓</span>
                                Discover styles for different occasions
                            </li>
                            <li>
                                <span>✓</span>
                                Explore products in one convenient place
                            </li>
                            <li>
                                <span>✓</span>
                                Choose looks that reflect your personality
                            </li>
                        </ul>

                        <Link to="/products" className="OurStoryButton">
                            Start Exploring <FaArrowRightLong />
                        </Link>
                    </div>

                    <div className="OurStoryExperienceImage">
                        <img
                            src={img_3}
                            alt="Fashion collection and wardrobe inspiration"
                        />
                    </div>
                </section>

                {/* OUR PROMISE */}
                <section className="OurStoryPromise">
                    <div className="OurStoryPromiseInner">
                        <span className="OurStoryEyebrow">
                            OUR PROMISE
                        </span>

                        <h2>
                            Your wardrobe.
                            <br />
                            Your rules.
                        </h2>

                        <p>
                            We want SHOP.CO to be a place where you can
                            explore, experiment and discover fashion on
                            your own terms. Whatever your style looks like,
                            there is room for you here.
                        </p>

                        <Link to="/products" className="OurStoryPromiseButton">
                            Find Your Next Favourite
                        </Link>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="OurStoryClosing">
                    <div>
                        <span className="OurStoryEyebrow">
                            YOUR STORY STARTS HERE
                        </span>

                        <h2>
                            Ready to find
                            <br />
                            your next favourite?
                        </h2>

                        <p>
                            Explore the collection and make every look
                            your own.
                        </p>
                    </div>

                    <Link to="/products" className="OurStoryButton">
                        Shop Now  <FaArrowRightLong />
                    </Link>
                </section>

            </main>

            <Footer />
        </>
    );
};

export default OurStory;