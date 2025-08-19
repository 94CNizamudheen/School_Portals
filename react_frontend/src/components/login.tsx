import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { login, userInfo } from "../store/authSlice"
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { toast } from "react-toastify"
import { jwtDecode } from "jwt-decode"
import { googleLogin } from "../store/api"
import type { RootState } from "../store/store"
import { AnimatedBorderWrapper } from "../animations/effects/AnimatedBorderWrapper"
const API = import.meta.env.VITE_BACKEND_URL
import { getLoginValidationSchema } from "..//utils/validationSchemas"
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import StudentForgotPassword from "../student/modals/ForgotPasswordModal"



const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isShowStudentForgot,setIsShowStudentForgot]= useState(false)
  const [error, setError] = useState("")

  const location = useLocation()
  const navigate = useNavigate()
  const pathName = location.pathname
  const role = pathName.split("/")[1].toUpperCase()
  const guestPathName = '/guest/login'
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const schema = getLoginValidationSchema(role);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })


  useEffect(() => {
    const validRoles = ["ADMIN", "STUDENT", "TEACHER", "PARENT", "GUEST"]
    if (!validRoles.includes(role)) {
      setError("Invalid role in URL")
    }
    // Handle Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const refresh_token = urlParams.get('refreshToken')
    const userId = urlParams.get('userId')
    const userName = urlParams.get('name')
    const userEmail = urlParams.get('email')

    if (token && userId && userName && userEmail && refresh_token) {
      dispatch(login({ access_token: token, role, userId, refresh_token }))
      dispatch(userInfo({ name: userName, email: userEmail }))
    }
  }, [role, dispatch])

  const onFormSubmit = async (data: { identifier: string; password: string }) => {
    console.log(data.password)
    try {
      const response = await axios.post(`${API}/auth/login`, {
        
        [role === "STUDENT" ? "studentIdentity" : "email"]: data.identifier,
        password: data.password,
        role,
      })

      const { access_token, userId, refresh_token, user } = response.data
      dispatch(login({ access_token, role, userId, refresh_token }))
      dispatch(userInfo({ name: user.name, email: user.email }))
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed. Please try again")
      } else {
        setError("Login failed. Please try again")
      }
    }
  }


  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google login failed")
      return;
    }
    const decoded = jwtDecode<{ email: string; name: string; sub: string }>(credentialResponse.credential)
    try {
      const { access_token, userId, user, refresh_token } = await googleLogin(
        decoded.email,
        decoded.name,
        role
      );
      dispatch(login({ access_token, role: user.role, userId, refresh_token }))
      dispatch(userInfo({ name: user.name, email: user.email }))
      navigate('/')
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      toast.error(err.response?.data.message || "Google login failed")
    }

  }
  useEffect(() => {
    if (isAuthenticated) {
      if (role === "GUEST") {
        navigate(`/`)
      } else {
        navigate(`/${role.toLowerCase()}/dashboard`)
      }

    }
  }, [isAuthenticated, role, navigate])

  const googleAllowedRoles = ["PARENT",  "TEACHER", "GUEST"];
  const isGoogleAllowed = googleAllowedRoles.includes(role);
  const handleForgotPassword=()=>{
    if(role=="STUDENT"){
      setIsShowStudentForgot(true)
    }else{
      navigate("/forgot-password");
    }
  }

  return (

    <div className="flex justify-center items-center">

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-white rounded-full animate-bounce"></div>
      </div>
      <AnimatedBorderWrapper>
        <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-700/30">
          {error && (
            <div className="bg-red-500/20 text-red-300 p-3 rounded-full mb-4 text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)} noValidate>
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-100 bg-red-400/50 px-3 py-1 rounded-md shadow-sm">
                {errors.identifier?.message}
              </p>
            )}
            <input
              type={role === "STUDENT" ? "text" : "email"}
              placeholder={role === "STUDENT" ? "Student ID" : "Your email"}
              {...register("identifier")}
              className="w-full px-6 py-4 rounded-full bg-white/90 placeholder-gray-500 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                {...register("password")}
                autoComplete="current-password"
                className="w-full px-6 py-4 rounded-full bg-white/90 placeholder-gray-500 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
              

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
             Sign In
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-400"></div>
            <span className="px-4 text-gray-300 text-sm">or</span>
            <div className="flex-1 border-t border-gray-400"></div>
          </div>

          {isGoogleAllowed && (
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  toast.error("Google Sign-in Failed")
                }}
              />
            </div>
          )}

          <div className="text-center mt-6">
            <span className="text-gray-300">Need any help? </span>
            <button
              onClick={() => navigate(`/${role.toLowerCase()}/register`)}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Help center
            </button>
          </div>

          <div className="text-center mt-6 space-y-3">
            <button
              onClick={ handleForgotPassword}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors block"
            >
              Forgot Password?
            </button>

            {pathName === guestPathName && (
              <button
                onClick={() => navigate(`/signup`)}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors block"
              >
                Sign Up
              </button>
            )}
          </div>


        </div>

      </AnimatedBorderWrapper>
      {isShowStudentForgot&&(<StudentForgotPassword isOpen={isShowStudentForgot} onClose={()=>setIsShowStudentForgot(false)}/> )}
    </div >
  )

}

export default Login