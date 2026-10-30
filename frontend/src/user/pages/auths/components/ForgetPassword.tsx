import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ForgetPasswordData } from "../../../data/ForgetPassword";
import { forgetPassword } from "../../../../services/authApi";

const ForgetPassword = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [PageCenterLoading, setPageCenterLoading] = useState(false);

    // Validation error
    const [error, setError] = useState("");

    // Success message
    const [success, setSuccess] = useState("");

    const validateEmail = () => {

        if (!email.trim()) {

            setError("Email is required.");

            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

            setError("Please enter a valid email address.");

            return false;
        }

        setError("");

        return true;
    };

    const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
) => {
    event.preventDefault();

    const isValid = validateEmail();

    if (!isValid) {
        return;
    }

    try {
        setLoading(true);
        setSuccess("");

        // API request
        await forgetPassword(email);

        // Request successful
        setLoading(false);

        setSuccess(
            "If an account with this email address exists, we will send a password reset link to your email."
        );

    } catch (error: any) {

        console.error(
            "FORGOT PASSWORD ERROR:",
            error
        );

        console.error(
            "ERROR DATA:",
            error.response?.data
        );

        // API failed → spinner 1 second
        await new Promise((resolve) =>
            setTimeout(resolve, 2000)
        );

        setLoading(false);

        // After 1 second show message
        setSuccess(
            "If an account with this email address exists, we will send a password reset link to your email."
        );
    }
};

    return (

        <main className="AuthPage">

            {/* Page Center Loading */}
            {PageCenterLoading && (
                <div className="PageLoading">
                    <span className="pageLoadingSpinner"></span>
                </div>
            )}

            <div className="AuthCard AuthCard--reset">

                {/* Header */}
                <div className="AuthHeader">

                    <h1 className="AuthPage-Heading">
                        {ForgetPasswordData.title}
                    </h1>

                   <p
                    className="authpageParagraph"
                    style={{
                        // textAlign: "center",
                        // marginTop: "20px",
                        margin:"8px 0px 15px 0px"
                    }}
                >
                    Remember your password?{" "}

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
                        Sign In
                    </button>

                </p>

                    {/* Success Message */}
                    {success && (
                        <p
                            style={{
                                color: "green",
                                fontSize: "14px",
                                marginBottom:"15px"
                            }}
                        >
                            {success}
                        </p>
                    )}

                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="AuthField">

                        <label htmlFor="email">
                            {ForgetPasswordData.emailLabel}
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder={
                                ForgetPasswordData.emailPlaceholder
                            }
                            value={email}
                            onChange={(event) => {

                                setEmail(event.target.value);

                                // Remove validation error
                                setError("");

                            }}
                            autoComplete="email"
                        />

                        {error && (
                            <p
                                style={{
                                    color: "red",
                                    fontSize: "small",
                                }}
                            >
                                {error}
                            </p>
                        )}

                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="AuthButton"
                        disabled={loading}
                    >

                        {loading ? (
                            <span className="LoadingSpinner"></span>
                        ) : (
                            ForgetPasswordData.submitLabel
                        )}

                    </button>

                </form>

                {/* Sign In */}
                

            </div>

        </main>
    );
};

export default ForgetPassword;