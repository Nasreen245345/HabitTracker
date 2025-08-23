import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import LoginPage from './pages/Loginpage';
import SignupPage from './pages/Signuppage';
import Footer from './components/Footer';
import HabitTracker from './components/HabitTracker';
import Dashboard from './pages/Dashboard.jsx'
import {useAuth} from './context/AuthContext.jsx'
function App() {
  const {user}=useAuth()
  
  return (
    <div className="min-h-screen flex flex-col">
   

        <div className="mb-4">
          { user && <Navbar />}
        </div>
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/tracker" element={ user? <HabitTracker />:"Login to acces this page"} />
        <Route path='/dashboard' element={ user? <Dashboard/> :"Login to acces this page"}/>
      </Routes>
       {user && <Footer />} 
   
    
    </div>
  )
}

export default App;
