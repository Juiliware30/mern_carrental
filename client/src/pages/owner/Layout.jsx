import React from 'react'
import NavBarOwner from '../../components/owner/NavBarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet, Navigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import AdminLogin from './AdminLogin'

const Layout = () => {
  const { isOwner, user, token } = useAppContext()
  const localToken = localStorage.getItem('token')
  const isOwnerAuthenticated = localStorage.getItem('ownerAuthenticated')

  // If no owner authentication flag, show the admin login page
  if (!isOwnerAuthenticated) {
    return <AdminLogin />
  }

  // If there is no token but the flag is set (weird state), or no user data yet
  if (localToken && !user) {
    return <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-500">Loading Dashboard...</div>
  }

  // If user data has loaded but they are not an owner, redirect to home page
  if (user && !isOwner) {
    return <Navigate to="/" />
  }

  // User is loaded and is an owner, show the dashboard
  return (
    <div className='flex flex-col'>
      <NavBarOwner />
      <div className='flex'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout