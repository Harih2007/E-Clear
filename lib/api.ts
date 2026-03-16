import axios from "axios";

// Create Axios Instance
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to inject Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Helper for handling errors
export const handleApiError = (error: any) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.error || "An error occurred";
    }
    return "An unexpected error occurred";
};
