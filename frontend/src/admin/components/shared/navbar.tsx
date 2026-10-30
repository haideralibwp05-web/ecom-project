import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { navbarData as data } from "../../data/navbar";
import { getSessionUsername, logoutSession } from "../../../services/authSession";
import "../../../style.css";

const Navbar = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const username =
        getSessionUsername("admin") || data.profile.name;

    const firstLetter = username.charAt(0).toUpperCase();

    const handleLogout = () => {
        // Clear only the admin session
        logoutSession("admin");

        setDropdownOpen(false);

        // Return to the shared sign-in page
        navigate("/signin", { replace: true });
    };

    return (
        <nav className="adminNavbar">
            <div className="adminNavLeft">
                <div className="adminlogo">
                    <img src={data.logo.image} alt="Logo" />
                    <p>{data.logo.text}</p>
                </div>

                {/* <div className="adminNavsearch">
                    <img src={data.search.icon} alt="Search" />
                    <input
                        type="text"
                        placeholder={data.search.placeholder}
                    />
                </div> */}
            </div>

            <div className="adminNavRight">
                {/* <div className="adminNavRightIcons">
                    <button type="button">
                        <img src={data.message.icon} alt="Messages" />
                    </button>

                    <button
                        type="button"
                        className="adminNavRight_Notify"
                    >
                        <img
                            src={data.notification.icon}
                            alt="Notifications"
                        />
                        <span>{data.notification.count}</span>
                    </button>
                </div> */}

                <div className="adminProfile">
                    <button
                        type="button"
                        className="adminProfileDropdown"
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        aria-expanded={dropdownOpen}
                        aria-label="Open profile menu"
                    >
                        <span className="adminProfileAvatar">
                            {firstLetter}
                        </span>

                        <span className="adminProfileName">
                            {username}
                        </span>

                        <span className="adminProfileArrow">
                            {dropdownOpen ? "▴" : "▾"}
                        </span>
                    </button>

                    {dropdownOpen && (
                        <div className="adminProfileMenu">
                            <button
                                type="button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;