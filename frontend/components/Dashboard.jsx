import React from 'react'
import Navbar from './Navbar'
import Home from './card/CardList'
import { useUser } from '@clerk/clerk-react'

const Dashboard = () => {
  const {user} = useUser();
  return (
    <div>
      <Navbar/>
      <p className='text-lg text-center mt-10'>Welcome</p>
      <Home/>
    </div>
  )
}

export default Dashboard
