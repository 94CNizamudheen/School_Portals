import Login from '../../components/login'
import AuthHeader from '../../components/AuthHeader'

const AdminLogin = () => {

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center">
           
            <AuthHeader/>
            <h2 className="text-white text-3xl font-bold text-center mt-10 mb-6" >Admin Login</h2>
            <div className="px-4 w-full flex justify-center">
                <Login />
            </div>
        </div>
    )
}

export default AdminLogin
