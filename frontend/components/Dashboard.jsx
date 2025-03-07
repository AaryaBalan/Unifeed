import React from 'react'
import Navbar from './Navbar'
import Home from './card/CardList'
import { useUser } from '@clerk/clerk-react'

const Dashboard = () => {
  const {user} = useUser();
  return (
    <div className='bg-[#0b0b0e] -mt-4'>
      <Navbar/>
      {/* <p className='text-lg text-center mt-10'>Welcome </p> */}
      <Home/>
    </div>
  )
}

export default Dashboard
