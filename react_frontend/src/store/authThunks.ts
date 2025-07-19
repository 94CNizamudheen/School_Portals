
import axios from "axios";

const API= axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    headers:{"Content-Type": "application/json",}
})

export const registerUser= async(email:string,password:string,role:string)=>{
    const response= await API.post('/auth/register',{email,password,role});
    return response.data
}
