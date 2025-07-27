
import axios, { AxiosError } from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: { "Content-Type": "application/json", }
})

export const registerUser = async (name: string, email: string, password: string, role: string) => {
    const response = await API.post('/auth/register', { name, email, password, role });
    return response.data
}
export const fetchUser = async (id: string) => {
    const response = await API.get(`/auth/${id}`)
    console.log("fetch user Response", response)
    return response.data
}
export const googleLogin = async (email: string, name: string, role: string) => {
    const response = await API.post("/auth/google-login", {
        email, name, role
    });
    return response.data;
};

export const generateOtp = async (email: string) => {
    try {
        const response = await API.post("/auth/generate-otp", { email });
        console.log(response.data)
        return response.data
        
    } catch (error) {
        const err = error as AxiosError<{ message: string }>
        throw new Error(err.response?.data.message||"Failed to generate OTP" ) 
    }
}
export const verifyOtp = async (code: string, email: string) => {
    try {
        const response = await API.post("auth/verify-otp", { code, email });
        return response.data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        throw new Error(err.response?.data.message || "Failed to verify OTP");
    }
};


export const resetPassword = async (email: string,password: string) => {
  try {
    const response = await API.post("auth/reset-password", { email,password});
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw new Error(err.response?.data.message || "Failed to reset password");
  }
};
