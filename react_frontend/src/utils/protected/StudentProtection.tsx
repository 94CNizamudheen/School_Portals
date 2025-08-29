
import { useAppSelector } from "../../hooks/app.hooks"
import type React from "react"
import { Navigate } from "react-router-dom"


interface Props {
    allowedRoles:string[]
    children:React.ReactNode
};

const StudentProtectRoute=({allowedRoles,children}:Props)=>{
    const {isAuthenticated,role}= useAppSelector((state)=>state.auth);
    if(!isAuthenticated || !allowedRoles.includes(role||'')){
        return <Navigate to='/student/login' replace />
    }
    return <>{children}</>
}
export default StudentProtectRoute