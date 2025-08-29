
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutThunk } from '../store/authThunks'
import { useAppDispatch } from '../hooks/app.hooks'


type LogoutModalProps = {
  trigger: React.ReactNode
  tokenKey?: string
}

const LogoutModal: React.FC<LogoutModalProps> = ({ trigger }) => {
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
const dispatch = useAppDispatch()

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap(); 
      navigate('/portals');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <span onClick={() => setShow(true)}>{trigger}</span>

      {show && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-80 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShow(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LogoutModal
