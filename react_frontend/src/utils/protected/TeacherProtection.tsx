import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"





interface Props {
    allowedRoles:string[]
    children:React.ReactNode
};


const TeacherProtectRoute= ({allowedRoles,children}:Props)=>{
    const {isAuthenticated,role}= useSelector((state:RootState)=>state.auth);
    if(!isAuthenticated || !allowedRoles.includes(role||'')){
        return <Navigate to={'/teacher/login'}/>
    }
    return <>{children}</>
}
export default TeacherProtectRoute