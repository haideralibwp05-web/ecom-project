
import { type FormEvent, useState } from "react";
import { SignInData } from "../../../data/SignIn";
import { loginUser } from "../../../../services/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import { saveSession, type AuthRole } from "../../../../services/authSession";
// import { text } from "framer-motion/client";
// import { TextAlignCenter } from "lucide-react";

const SignIn = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [PageCenterLoading, setPageCenterLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    // Validation errors
    const [errors, setErrors] = useState<{
        username?: string;
        password?: string;
    }>({});

    // Validation function
    const validateForm = () => {

        const newErrors: {
            username?: string;
            password?: string;
        } = {};

        // Username validation
        if (!username.trim()) {

            newErrors.username = "Username is required.";

        } else if (username.trim().length < 3) {

            newErrors.username =
                "Username must be at least 3 characters.";

        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {

            newErrors.username =
                "Username can only contain letters, numbers and underscore.";
        }

        // Password validation
        if (!password) {

            newErrors.password =
                "Password is required.";

        } else if (password.length < 8) {

            newErrors.password =
                "Password must be at least 8 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setLoginError("");

        try {
            const response = await loginUser({
                username: username.trim(),
                password,
            });

            console.log("LOGIN SUCCESS:", response);

            // Identify account role
            const role: AuthRole =
                response.is_staff || response.is_superuser
                    ? "admin"
                    : "user";

            // Save tokens and profile to the correct session
            saveSession(role, {
                access: response.access,
                refresh: response.refresh,
                username: response.username,
                email: response.email || "",
                is_staff: response.is_staff,
                is_superuser: response.is_superuser,
            });

            // Notify user-side components only for user login
            if (role === "user") {
                window.dispatchEvent(
                    new Event("Shop.Co-user-changed")
                );
            }

            const from = location.state?.from;

            // Redirect according to account role
            if (role === "admin") {
                const adminDestination =
                    typeof from === "string" &&
                        (from === "/admin" || from.startsWith("/admin/"))
                        ? from
                        : "/admin/";

                navigate(adminDestination, { replace: true });
            } else {
                const userDestination =
                    typeof from === "string" &&
                        from.startsWith("/") &&
                        !from.startsWith("//") &&
                        !from.startsWith("/admin")
                        ? from
                        : "/";

                navigate(userDestination, { replace: true });
            }
        } catch (error: any) {
            console.error("LOGIN ERROR:", error);

            setLoginError(
                error.response?.data?.non_field_errors?.[0] ||
                error.response?.data?.detail ||
                "Invalid username or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="AuthPage">
            {PageCenterLoading && (
                <div className="PageLoading">
                    <span className="pageLoadingSpinner"></span>
                </div>
            )}

            <section className="AuthCard AuthCard--signin">

                {/* Header */}
                <div className="AuthHeader">

                    <h1 className="AuthPage-Heading">
                        {SignInData.title}
                    </h1>

                    <p className="authpageParagraph">
                        {SignInData.createAccountText}{" "}

                        <button
                            type="button"
                            className="AuthLink"
                            onClick={() => {
                                setPageCenterLoading(true);

                                setTimeout(() => {
                                    navigate("/create-account");
                                }, 500);
                            }}
                        >
                            {/* <Link to="/create-account"> */}
                            {SignInData.createAccountLabel}
                            {/* </Link> */}
                        </button>

                    </p>

                    {loginError && (
                        <p className="AuthError" style={{ color: "red", fontSize: "14px", marginBottom: "10px", textAlign: "center", }}>
                            {loginError}
                        </p>
                    )}

                </div>

                {/* Form */}
                <form
                    className="AuthForm"
                    onSubmit={handleSubmit}
                >

                    {/* Username */}
                    <div className="AuthField">

                        <label htmlFor="username">
                            {SignInData.usernameLabel}
                        </label>

                        <input
                            id="username"
                            type="text"
                            placeholder={SignInData.usernamePlaceholder}
                            value={username}
                            onChange={(event) => {

                                setUsername(event.target.value);

                                setErrors((prev) => ({
                                    ...prev,
                                    username: "",
                                }));

                            }}
                            autoComplete="off"
                        />

                        {errors.username && (
                            <p className="AuthError" style={{ color: "red", fontSize: "small" }}>
                                {errors.username}
                            </p>
                        )}

                    </div>

                    {/* Password */}
                    <div className="AuthField">

                        <label htmlFor="password">
                            {SignInData.passwordLabel}
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder={SignInData.passwordPlaceholder}
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

                    {/* Remember Me */}
                    <div className="AuthRemember AuthField">

                        <input
                            type="checkbox"
                            id="remember"
                            checked={keepSignedIn}
                            onChange={(event) =>
                                setKeepSignedIn(
                                    event.target.checked
                                )
                            }
                        />

                        <label htmlFor="remember" style={{ marginBottom: "0" }}>
                            {SignInData.keepSignedInLabel}
                        </label>

                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="AuthButton"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="LoadingSpinner"></span>
                        ) : (
                            SignInData.submitLabel
                        )}
                    </button>

                </form>

                {/* Forgot Password */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                        type="button"
                        className="AuthLink"
                        style={{ textAlign: "center" }}
                        onClick={() => {
                            setPageCenterLoading(true);

                            setTimeout(() => {
                                navigate("/forget-password");
                            }, 500);
                        }}
                    >
                        {SignInData.forgotPasswordLabel}
                    </button>
                </div>

                <div className="AuthDivider" />

                {/* Social */}
                <p className="authpageParagraph" style={{ margin: "0px 0px 24px 0px" }}>
                    {SignInData.socialHeading}
                </p>

                <div className="AuthSocialButtons">

                    <button
                        type="button"
                        className="AuthSocialButton"
                    >

                        <img
                            src={SignInData.google_icon}
                            alt="Google"
                            className="AuthSocialIcon"
                        />

                        <span>
                            {SignInData.googleLabel}
                        </span>

                    </button>

                    <button
                        type="button"
                        className="AuthSocialButton"
                    >

                        <img
                            src={SignInData.facebook_icon}
                            alt="Facebook"
                            className="AuthSocialIcon"
                        />

                        <span>
                            {SignInData.facebookLabel}
                        </span>

                    </button>

                </div>

            </section>

        </main>
    );
};

export default SignIn;


