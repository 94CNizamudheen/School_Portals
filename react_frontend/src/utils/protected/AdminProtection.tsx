
import { useAppSelector } from "../../hooks/app.hooks"
import { Navigate } from "react-router-dom"


interface Props {
  allowedRoles: string[]
  children?: React.ReactNode
}

const AdminProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { isAuthenticated, role } = useAppSelector((state) => state.auth)

  if (!isAuthenticated || !allowedRoles.includes(role || "")) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export default AdminProtectedRoute
