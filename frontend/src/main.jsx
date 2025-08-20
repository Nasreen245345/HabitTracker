import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {HabitsProvider} from './context/HabitsContext.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import {AuthProvider} from './context/AuthContext.jsx'
createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <Router>
    <AuthProvider>
       <HabitsProvider>
      <App />
      </HabitsProvider>
    </AuthProvider>
    </Router>
  </StrictMode>,
)
