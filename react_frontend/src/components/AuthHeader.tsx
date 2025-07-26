
import { Link, useLocation } from "react-router-dom"

const AuthHeader = () => {
  const location= useLocation()
  //  const backPath = location.pathname=== "/guest/login" ? "/" : "/portals";
     const path = location.pathname.split('?')[0]
  const backPath = path === "/guest/login" ? "/" : "/portals"

  return (
    <div className="w-full flex justify-between items-center p-6">
      <h1 className="text-white text-xl font-semibold">AUP Pathaikkara</h1>
      <Link to={backPath}>
        <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
          Back
        </button>
      </Link>
    </div>
  )
}

export default AuthHeader
