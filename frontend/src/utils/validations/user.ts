// Address details of checkout page

export interface CustomerDetails {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    postalCode: string;
    address: string;
    notes: string;
}

export type CheckoutErrors = Partial<
    Record<keyof CustomerDetails, string>
>;

export const validateCheckout = (
    data: CustomerDetails
): CheckoutErrors => {
    const errors: CheckoutErrors = {};

    if (!data.fullName.trim()) {
        errors.fullName = "Full name is required.";
    } else if (data.fullName.trim().length < 3) {
        errors.fullName = "Enter at least 3 characters.";
    }

    if (!data.phone.trim()) {
        errors.phone = "Phone number is required.";
    } else if (!/^03[0-9]{9}$/.test(data.phone.trim())) {
        errors.phone = "Enter a valid 11-digit Pakistani number.";
    }

    if (!data.email.trim()) {
        errors.email = "Email address is required.";
    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
    ) {
        errors.email = "Enter a valid email address.";
    }

    if (!data.city.trim()) {
        errors.city = "City is required.";
    }

    if (!data.postalCode.trim()) {
        errors.postalCode = "Postal code is required.";
    } else if (!/^[0-9]{5}$/.test(data.postalCode.trim())) {
        errors.postalCode = "Enter a valid 5-digit postal code.";
    }

    if (!data.address.trim()) {
        errors.address = "Complete address is required.";
    } else if (data.address.trim().length < 10) {
        errors.address = "Address must contain at least 10 characters.";
    }

    return errors;
};

export const isCheckoutValid = (
    data: CustomerDetails
): boolean => {
    return Object.keys(validateCheckout(data)).length === 0;
};

