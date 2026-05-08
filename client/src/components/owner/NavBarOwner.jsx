import React from 'react'
import { assets,  } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavBarOwner = () => {
     const {user, logout} = useAppContext() ;



  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
        <Link to='/'>
        <img src={assets.logo} alt="" className='h-7' />
        </Link>
        <div className='flex items-center gap-4'>
            <p className='hidden sm:block'>Welcome, {user?.name || "Owner"}</p>
            <button 
                onClick={logout}
                className='bg-red-50 text-red-500 border border-red-100 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-500 hover:text-white transition-all cursor-pointer'
            >
                Logout
            </button>
        </div>

    </div>
  )
}

export default NavBarOwner