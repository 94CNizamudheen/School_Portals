
import axios from "axios";

const API= axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    headers:{"Content-Type": "application/json",}
})

export const registerUser= async(name:string, email:string,password:string,role:string)=>{
    const response= await API.post('/auth/register',{name,email,password,role});
    return response.data
}
export const fetchUser= async(id:string)=>{
    const response= await API.get(`/auth/${id}`)
    console.log("fetch user Response",response)
    return response.data
}
