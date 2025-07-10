
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import type { RootState } from "@/store/store"

interface Props {
  allowedRoles: string[]
  children?: React.ReactNode
}

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth)

  if (!isAuthenticated || !allowedRoles.includes(role || "")) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
