import type { EmailConfirmationTypes } from "../types/EmailConfirmation";
import EmailBox from "../assets/images/EmailBox.webp";

export const EmailConfirmationData: EmailConfirmationTypes = {
    confirmation_icon: EmailBox,
    title: "Email Sent!",

    subtitle: "We've sent a confirmation link to your email address.",

    message: "Please check your inbox to confirm your account.",

    buttonLabel: "Open Gmail",

    gmailUrl: "https://mail.google.com/mail/u/0/#inbox",


};