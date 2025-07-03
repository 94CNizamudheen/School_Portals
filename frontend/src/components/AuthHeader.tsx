
import React from 'react'
import Link from 'next/link'
const AuthHeader = () => {
  return (
    <div className="w-full flex justify-between items-center p-6">
      <h1 className="text-white text-xl font-semibold">AUP Pathaikkara</h1>
      <Link href="/register">
        <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
          Register
        </button>
      </Link>
    </div>
  )
}

export default AuthHeader
