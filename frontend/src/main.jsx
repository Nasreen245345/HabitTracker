import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import {AuthProvider} from './context/AuthContext.jsx'
import {ThemeProvider} from './context/ThemeContext.jsx'
createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <ThemeProvider>
    <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
    </Router>
    </ThemeProvider>
  </StrictMode>,
)
