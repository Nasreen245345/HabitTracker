import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Loginpage from './pages/Loginpage'
import Signuppage from './pages/Signuppage'
import Footer from './components/Footer'
import HabitTracker from './components/HabitTracker'
function App() {
  return (
    <>
    <div className='nav'>
     <Navbar />
    </div>
     <div className='login'>
       <Loginpage />
     </div>
     <div>
      <Signuppage />
     </div>
     <div className='mb-20 mt-20'>
      <HabitTracker/>
     </div>
     <div>
      <Footer/>
     </div>
    </>
  )
}
export default App
