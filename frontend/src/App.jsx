import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import LoginPage from './pages/Loginpage';
import SignupPage from './pages/Signuppage';
import Footer from './components/Footer';
import HabitTracker from './components/HabitTracker';
import Dashboard from './pages/Dashboard.jsx'
import {useAuth} from './context/AuthContext.jsx'
function App() {
  const user=useAuth()
  return (
    <div className="min-h-screen flex flex-col">
    <Router>

        <div className="mb-4">
          <Navbar />
        </div>
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/tracker" element={<HabitTracker />} />
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
        <Footer />
   
    </Router>
    </div>
  )
}

export default App;
