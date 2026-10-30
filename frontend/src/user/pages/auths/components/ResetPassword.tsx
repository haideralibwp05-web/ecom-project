import { type FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ResetPasswordData } from "../../../data/ResetPassword";
import { resetPassword } from "../../../../services/authApi";

const ResetPassword = () => {

    const navigate = useNavigate();

    const { uid, token } = useParams<{
        uid: string;
        token: string;
    }>();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // // Success message
    const [success, setSuccess] = useState("");

    // Link error
    const [linkError, setLinkError] = useState("");

    // Validation errors
    const [errors, setErrors] = useState<{
        password?: string;
        confirmPassword?: string;
    }>({});


    // Password Validation

    const validateForm = () => {

        const newErrors: {
            password?: string;
            confirmPassword?: string;
        } = {};


        // Password validation
        if (!password) {

            newErrors.password =
                "Password is required.";

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

        return Object.keys(newErrors).length === 0;
    };


    // Submit

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();


        // Validate form
        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        // Check reset link
        if (!uid || !token) {

            setLinkError(
                "This password reset link is invalid or has expired. Please request a new password reset link."
            );

            return;
        }


        try {

            // Start spinner
            setLoading(true);
            setLinkError("");
            setSuccess("");


            // API call
            const response = await resetPassword({
                uid,
                token,
                new_password: password,
                confirm_password: confirmPassword,
            });


            // console.log(
            //     "RESET PASSWORD SUCCESS:",
            //     response
            // );


            // Spinner minimum 1 second
            // await new Promise((resolve) =>
            //     setTimeout(resolve, 1000)
            // );


            // Stop spinner
            // setLoading(false);


            // Show success message
            setSuccess(
                "Password has been reset successfully. Redirecting to Sign In..."
            );

            // Wait 1 second after success message
            setTimeout(() => {

                navigate("/signin");

            }, 1500);


        } catch (error: any) {

            console.error(
                "RESET PASSWORD ERROR:",
                error
            );

            console.error(
                "ERROR DATA:",
                error.response?.data
            );


            const errorData =
                error.response?.data;


            // Spinner minimum 1 second
            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );


            // Stop spinner
            setLoading(false);


            // Invalid / expired token
            if (errorData?.token) {

                setLinkError(
                    "This password reset link is invalid or has expired. Please request a new password reset link."
                );

            } else {

                // Other backend errors
                setLinkError(
                    errorData?.confirm_password?.[0] ||
                    errorData?.uid?.[0] ||
                    errorData?.detail ||
                    "Something went wrong."
                );
            }
        }
    };

    // UI

    return (

        <main
            className="AuthPage"
            style={{display: "flex",justifyContent: "center",alignItems: "center",minHeight: "100vh",}}>

            <section className="AuthCard AuthCard--reset-password" aria-labelledby="reset-password-title">

                {/* Header */}

                <div className="AuthHeader">

                    <h1 id="reset-password-title" className="AuthPage-Heading">
                        {ResetPasswordData.title}
                    </h1>

                    <p
                        style={{marginBottom: "25px"}} className="authpageParagraph">
                        {ResetPasswordData.subtitle}
                    </p>

                </div>


                {/* Link Error */}

                {linkError && (

                    <p
                        style={{
                            color: "red",
                            fontSize: "14px",
                            marginBottom: "15px",
                            textAlign: "center",
                        }}
                    >
                        {linkError}
                    </p>

                )}


                {/* Success Message */}

                {success && (

                    <p
                        style={{
                            color: "green",
                            fontSize: "14px",
                            marginBottom: "15px",
                            textAlign: "center",
                        }}
                    >
                        {success}
                    </p>

                )}


                {/* Form */}

                <form onSubmit={handleSubmit}>


                    {/* Password */}

                    <div className="AuthField">

                        <label htmlFor="password">

                            {ResetPasswordData.passwordLabel}

                        </label>


                        <input
                            id="password"
                            type="password"
                            placeholder={
                                ResetPasswordData.passwordPlaceholder
                            }
                            value={password}
                            onChange={(event) => {

                                setPassword(
                                    event.target.value
                                );

                                setErrors((prev) => ({
                                    ...prev,
                                    password: "",
                                }));

                                setLinkError("");

                            }}
                            autoComplete="new-password"
                            disabled={loading}
                        />


                        {errors.password && (

                            <p
                                style={{
                                    color: "red",
                                    fontSize: "small",
                                }}
                            >
                                {errors.password}
                            </p>

                        )}

                    </div>


                    {/* Confirm Password */}

                    <div className="AuthField">

                        <label htmlFor="confirmPassword">

                            {
                                ResetPasswordData.confirmPasswordLabel
                            }

                        </label>


                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder={
                                ResetPasswordData.confirmPasswordPlaceholder
                            }
                            value={confirmPassword}
                            onChange={(event) => {

                                setConfirmPassword(
                                    event.target.value
                                );

                                setErrors((prev) => ({
                                    ...prev,
                                    confirmPassword: "",
                                }));

                                setLinkError("");

                            }}
                            autoComplete="new-password"
                            disabled={loading}
                        />


                        {errors.confirmPassword && (

                            <p
                                style={{
                                    color: "red",
                                    fontSize: "small",
                                }}
                            >
                                {errors.confirmPassword}
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

                            ResetPasswordData.submitLabel

                        )}

                    </button>

                </form>

            </section>

        </main>
    );
};

export default ResetPassword;