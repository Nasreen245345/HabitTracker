import  { useState } from 'react'
const Loginpage = (onToggle) => {
    const [formData,setFormData]=useState({email:'',password:''})
const handleSubmit=()=>{
e.preventDefault(); 
}
const handleChange=(e)=>{
    setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
    console.log(formData)
    
}
  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div className="bg-customWhite w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto flex flex-col justify-center rounded-lg gap-4 py-6 px-6 shadow-lg">
    
  
    <div className="text-center text-black font-bold font-inter text-2xl">
      Habit Tracker
    </div>
    <div className="text-center text-sm text-black">
      Welcome back to Habit Tracker
    </div>
    <form className='space-y-3 flex flex-col' onSubmit={handleSubmit}>
  
    <label className="text-black font-bold font-inter">Email</label>
    <input
     id="email"
        name="email"
                type="email"
                placeholder="Enter email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
      className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    
    <label className="text-black font-bold font-inter">Password</label>
    <input
   
    name="password"
      type="password"
      placeholder="Enter your password"
      autoComplete='current-password'
      required
      value={formData.password}
      onChange={handleChange}
      className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
</form>
   
    <button type='submit' className="bg-blue1 text-white py-2 rounded-md font-bold hover:bg-blue-200 transition-colors">
      Login
    </button>

  
    <div className="text-center text-sm">
      Don't have an account?{" "}
      <button className="text-blue1 font-bold hover:underline">
        Sign Up
      </button>
    </div>
  </div>
</div>


  )
}

export default Loginpage
