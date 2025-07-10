
// src/pages/NotFound.tsx

import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <motion.h1
        className="text-6xl font-bold mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        404
      </motion.h1>

      <motion.p
        className="text-xl text-gray-300 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Oops! The page you’re looking for doesn’t exist.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Go Back Home
        </Link>
      </motion.div>

      <motion.img
        src="https://illustrations.popsy.co/gray/astronaut-floating.svg"
        alt="Lost Astronaut"
        className="mt-10 w-72"
        initial={{ y: -20 }}
        animate={{ y: 20 }}
        transition={{
          repeat: Infinity,
          duration: 2,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export default NotFound
