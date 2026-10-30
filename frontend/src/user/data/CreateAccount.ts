import type { CreateAccountData } from "../types/CreateAccount";
import google from "../../assets/icons/google.svg";
import facebook from "../../assets/icons/fb.svg";


export const createAccountData: CreateAccountData = {
  title: "Create an Account",
  signInText: "Have an Account?",
  signInLabel: "Sign In",
  usernameLabel: "Username",
  usernamePlaceholder: "Enter Username",
  emailLabel: "Email",
  emailPlaceholder: "Enter Email Address",
  passwordLabel: "Password",
  passwordPlaceholder: "Create Password",
  confirmPasswordLabel: "Confirm Password",
  confirmPasswordPlaceholder: "Confirm Password",
  submitLabel: "Create Account",
  termsPrefix: "By creating account, you agree to our",
  termsLabel: "Terms of Service",
  socialHeading: "Or create an account using:",
  googleLabel: "Continue with Google",
  google_icon: google,
  facebookLabel: "Continue with Facebook",
  facebook_icon: facebook
};
