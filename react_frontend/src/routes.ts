// src/router.tsx
import { createBrowserRouter } from "react-router-dom"
import React, { lazy } from "react"
import AdminLayout from "./admin/pages/AdminLayout"
import  ProtectedRoute from "../src/utils/protected/AdminProtection" 


// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"))
const PortalsPage = lazy(() => import("./pages/PortalsPage"))
const AdminLogin = lazy(() => import("./pages/Logins/AdminLogin"))
const StudentLogin = lazy(() => import("./pages/Logins/StudentLogin"))
const ParentLogin = lazy(() => import("./pages/Logins/ParentLogin"))
const TeacherLogin = lazy(() => import("./pages/Logins/TeacherLogin"))
const NotFound = lazy(() => import("./pages/NotFound"))
const Dashboard = lazy(() => import('./admin/pages/DashboardPage'))
const StudentPage= lazy (()=>import('./admin/pages/StudentPage'))
const AdmissionForm= lazy(()=>import('./admin/pages/AdmissionForm'))
const StudentDetailPage= lazy(()=>import("./admin/pages/StudentDeatailsPage"))
const TeacherPage= lazy(()=>import('./admin/pages/TeacherPage'))
const ParentPage= lazy(()=>import('./admin/pages/ParentPage'))
export const router = createBrowserRouter([
  { path: "/", element: React.createElement(Home) },
  { path: "/portals", element: React.createElement(PortalsPage) },
  { path: "/admin/login", element: React.createElement(AdminLogin) },
  { path: "/parent/login", element: React.createElement(ParentLogin) },
  { path: "/student/login", element: React.createElement(StudentLogin) },
  { path: "/teacher/login", element: React.createElement(TeacherLogin) },
  { path: "*", element: React.createElement(NotFound) },
{
  path: "/admin",
  element: React.createElement(
    ProtectedRoute,
    { allowedRoles: ["ADMIN"] },
    React.createElement(AdminLayout)
  ),
  children: [
    { path: "dashboard", element: React.createElement(Dashboard), },
    { path: 'students',element: React.createElement(StudentPage)},
    { path: 'student/add',element: React.createElement(AdmissionForm)},
    {path: 'students/:id',element:React.createElement(StudentDetailPage)},
    {path: 'parents/',element:React.createElement(ParentPage)},

    {path:'teachers',element:React.createElement(TeacherPage)}
  ],
}


])
