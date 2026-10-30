import type { SignInTypes } from "../types/SignIn";
import google from "../../assets/icons/google.svg";
import facebook from "../../assets/icons/fb.svg";

export const SignInData: SignInTypes = {
    title: "Sign In",

    createAccountText: "New to Our Product?",
    createAccountLabel: "Create an Account",

    usernameLabel: "Username",
    usernamePlaceholder: "Enter Username",

    passwordLabel: "Password",
    passwordPlaceholder: "Enter Password",

    keepSignedInLabel: "Keep me signed in",

    submitLabel: "Sign IN",

    forgotPasswordLabel: "Forgot your password?",

    socialHeading: "Or sign in using:",

    googleLabel: "Continue with Google",
    google_icon: google,

    facebookLabel: "Continue with Facebook",
    facebook_icon: facebook
};