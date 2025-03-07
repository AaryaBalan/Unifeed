import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './components/Home';
import Demo from './components/Demo';

const App = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/demo' element={<Demo />} />
      </Routes>
    </Router>
  )
}

export default App
