
import { useAppSelector } from "../../hooks/app.hooks";
import type React from "react";
import { Navigate } from "react-router-dom";


interface Props{
    allowedRoles:string[];
    children:React.ReactNode
}

const ParentProtectRoute= ({allowedRoles,children}:Props)=>{
    const {isAuthenticated,role}= useAppSelector((state)=>state.auth);
    if(!isAuthenticated ||!allowedRoles.includes(role||'')){
       <Navigate to={'/parent/login'}/>
    }
    return <>{children}</>
}
export default ParentProtectRoute