
import { Link } from "react-router-dom";
import Navbar from "../../components/shared/navbar";
import Footer from "../../components/shared/footer";
import "../../../style.css";
import { SiStylelint } from "react-icons/si";
import img_1 from "../../../assets/images/aboutUs_img1.jpeg";
import img_2 from "../../../assets/images/aboutUs_img2.jpeg";
import img_3 from "../../../assets/images/aboutUs_img3.jpeg";
import img_4 from "../../../assets/images/aboutUs_img4.jpeg";

const AboutUs = () => {
    return (
        <>
            <Navbar />

            <main className="AboutUsPage">
                {/* Hero */}
                <section className="AboutHero">
                    <div className="AboutHeroContent">
                        <span className="AboutEyebrow">
                            DISCOVER SHOP.CO
                        </span>

                        <h1>
                            WEAR YOUR
                            <br />
                            <span>OWN STORY.</span>
                        </h1>

                        <p>
                            Fashion is more than what you wear. It is how you
                            express yourself. Discover styles that bring
                            confidence, comfort and individuality into
                            your everyday life.
                        </p>

                        <Link to="/" className="AboutShopButton">
                            EXPLORE COLLECTION <span>↗</span>
                        </Link>

                        <div className="AboutHeroNote">
                            <span className="AboutHeroLine" />
                            <span>YOUR STYLE. YOUR IDENTITY.</span>
                        </div>
                    </div>

                    <div className="AboutHeroImage">
                        <img
                            src={img_1}
                            alt="Fashion collection and modern street style"
                        />
                        <div className="AboutImageCaption">
                            <span>01 / OUR WORLD</span>
                            <strong>STYLE THAT SPEAKS.</strong>
                        </div>
                        <div className="AboutRoundLabel">
                            SHOP.CO
                            <span>✳</span>
                        </div>
                    </div>
                </section>

                {/* Brand introduction */}
                <section className="AboutStory">
                    <div className="AboutStoryVisual">
                        <img
                            src={img_2}
                            alt="Clothing collection arranged in a fashion store"
                        />
                        <div className="AboutStoryStamp">
                            <span>EST. IN</span>
                            <strong>STYLE</strong>
                            <span>EVERY DAY</span>
                        </div>
                    </div>

                    <div className="AboutStoryContent">
                        <span className="AboutEyebrow">OUR STORY</span>

                        <h2>
                            MORE THAN
                            <br />
                            JUST WHAT
                            <br />
                            <span>YOU WEAR.</span>
                        </h2>

                        <p>
                            At SHOP.CO, we believe your clothes should feel
                            like you. Your everyday essentials, your favorite
                            looks and the pieces that make you stand out all
                            have a place in your personal style.
                        </p>

                        <p>
                            Our goal is to make discovering fashion simple
                            and enjoyable, with a shopping experience that
                            helps you explore different looks and find
                            pieces that suit your personality.
                        </p>

                        <Link to="/" className="AboutTextLink">
                            DISCOVER OUR COLLECTION <span>→</span>
                        </Link>
                    </div>
                </section>

                {/* Brand values */}
                <section className="AboutValues">
                    <div className="AboutSectionHeading">
                        <span className="AboutEyebrow">
                            THE SHOP.CO DIFFERENCE
                        </span>
                        <h2>WHAT MATTERS TO US</h2>
                        <p>
                            The little things that make your shopping
                            experience feel right.
                        </p>
                    </div>

                    <div className="AboutValuesGrid">
                        <article className="AboutValueCard">
                            <div className="AboutValueTop">
                                <span className="AboutValueIcon"><SiStylelint /></span>
                                <span className="AboutValueNumber">01</span>
                            </div>
                            <h3>EVERYDAY STYLE</h3>
                            <p>
                                Discover versatile looks for everyday moments,
                                special occasions and everything in between.
                            </p>
                            <span className="AboutValueBottom">
                                STYLE FOR EVERY DAY
                            </span>
                        </article>

                        <article className="AboutValueCard">
                            <div className="AboutValueTop">
                                <span className="AboutValueIcon">◉</span>
                                <span className="AboutValueNumber">02</span>
                            </div>
                            <h3>COMFORT & CONFIDENCE</h3>
                            <p>
                                Fashion should help you feel like yourself.
                                Find pieces that fit your lifestyle and
                                express your confidence.
                            </p>
                            <span className="AboutValueBottom">
                                FEEL GOOD. LOOK GOOD.
                            </span>
                        </article>

                        <article className="AboutValueCard">
                            <div className="AboutValueTop">
                                <span className="AboutValueIcon">✧</span>
                                <span className="AboutValueNumber">03</span>
                            </div>
                            <h3>YOUR INDIVIDUALITY</h3>
                            <p>
                                Your style has its own personality. Mix,
                                match and create looks that feel uniquely
                                yours.
                            </p>
                            <span className="AboutValueBottom">
                                MAKE IT YOURS
                            </span>
                        </article>
                    </div>
                </section>

                {/* Fashion feature */}
                <section className="AboutFeature">
                    <div className="AboutFeatureImage">
                        <img
                            src={img_3}
                            alt="Contemporary fashion and streetwear styling"
                        />
                        <div className="AboutFeatureOverlay">
                            <span>FIND YOUR FIT.</span>
                            <strong>DEFINE YOUR STYLE.</strong>
                        </div>
                    </div>

                    <div className="AboutFeatureContent">
                        <span className="AboutEyebrow">
                            MADE FOR YOUR EVERYDAY
                        </span>

                        <h2>
                            YOUR NEXT
                            <br />
                            FAVORITE LOOK
                            <br />
                            STARTS HERE.
                        </h2>

                        <p>
                            Whether you love timeless essentials or enjoy
                            experimenting with new looks, SHOP.CO is a place
                            to explore your options and build a wardrobe
                            that feels right for you.
                        </p>

                        <Link to="/" className="AboutShopButton">
                            START SHOPPING <span>↗</span>
                        </Link>

                        <div className="AboutFeatureFootnote">
                            GOOD STYLE STARTS WITH YOU.
                        </div>
                    </div>
                </section>

                {/* Closing CTA */}
                <section className="AboutClosing">
                    <div className="AboutClosingImage">
                        <img
                            src={img_4}
                            alt="Fashion editorial showcasing personal style"
                        />
                    </div>

                    <div className="AboutClosingContent">
                        <span className="AboutEyebrow">
                            THIS IS YOUR MOMENT
                        </span>

                        <h2>
                            YOUR STYLE.
                            <br />
                            YOUR RULES.
                        </h2>

                        <p>
                            Make room for new favorites. Find your look
                            and wear it your way.
                        </p>

                        <Link to="/" className="AboutClosingButton">
                            SHOP THE COLLECTION <span>→</span>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default AboutUs;
