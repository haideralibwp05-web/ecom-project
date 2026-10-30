// Create Account
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/auth";

export const signupUser = async (data: {
    username: string;
    email: string;
    password: string;
    password2: string;
}) => {
    const response = await axios.post(
        `${API_URL}/signup/`,
        data
    );

    return response.data;
};


// Signin

export const loginUser = async (data: {
    username: string;
    password: string;
}) => {
    const response = await axios.post(
        `${API_URL}/login/`,
        data
    );

    return response.data;
};


// forget-password

export const forgetPassword = async (email: string) => {
    const response = await axios.post(
        `${API_URL}/forgot-password/`,
        { email }
    );

    return response.data;
};

// reset password

export const resetPassword = async (data: {
    uid: string;
    token: string;
    new_password: string;
    confirm_password: string;
}) => {
    const response = await axios.post(
        `${API_URL}/reset-password/`,
        data
    );

    return response.data;
};


