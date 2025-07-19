

import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { login } from "../store/authSlice"
const API = import.meta.env.VITE_BACKEND_URL

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const pathName = location.pathname
  const role = pathName.split("/")[1].toUpperCase()
  const guesPathName = '/guest/login';
  const dispatch = useDispatch()

  useEffect(() => {
    const validRoles = ["ADMIN", "STUDENT", "TEACHER", "PARENT", "GUEST"]
    if (!validRoles.includes(role)) {
      setError("Invalid role in URL")
    }
  }, [role])

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please Enter email and Password")
      return
    }

    try {
      const response = await axios.post(`${API}/auth/signin`, {
        email,
        password,
        role,
      })

      const { access_token, userId } = response.data

      console.log(access_token, userId, role)

      dispatch(login({ access_token, role, userId }))
      setIsLoggedIn(true)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed. Please try again")
      } else {
        setError("Login failed. Please try again")
      }
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      switch (role) {
        case "ADMIN":
          navigate("/admin/dashboard")
          break
        case "STUDENT":
          navigate("/student/dashboard")
          break
        case "TEACHER":
          navigate("/teacher/dashboard")
          break
        case "PARENT":
          navigate("/parent/dashboard")
          break
        case "GUEST":
          navigate('/') 
          break
        default:
          setError("Invalid role")
      }
    }
  }, [isLoggedIn, role, navigate])

  return (
    <div className="flex justify-center items-center ">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-700/30">
        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-full mb-4 text-center">
            {error}
          </div>
        )}
        <div className="space-y-6">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 rounded-full bg-white/90 placeholder-gray-500 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Sign In
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-400"></div>
          <span className="px-4 text-gray-300 text-sm">or</span>
          <div className="flex-1 border-t border-gray-400"></div>
        </div>

        <div className="text-center">
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
            onClick={() => navigate(`/${role.toLowerCase()}/forgot-password`)}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors block"
          >
            Forgot Password?
          </button>

          {pathName === guesPathName && (
            <button
              onClick={() => navigate(`/signup`)}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors block"
            >
              Sign Up
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default Login
