
import { type FormEvent, useState } from "react";
import { createAccountData as data } from "../../../data/CreateAccount";
import { signupUser } from "../../../../services/authApi";
import { Link, useNavigate } from "react-router-dom";
import "../../../../style.css";
const CreateAccount = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [PageCenterLoading, setPageCenterLoading] = useState(false);

    // Validation errors
    const [errors, setErrors] = useState<{
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const validateForm = () => {
        const newErrors: {
            username?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        // Username validation
        if (!username.trim()) {
            newErrors.username = "Username is required.";
        } else if (username.trim().length < 3) {
            newErrors.username = "Username must be at least 3 characters.";
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            newErrors.username =
                "Username can only contain letters, numbers and underscore.";
        }

        // Email validation
        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            newErrors.email = "Please enter a valid email address.";
        }

        // Password validation
        if (!password) {
            newErrors.password = "Password is required.";
        } else if (password.length < 8) {
            newErrors.password =
                "Password must be at least 8 characters.";
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password =
                "Password must contain at least one uppercase letter.";
        } else if (!/[a-z]/.test(password)) {
            newErrors.password =
                "Password must contain at least one lowercase letter.";
        } else if (!/[0-9]/.test(password)) {
            newErrors.password =
                "Password must contain at least one number.";
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword =
                "Please confirm your password.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword =
                "Passwords do not match.";
        }

        setErrors(newErrors);

        // true = form valid
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validate form before API call
        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        try {
            setLoading(true);

            const response = await signupUser({
                username,
                email,
                password,
                password2: confirmPassword,
            });

            console.log("Signup response:", response);

            setErrors({});

            setTimeout(() => {
                navigate("/signin");
            }, 500);

        } catch (error: any) {

            console.log("FULL ERROR:", error);
            console.log("ERROR MESSAGE:", error.message);
            console.log("ERROR RESPONSE:", error.response);
            console.log("ERROR DATA:", error.response?.data);

            setLoading(false);

            const errorData = error.response?.data;

            setErrors({
                username: errorData?.username?.[0] || "",
                email: errorData?.email?.[0] || "",
                password: errorData?.password?.[0] || "",
                confirmPassword: errorData?.password2?.[0] || "",
            });
        }
    };

    return (
        <main
            className="AuthPage">
            {PageCenterLoading && (
                <div className="PageLoading">
                    <span className="pageLoadingSpinner"></span>
                </div>
            )}

            <div
                className="AuthCard AuthCard--signup"
                aria-labelledby="create-account-title"
            >

                {/* Header */}
                <div className="AuthHeader">

                    <h1 id="create-account-title" className="AuthPage-Heading">
                        {data.title}
                    </h1>

                    <p className="authpageParagraph">
                        {data.signInText}{" "}

                        <button
                            type="button"
                            className="AuthLink"
                            onClick={() => {
                                setPageCenterLoading(true);

                                setTimeout(() => {
                                    navigate("/signin");
                                }, 500);
                            }}
                        >
                            {/* <Link to="/signin"> */}
                            {data.signInLabel}
                            {/* </Link> */}
                        </button>
                    </p>

                </div>

                {/* Form */}
                <form
                    className="AuthForm"
                    onSubmit={handleSubmit}
                >

                    {/* Username */}
                    <div className="AuthField">

                        <label htmlFor="username">
                            {data.usernameLabel}
                        </label>

                        <input
                            id="username"
                            type="text"
                            placeholder={data.usernamePlaceholder}
                            value={username}
                            onChange={(event) => {
                                setUsername(event.target.value);

                                setErrors((prev) => ({
                                    ...prev,
                                    username: "",
                                }));
                            }}
                            autoComplete="username"
                        />

                        {errors.username && (
                            <p className="AuthError" style={{ color: "red", fontSize: "small" }}>
                                {errors.username}
                            </p>
                        )}

                    </div>

                    {/* Email */}
                    <div className="AuthField">

                        <label htmlFor="email">
                            {data.emailLabel}
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder={data.emailPlaceholder}
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);

                                setErrors((prev) => ({
                                    ...prev,
                                    email: "",
                                }));
                            }}
                            autoComplete="email"
                        />

                        {errors.email && (
                            <p className="AuthError" style={{ color: "red", fontSize: "small" }}>
                                {errors.email}
                            </p>
                        )}

                    </div>

                    {/* Password */}
                    <div className="AuthField">

                        <label htmlFor="password">
                            {data.passwordLabel}
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder={data.passwordPlaceholder}
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);

                                setErrors((prev) => ({
                                    ...prev,
                                    password: "",
                                }));
                            }}
                            autoComplete="new-password"
                        />

                        {errors.password && (
                            <p className="AuthError" style={{ color: "red", fontSize: "small" }}>
                                {errors.password}
                            </p>
                        )}

                    </div>

                    {/* Confirm Password */}
                    <div className="AuthField">

                        <label htmlFor="confirmPassword">
                            {data.confirmPasswordLabel}
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder={data.confirmPasswordPlaceholder}
                            value={confirmPassword}
                            onChange={(event) => {
                                setConfirmPassword(event.target.value);

                                setErrors((prev) => ({
                                    ...prev,
                                    confirmPassword: "",
                                }));
                            }}
                            autoComplete="new-password"
                        />

                        {errors.confirmPassword && (
                            <p className="AuthError" style={{ color: "red", fontSize: "small" }}>
                                {errors.confirmPassword}
                            </p>
                        )}

                    </div>

                    {/* Button */}
                    <button
                        className="AuthButton"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="LoadingSpinner"></span>
                        ) : (
                            data.submitLabel
                        )}
                    </button>

                </form>

                {/* Terms */}
                <p className="authpageParagraph" style={{ fontSize: "14px", lineHeight: "20px", marginBottom: "0" }}>

                    {data.termsPrefix}

                    <br />

                    <button
                        type="button"
                        className="AuthLink AuthTermsLink"
                    >
                        {data.termsLabel}
                    </button>

                </p>

                <div className="AuthDivider" />

                {/* Social */}
                <p className="authpageParagraph" style={{ margin: "0px 0px 24px 0px" }}>
                    {data.socialHeading}
                </p>

                <div className="AuthSocialButtons">

                    <button
                        type="button"
                        className="AuthSocialButton"
                    >

                        <img
                            src={data.google_icon}
                            alt="Google"
                            className="AuthSocialIcon"
                        />

                        <span>
                            {data.googleLabel}
                        </span>

                    </button>

                    <button
                        type="button"
                        className="AuthSocialButton"
                    >

                        <img
                            src={data.facebook_icon}
                            alt="Facebook"
                            className="AuthSocialIcon"
                        />

                        <span>
                            {data.facebookLabel}
                        </span>

                    </button>

                </div>

            </div>

        </main>
    );
};

export default CreateAccount;
