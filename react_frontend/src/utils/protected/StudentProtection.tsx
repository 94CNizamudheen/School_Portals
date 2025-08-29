import type { RootState } from "../../types/store.types"; 
import type React from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"


interface Props {
    allowedRoles:string[]
    children:React.ReactNode
};

const StudentProtectRoute=({allowedRoles,children}:Props)=>{
    const {isAuthenticated,role}= useSelector((state:RootState)=>state.auth);
    if(!isAuthenticated || !allowedRoles.includes(role||'')){
        return <Navigate to='/student/login' replace />
    }
    return <>{children}</>
}
export default StudentProtectRoute