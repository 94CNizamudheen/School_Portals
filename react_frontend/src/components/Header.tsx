import { useEffect, useState, useRef } from "react"
import { X, Menu, User, LogOut, ChevronDown, Settings, FileText, Bell, GraduationCap } from "lucide-react"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {  logout } from "../store/authSlice"
import type { RootState } from "../store/store"


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const {  isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const dispatch = useDispatch()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const name= useSelector((state:RootState)=>state.auth.userName)
  const email= useSelector((state:RootState)=>state.auth.userEmail)
  useEffect(() => {

        if (isAuthenticated ) {
          setUserName(name as string)
          setUserEmail(email as string)
        }
 
  }, [ isAuthenticated,name,email])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    setIsUserMenuOpen(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserDisplayName = () => {
    if (userName) {
      return userName.length > 15 ? `${userName.slice(0, 15)}...` : userName
    }
    return 'User'
  }

  const menuItems = [
    { icon: User, label: 'My Profile', path: '/profile' },
    { icon: FileText, label: 'My Applications', path: '/my-applications' },
    { icon: GraduationCap, label: 'New Admission', path: '/admission' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  return (
    <header className="relative bg-gradient-to-br from-purple-900 via-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              AUP
            </div>
          </div>

          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#home" className="hover:text-indigo-300 transition-colors font-medium">Home</a>
            <a href="#academics" className="hover:text-indigo-300 transition-colors font-medium">Academics</a>
            <a href="#activities" className="hover:text-indigo-300 transition-colors font-medium">Activities</a>
            <a href="#about" className="hover:text-indigo-300 transition-colors font-medium">About</a>
            <a href="#contact" className="hover:text-indigo-300 transition-colors font-medium">Contact</a>

            <Link to="/portals">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-semibold hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg ml-4">
                Portal
              </button>
            </Link>

            {isAuthenticated && (
              <div className="relative ml-4" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 hover:bg-white/20 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-semibold text-sm">
                    {getInitials(userName)}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-lg">
                          {getInitials(userName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {userName || 'User'}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {userEmail || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {menuItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={index}
                            to={item.path}
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200 group"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Icon size={18} className="mr-3 text-gray-500 group-hover:text-purple-600 transition-colors" />
                            <span className="group-hover:text-gray-900 font-medium">{item.label}</span>
                          </Link>
                        )
                      })}
                      
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                        >
                          <LogOut size={18} className="mr-3 group-hover:text-red-700" />
                          <span className="font-medium group-hover:text-red-700">Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <Link to="/guest/login">
                <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300 ml-4">
                  Sign In
                </button>
              </Link>
            )}
          </nav>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/20">
            <nav className="flex flex-col space-y-2 pt-4">
              <a href="#home" className="text-white hover:text-indigo-300 py-2 transition-colors">Home</a>
              <a href="#academics" className="text-white hover:text-indigo-300 py-2 transition-colors">Academics</a>
              <a href="#activities" className="text-white hover:text-indigo-300 py-2 transition-colors">Activities</a>
              <a href="#about" className="text-white hover:text-indigo-300 py-2 transition-colors">About</a>
              <a href="#contact" className="text-white hover:text-indigo-300 py-2 transition-colors">Contact</a>

              <Link to="/portals">
                <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-semibold hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg mt-4 self-start">
                  Portals
                </button>
              </Link>

              {isAuthenticated && (
                <div className="pt-4 border-t border-white/20 mt-4">
                  {/* Mobile User Info */}
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-white/10 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold">
                      {getInitials(userName)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {userName || 'User'}
                      </p>
                      <p className="text-xs text-indigo-300">
                        {userEmail || 'user@example.com'}
                      </p>

                    </div>
                  </div>

                  {/* Mobile Menu Items */}
                  {menuItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={index}
                        to={item.path}
                        className="flex items-center text-white hover:text-indigo-300 py-3 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon size={18} className="mr-3" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}

                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center text-red-300 hover:text-red-200 py-3 w-full text-left transition-colors mt-2 pt-4 border-t border-white/20"
                  >
                    <LogOut size={18} className="mr-3" />
                    Logout
                  </button>
                </div>
              )}

              {!isAuthenticated && (
                <Link to="/guest/login">
                  <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300 mt-2 self-start">
                    Sign In
                  </button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header