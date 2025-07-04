import axios from "axios";


export const checkUserAuth=async ()=>{
   const token= await localStorage.getItem('token');
   if(!token) return false;
   
   try {
    const response= await axios.get('http://localhost:1994/auth/verify-token',{
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    return response.data?.valid||false;
   } catch {
    return false;
   }
}




