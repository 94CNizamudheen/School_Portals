import { createBrowserRouter } from "react-router-dom"
import { lazy } from "react"
import AdminLayout from "./layouts/AdminLayout.tsx"
import AdminProtectedRoute from "./utils/protected/AdminProtection.tsx"
import PrivateRoute from "./utils/protected/GuestPrivateRoute.tsx"
import RouterErrorFallback from "./components/error/RouterErrorFallback.tsx"
import StudentProtectRoute from "./utils/protected/StudentProtection.tsx"
import ParentProtectRoute from "./utils/protected/ParentProtection.tsx"
import CommonLayout from "./layouts/CommenLayout.tsx"
import TeacherProtectRoute from "./utils/protected/TeacherProtection.tsx"

const Home = lazy(() => import("./pages/Home.tsx"))
const PortalsPage = lazy(() => import("./pages/PortalsPage.tsx"))
const AdminLogin = lazy(() => import("./pages/Logins/AdminLogin.tsx"))
const StudentLogin = lazy(() => import("./pages/Logins/StudentLogin.tsx"))
const ParentLogin = lazy(() => import("./pages/Logins/ParentLogin.tsx"))
const TeacherLogin = lazy(() => import("./pages/Logins/TeacherLogin.tsx"))
const NotFound = lazy(() => import("./pages/NotFound.tsx"))
const Dashboard = lazy(() => import('./admin/pages/DashboardPage.tsx'))
const StudentPage = lazy(() => import('./admin/pages/StudentPage.tsx'))
const StudentDetailPage = lazy(() => import("./admin/pages/StudentDeatailsPage.tsx"))
const TeachersPage = lazy(() => import('./admin/pages/TeacherPage.tsx'))
const ReviewAndVerifyTeachersPage = lazy(() => import('./admin/pages/ReviewAndVerifyTeacher.tsx'))
const ParentPage = lazy(() => import('./admin/pages/ParentPage.tsx'))
const GuestLogin = lazy(() => import('./pages/Logins/GuestLogin.tsx'))
const AdmissionPage = lazy(() => import('./pages/AdmissionPage.tsx'))
const Signup = lazy(() => import('./pages/Signup.tsx'))
const AdmissionInfoPage = lazy(() => import('./admin/pages/AdmissionInfoPage.tsx'))
const MyApplications = lazy(() => import('./pages/MyApplications.tsx'))
const ForgetPassword = lazy(() => import('./pages/ForgotPasswordPage.tsx'))
const TeacherApplicationForm= lazy(()=>import('./pages/TeacherApplication.tsx'))
const TeacherDetailsPage= lazy(()=>import("./admin/pages/TeacherDetailPage.tsx"))
const StudentProfilePage= lazy(()=>import("./student/pages/StudentProfilePage.tsx"))
const StudentDashboard = lazy(()=>import("./student/pages/StudentDashboard.tsx")) ;
const ParentDashboard = lazy(()=>import('./parent/pages/ParentDashboardPage.tsx'));
const StudentParentProfile= lazy(()=>import('./parent/pages/StudentParentProfile.tsx'));
const TeacherDashboard= lazy(()=>import('./teacher/pages/TeacherrDashboard.tsx'));
const TeacherProfile = lazy(()=>import('./teacher/pages/TeacherProfile.tsx'))

export const router = createBrowserRouter([
  { path: "/", element: <Home />, errorElement: <RouterErrorFallback /> },
  { path: "/portals", element: <PortalsPage /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/parent/login", element: <ParentLogin /> },
  { path: "/student/login", element: <StudentLogin /> },
  { path: "/teacher/login", element: <TeacherLogin /> },
  { path: "/guest/login", element: <GuestLogin /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot-password", element: <ForgetPassword /> },

  {
    path: "/admission",
    element: (
      <PrivateRoute>
        <AdmissionPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/my-applications",
    element: (
      <PrivateRoute>
        <MyApplications />
      </PrivateRoute>
    ),
  },
  {
    path:'/teacher-application',
    element:(
      <PrivateRoute>
        <TeacherApplicationForm/>
      </PrivateRoute>
    )
  },

  {
    path: "/admin",
    element: (
      <AdminProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    errorElement: <RouterErrorFallback />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "students", element: <StudentPage /> },
      { path: "students/:id", element: <StudentDetailPage /> },
      { path: "parents", element: <ParentPage /> },
      { path: "teachers", element: <TeachersPage /> },
      { path: "teachers/review-and-verify", element: <ReviewAndVerifyTeachersPage /> },
      { path: "admission", element: <AdmissionInfoPage /> },
      { path: "/admin/teachers/:id", element: <TeacherDetailsPage /> },
    ],
  },
  {

  },
    {
    path:'/student',
    element:(
      <StudentProtectRoute allowedRoles={['STUDENT']} >
        <CommonLayout/>
      </StudentProtectRoute>
    ),
     errorElement: <RouterErrorFallback />,
     children:[
      {path:'dashboard',element:<StudentDashboard/>},
      {path:'profile',element:<StudentProfilePage/>}
     ]
  },
  {
    path:'/parent',
    element:(
      <ParentProtectRoute allowedRoles={["PARENT"]}>
        <CommonLayout/>
      </ParentProtectRoute>
    ),
    errorElement:<RouterErrorFallback/>,
    children:[
    {path:'dashboard',element:<ParentDashboard/>},
    {path:'student-info',element:<StudentParentProfile/>}

    ]
  },
  {
    path:'/teacher',
    element:(
      <TeacherProtectRoute allowedRoles={["TEACHER"]} >
        <CommonLayout/>
      </TeacherProtectRoute>
    ),
    errorElement:<RouterErrorFallback/>,
    children:[
      {path:'dashboard',element:<TeacherDashboard/>},
      {path:'profile',element:<TeacherProfile/>}
    ]
  },


  { path: "*", element: <NotFound /> },
])
