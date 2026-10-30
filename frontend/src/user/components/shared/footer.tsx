import { FooterData } from "../../data/footer";
import "../../../style.css";
import { Link } from "react-router-dom";
const Footer = () => {
    const { FooterUpper, footer } = FooterData;

    return (
        <div className="Footer">

            {/* Upper Section */}

            <div className="FooterUpperSection">
                <div className="FooterUpper">
                    <h2> {FooterUpper.heading}</h2>
                    <div className="FooterInputs">
                        <div className="EmailDiv">
                            <img className="EmailIcon" src={FooterUpper.emailIcon} alt="Email" />
                            <input
                                type="email"
                                placeholder={FooterUpper.emailPlaceholder}
                                className="EmailInput"
                            />
                        </div>
                        <button className="EmailBottomBtn">{FooterUpper.subscribeText}</button>
                    </div>
                </div>
            </div>
            <section className="FooterContent">
                {/* Footer Content */}
                <div className="FooterCols">

                    {/* Column 1 */}
                    <div className="Col_1">
                        <h2>{footer.col_1.logo}</h2>

                        <p>{footer.col_1.intro}</p>

                        <div className="SocialIcons">
                            {footer.col_1.socialIcons.map((icon, index) => (
                                <a key={index}>
                                    <img src={icon.src} alt="social-icon" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="FooterCol">
                        <h4>{footer.col_2.heading}</h4>

                        {footer.col_2.links.map((item, index) => (
                            <Link to={item.url} key={index}>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Column 3 */}
                    <div className="FooterCol">
                        <h4>{footer.col_3.heading}</h4>

                        {footer.col_3.links.map((item, index) => (
                            <Link to={item.url} key={index}>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Column 4 */}
                    <div className="FooterCol">
                        <h4>{footer.col_4.heading}</h4>

                        {footer.col_4.links.map((item, index) => (
                            <Link to={item.url} key={index}>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Column 5 */}
                    <div className="FooterCol">
                        <h4>{footer.col_5.heading}</h4>

                        {footer.col_5.links.map((item, index) => (
                            <Link to={item.url} key={index}>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="FooterBorder" />

                {/* Bottom */}
                <section className="FooterBottom">
                    <p>{footer.copyRight}</p>

                    <div className="BankCards">
                        {footer.bankImgs.map((card, index) => (
                            <a key={index}>
                                <img src={card.src} alt="payment-method" />
                            </a>
                        ))}
                    </div>
                </section>
            </section>
        </div>
    );
};

export default Footer;