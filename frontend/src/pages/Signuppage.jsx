import React from 'react'

const Signuppage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div className="bg-customWhite w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto flex flex-col justify-center rounded-lg gap-4 py-6 px-6 shadow-lg">
    
    
    <div className="text-center text-black font-bold font-inter text-2xl">
      Habit Tracker
    </div>
    <div className="text-center text-sm text-black">
      Welcome to Habit Tracker
    </div>
   <form className='space-y-3 flex flex-col'>
     <label className="text-black font-bold font-inter">Name</label>
    <input 
    type="text" 
    placeholder='Enter your name' 
    className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
    
    <label className="text-black font-bold font-inter">Email</label>
    <input
      type="email"
      placeholder="Enter your email"
      className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <label className="text-black font-bold font-inter">Password</label>
    <input
      type="password"
      placeholder="Enter your password"
      className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
   </form>
    
    <button className="bg-blue1 text-white py-2 rounded-md font-bold hover:bg-blue-200 transition-colors">
      Sign Up
    </button>

    <div className="text-center text-sm">
      Already have an account?{" "}
      <button className="text-blue1 font-bold hover:underline">
        Login
      </button>
    </div>
  </div>
</div>
  )
}

export default Signuppage
