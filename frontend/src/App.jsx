import React from 'react'
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from '../components/Dashboard'
import Login from '../components/Login'
import Sign from '../components/Sign'
import HeroPage from '../components/Hero'
import Nav from '../components/Nav';
import Home from '../components/Home';
import Search from '../components/Search'
import SearchPage from '../components/SearchPage'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login/>} />
        <Route path="signup" element={<Sign/>} />
        <Route path="register" element={""} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<HeroPage />} />
        <Route path="/home" element={<Home />} />
        <Route path='/search' element={<SearchPage/>} />

      </Routes>
    </Router>
  );
}

export default App
