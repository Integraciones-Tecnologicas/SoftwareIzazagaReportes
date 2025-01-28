import React from 'react'

const ErrorMessage = ({children}) => {
  return (
    <p className="text-center my-4 bg-red-600 text-white font-bold uppercase text-sm ">
        {children}
    </p>
  )
}

export default ErrorMessage