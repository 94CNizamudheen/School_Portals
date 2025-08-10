import type { RootState } from "../../store/store";
import type React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


interface Props{
    allowedRoles:string[];
    children:React.ReactNode
}

const ParentProtectRoute= ({allowedRoles,children}:Props)=>{
    const {isAuthenticated,role}= useSelector((state:RootState)=>state.auth);
    if(!isAuthenticated ||!allowedRoles.includes(role||'')){
       <Navigate to={'/parent/login'}/>
    }
    return <>{children}</>
}
export default ParentProtectRoute