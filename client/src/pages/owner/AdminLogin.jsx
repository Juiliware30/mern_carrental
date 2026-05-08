import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const AdminLogin = () => {
    const { axios, setToken, fetchUser } = useAppContext()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault()

            // Hardcoded Admin Credential Check
            if (email !== 'cartrentaladmin@gmail.com' || password !== 'Pass@12345') {
                return toast.error("Invalid Admin Credentials")
            }

            setLoading(true)
            const { data } = await axios.post(`/api/user/login`, { email, password })
            if (data.success) {
                // Set token in localStorage and context
                localStorage.setItem('token', data.token)
                // Set a separate flag for owner portal authentication
                localStorage.setItem('ownerAuthenticated', 'true')

                // Set authorization header immediately for the subsequent fetchUser call
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
                setToken(data.token)

                // Fetch user to verify role (should be 'owner')
                const userData = await fetchUser()
                if (userData && userData.user && userData.user.role === 'owner') {
                    toast.success("Admin portal unlocked")
                } else {
                    // This should theoretically not happen if credentials are correct
                    localStorage.removeItem('token')
                    localStorage.removeItem('ownerAuthenticated')
                    setToken(null)
                    toast.error("Access denied: Not an admin")
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
            <div className="mb-8">
                <Link to='/'>
                    <img src={assets.logo} alt="logo" className="h-10" />
                </Link>
            </div>
            <form onSubmit={onSubmitHandler} className="flex flex-col gap-5 items-start p-8 py-10 w-80 sm:w-[400px] text-gray-600 rounded-xl shadow-2xl border border-gray-100 bg-white">
                <div className="w-full text-center mb-2">
                    <p className="text-3xl font-semibold">
                        <span className="text-primary">Admin</span> Portal
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Sign in to access the owner dashboard</p>
                </div>

                <div className="w-full mt-2">
                    <p className="font-medium text-gray-700 mb-1">Email Address</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="admin@example.com"
                        className="border border-gray-300 rounded-lg w-full p-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        type="email"
                        required
                    />
                </div>

                <div className="w-full">
                    <p className="font-medium text-gray-700 mb-1">Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="••••••••"
                        className="border border-gray-300 rounded-lg w-full p-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        type="password"
                        required
                    />
                </div>

                <button
                    disabled={loading}
                    className={`bg-primary hover:bg-blue-800 transition-all text-white w-full py-3 rounded-lg font-medium shadow-md mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    )
}

export default AdminLogin
