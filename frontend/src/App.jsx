import React from 'react'
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from '../components/Dashboard'
import Login from '../components/Login'
import Sign from '../components/Sign'
import HeroPage from '../components/Hero'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login/>} />
        <Route path="signup" element={<Sign/>} />
        <Route path="register" element={""} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<HeroPage />} />

      </Routes>
    </Router>
  );
}

export default App
