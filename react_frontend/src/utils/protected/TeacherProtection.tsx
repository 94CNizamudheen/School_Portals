
import { useAppSelector } from "../../hooks/app.hooks"
import { Navigate } from "react-router-dom"

interface Props {
    allowedRoles:string[]
    children:React.ReactNode
};

const TeacherProtectRoute= ({allowedRoles,children}:Props)=>{
    const {isAuthenticated,role}= useAppSelector((state)=>state.auth);
    if(!isAuthenticated || !allowedRoles.includes(role||'')){
        return <Navigate to={'/teacher/login'}/>
    }
    return <>{children}</>
}
export default TeacherProtectRoute