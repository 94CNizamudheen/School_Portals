import axios from "axios";
const API= process.env.NEXT_PUBLIC_BACKEND_URL;

import { StudentFormData } from "@/types/student"
import { createAdmissionData } from "@/app/utils/formUtils";



const apiClient = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
})

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
})

export const checkUserAuth=async ()=>{
   const token=  localStorage.getItem('token');
   if(!token) return false;
   
   try {
    const response= await apiClient.get(`/auth/verify-token`,{
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    return response.data?.valid||false;
   } catch {
    return false;
   }
};

export const sendVerificationEmail = async (formData: StudentFormData) => {
  const admissionData = createAdmissionData(formData)
  return await apiClient.post("/students/send-verification-email", admissionData, {
    headers: getAuthHeaders(),
  })
}

// API to verify OTP
export const verifyOtp = async (email: string, code: string) => {
  return await apiClient.post( "/auth/verify-otp",
    { email, code },
    { headers: getAuthHeaders() }
  )
}

export const submitAdmission = async ( formData: StudentFormData,  verificationOtp: string | null) => {
  const admissionData = createAdmissionData(formData)
  const formDataToSend = new FormData()

  formDataToSend.append("student", JSON.stringify(admissionData.student))
  formDataToSend.append("parent", JSON.stringify(admissionData.parent))
  if (formData.profileImage) {
    formDataToSend.append("profileImage", formData.profileImage)
  }
  formDataToSend.append("verificationOtp", verificationOtp || "")

  return await axios.post(`${API}/students/admission`, formDataToSend, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  })
}

export const findAllStudent= async()=>{
  try {
    const response= await apiClient.get('/students',{
      headers:getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('failed to fetch students',error)
    throw error;
  }

}



