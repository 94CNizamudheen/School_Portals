

import React from 'react'

const Spinner = () => {
return (
    <div className="flex justify-center items-center py-12">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default Spinner
