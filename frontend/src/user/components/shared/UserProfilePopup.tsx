
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import {
    getAccessToken,
    getSessionEmail,
    getSessionUsername,
    updateSessionProfile,
} from "../../../services/authSession";
import MyOrders from "./MyOrders";

interface UserProfilePopupProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

type AccountView = "menu" | "profile" | "orders";

const API_URL = "http://127.0.0.1:8000/api/auth";

const UserProfilePopup = ({
    isOpen,
    onClose,
    onLogout,
}: UserProfilePopupProps) => {
    const [accountView, setAccountView] = useState<AccountView>("menu");
    const [username, setUsername] = useState(() =>
        getSessionUsername("user")
    );
    const [email, setEmail] = useState(() => getSessionEmail("user"));

    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // Refresh the displayed account details when the popup opens.
    useEffect(() => {
        if (!isOpen) return;

        setUsername(getSessionUsername("user"));
        setEmail(getSessionEmail("user"));
        setAccountView("menu");
        setChangePasswordOpen(false);
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setMessage("");
    }, [isOpen]);

    // Load the latest profile details when Profile Settings opens.
    useEffect(() => {
        if (!isOpen || accountView !== "profile") return;

        let active = true;

        const loadProfile = async () => {
            const token = getAccessToken("user");

            if (!token) {
                setError("Your session has expired. Please sign in again.");
                return;
            }

            setLoadingProfile(true);
            setError("");
            setMessage("");

            try {
                const response = await fetch(`${API_URL}/profile/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.detail || "Could not load profile."
                    );
                }

                if (!active) return;

                const profileUsername = result.username || "";
                const profileEmail = result.email || "";

                setUsername(profileUsername);
                setEmail(profileEmail);

                updateSessionProfile(
                    "user",
                    profileUsername,
                    profileEmail
                );
            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Could not load profile."
                    );
                }
            } finally {
                if (active) {
                    setLoadingProfile(false);
                }
            }
        };

        void loadProfile();

        return () => {
            active = false;
        };
    }, [isOpen, accountView]);

    const handleUpdate = async () => {
        const token = getAccessToken("user");

        if (!token) {
            setError("Your session has expired. Please sign in again.");
            return;
        }

        setSaving(true);
        setError("");
        setMessage("");

        try {
            let endpoint: string;
            let method: string;
            let payload: Record<string, string>;

            if (changePasswordOpen) {
                if (!newPassword || !confirmPassword) {
                    throw new Error(
                        "Please fill in both password fields."
                    );
                }

                if (newPassword.length < 8) {
                    throw new Error(
                        "Password must contain at least 8 characters."
                    );
                }

                if (newPassword !== confirmPassword) {
                    throw new Error("Passwords do not match.");
                }

                endpoint = `${API_URL}/change-password/`;
                method = "POST";
                payload = {
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                };
            } else {
                if (!username.trim() || !email.trim()) {
                    throw new Error(
                        "Username and email are required."
                    );
                }

                endpoint = `${API_URL}/profile/`;
                method = "PATCH";
                payload = {
                    username: username.trim(),
                    email: email.trim(),
                };
            }

            const response = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                const details =
                    result && typeof result === "object"
                        ? Object.values(result)
                            .flat()
                            .filter(
                                (item): item is string =>
                                    typeof item === "string"
                            )
                            .join(" ")
                        : "";

                throw new Error(
                    details ||
                    result.detail ||
                    "Update failed. Please try again."
                );
            }

            if (changePasswordOpen) {
                setNewPassword("");
                setConfirmPassword("");
                setChangePasswordOpen(false);
                setMessage(
                    result.detail || "Password updated successfully."
                );
            } else {
                const updatedUsername =
                    result.username || username.trim();
                const updatedEmail = result.email || email.trim();

                setUsername(updatedUsername);
                setEmail(updatedEmail);

                updateSessionProfile(
                    "user",
                    updatedUsername,
                    updatedEmail
                );

                setMessage("Profile updated successfully.");
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleLoginAgain = () => {
        onClose();
        navigate("/signin");
    };

    if (!isOpen) return null;

    return (
        <div
            className="userProfilePopup shopAccountPanel"
            onClick={(event) => event.stopPropagation()}
        >
            {accountView === "menu" && (
                <>
                    <div className="shopAccountHeader">
                        <div>
                            <h3>My Account</h3>
                        </div>

                        <button
                            type="button"
                            className="shopAccountClose"
                            onClick={onClose}
                            aria-label="Close account panel"
                        >
                            ×
                        </button>
                    </div>

                    <div className="shopAccountWelcome">
                        <span className="shopAccountAvatar">
                            {(username || "U")
                                .charAt(0)
                                .toUpperCase()}
                        </span>

                        <div>
                            <strong>{username || "Welcome"}</strong>
                            <span>{email}</span>
                        </div>
                    </div>

                    <div className="shopAccountMenu">
                        <button
                            type="button"
                            onClick={() => {
                                setAccountView("profile");
                                setChangePasswordOpen(false);
                                setError("");
                                setMessage("");
                            }}
                        >
                            Profile Settings
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setAccountView("orders");
                                setError("");
                                setMessage("");
                            }}
                        >
                            My Orders
                        </button>
                    </div>

                    <button
                        type="button"
                        className="shopAccountLogout"
                        onClick={onLogout}
                    >
                        <span>Logout</span>
                        <LogOut size={14} />
                    </button>
                </>
            )}

            {accountView === "profile" && (
                <>
                    <div className="shopAccountHeader shopInnerHeader">
                        <button
                            type="button"
                            className="shopAccountBack"
                            onClick={() => {
                                setAccountView("menu");
                                setChangePasswordOpen(false);
                                setError("");
                                setMessage("");
                            }}
                        >
                            <span className="shopBackArrow">←</span>
                            Back to Account
                        </button>

                        <button
                            type="button"
                            className="shopAccountClose"
                            onClick={onClose}
                            aria-label="Close account panel"
                        >
                            ×
                        </button>
                    </div>

                    <div className="shopSectionHeading">
                        <h3>My Profile</h3>
                    </div>

                    {loadingProfile ? (
                        <p className="userProfileStatus">
                            Loading profile...
                        </p>
                    ) : (
                        <>
                            <div className="shopProfileField">
                                <label htmlFor="shopProfileUsername">
                                    Username
                                </label>

                                <input
                                    id="shopProfileUsername"
                                    type="text"
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                    autoComplete="username"
                                />
                            </div>

                            <div className="shopProfileField">
                                <label htmlFor="shopProfileEmail">
                                    Email Address
                                </label>

                                <input
                                    id="shopProfileEmail"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    autoComplete="email"
                                />
                            </div>

                            <button
                                type="button"
                                className="shopPasswordToggle"
                                onClick={() => {
                                    setChangePasswordOpen(
                                        (previous) => !previous
                                    );
                                    setError("");
                                    setMessage("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                }}
                                aria-expanded={changePasswordOpen}
                            >
                                <span>Change Password</span>
                                <span className="shopPasswordChevron">
                                    {changePasswordOpen ? "−" : "+"}
                                </span>
                            </button>

                            {changePasswordOpen && (
                                <div className="shopPasswordFields">
                                    <div className="shopProfileField">
                                        <label htmlFor="shopNewPassword">
                                            New Password
                                        </label>

                                        <input
                                            id="shopNewPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(event) =>
                                                setNewPassword(
                                                    event.target.value
                                                )
                                            }
                                            autoComplete="new-password"
                                            placeholder="Enter new password"
                                        />
                                    </div>

                                    <div className="shopProfileField">
                                        <label htmlFor="shopConfirmPassword">
                                            Confirm Password
                                        </label>

                                        <input
                                            id="shopConfirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(event) =>
                                                setConfirmPassword(
                                                    event.target.value
                                                )
                                            }
                                            autoComplete="new-password"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="userProfileError">
                                    <p>{error}</p>

                                    {/session|token|sign in|unauthorized|authentication/i.test(
                                        error
                                    ) && (
                                            <button
                                                type="button"
                                                className="loginAgainButton"
                                                onClick={handleLoginAgain}
                                            >
                                                Login Again
                                            </button>
                                        )}
                                </div>
                            )}

                            {message && (
                                <p className="userProfileSuccess">
                                    {message}
                                </p>
                            )}

                            <button
                                type="button"
                                className="shopProfileUpdate"
                                onClick={handleUpdate}
                                disabled={saving}
                            >
                                {saving
                                    ? "Please wait..."
                                    : changePasswordOpen
                                        ? "Update Password"
                                        : "Update Profile"}
                            </button>
                        </>
                    )}
                </>
            )}

            {accountView === "orders" && (
                <>
                    <div className="shopAccountHeader shopInnerHeader">
                        <button
                            type="button"
                            className="shopAccountBack"
                            onClick={() => setAccountView("menu")}
                        >
                            <span className="shopBackArrow">←</span>
                            Back to Account
                        </button>

                        <button
                            type="button"
                            className="shopAccountClose"
                            onClick={onClose}
                            aria-label="Close account panel"
                        >
                            ×
                        </button>
                    </div>

                    <MyOrders
                        onBack={() => setAccountView("menu")}
                    />
                </>
            )}
        </div>
    );
};

export default UserProfilePopup;