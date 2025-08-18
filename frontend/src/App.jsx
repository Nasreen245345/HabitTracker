import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import LoginPage from './pages/Loginpage';
import SignupPage from './pages/Signuppage';
import Footer from './components/Footer';
import HabitTracker from './components/HabitTracker';
import {useAuth} from './context/AuthContext.jsx'
function App() {
  const user=useAuth()
  return (
    <Router>
      <div>
        {/* {user &&<Navbar />} */}
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/tracker" element={<HabitTracker />} />
      </Routes>

      <div>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
