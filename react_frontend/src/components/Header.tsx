import { useEffect, useState, useRef } from "react"
import { X, Menu, User, LogOut, ChevronDown } from "lucide-react"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/authSlice"
import type { RootState } from "../store/store"
import { fetchUser } from "../store/api"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { userId, isAuthenticated,role } = useSelector((state: RootState) => state.auth)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const dispatch = useDispatch()
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getUser = async () => {
          console.log(isAuthenticated,userId,role)
      try {
        if (isAuthenticated && userId) {
          const user = await fetchUser(userId)
          console.log("user",user)
          setUserName(user.name)
          setUserEmail(user.email)
        }
      } catch (error) {
        console.error(error)
      }
    }
    getUser()
  }, [userId, isAuthenticated,role])


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

   return (
    <header className="relative bg-gradient-to-br from-purple-900 via-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold">AUP</div>
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
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-semibold">
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
                    
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100/50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={16} className="mr-3" />
                        View Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 transition-colors"
                      >
                        <LogOut size={16} className="mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              <a href="#home" className="text-white hover:text-indigo-300 py-2">Home</a>
              <a href="#academics" className="text-white hover:text-indigo-300 py-2">Academics</a>
              <a href="#activities" className="text-white hover:text-indigo-300 py-2">Activities</a>
              <a href="#about" className="text-white hover:text-indigo-300 py-2">About</a>
              <a href="#contact" className="text-white hover:text-indigo-300 py-2">Contact</a>
              
              <Link to="/portals">
                <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-semibold hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg mt-4 self-start">
                  Portals
                </button>
              </Link>
              
              {isAuthenticated && (
                <div className="pt-4 border-t border-white/20 mt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-semibold">
                      {getInitials(userName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {userName || 'User'}
                      </p>
                      <p className="text-xs text-indigo-300">
                        {userEmail || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                  <Link 
                    to="/profile" 
                    className="flex items-center text-white hover:text-indigo-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} className="mr-3" />
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center text-red-300 hover:text-red-200 py-2 w-full text-left"
                  >
                    <LogOut size={16} className="mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header