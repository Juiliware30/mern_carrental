import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

//create Context
export const AppContext =  createContext();

//Create provider component
export const AppProvider = ({children})=>{
    console.log('AppProvider rendered')
    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY

    const [token,setToken] = useState(null)
    
    // Wrap setToken with debugging
    const setTokenWithDebug = (newToken) => {
        console.log('setToken called with:', newToken)
        setToken(newToken)
    }

    const [user,setUser] = useState(null)
    const [isOwner , setIsOwner] = useState(false)
    const [showLogin , setShowLogin] = useState(false)
    const [pickupDate , setPickupDate] = useState('')
    const [returnDate , setReturnDate] = useState('')

    const [cars , setCars] = useState([])

    //Function to check if user is logged in 
    const fetchUser = async ()=>{
        console.log('fetchUser called')
        console.log('Axios instance in fetchUser:', axios)
        console.log('Authorization header in fetchUser:', axios.defaults.headers.common['Authorization'])
        
        // Log the request details before sending
        console.log('Sending GET request to /api/user/data')
        
        try {
           const {data} =  await axios.get('/api/user/data')
           console.log('fetchUser response:', data)

           if( data.success)
           {
            console.log('Setting user:', data.user)
            setUser (data.user)
            setIsOwner(data.user.role === 'owner')
            return data // Return the data
           }else
           {
            console.log('Failed to fetch user data:', data.message)
            // If fetching user data fails, clear the state
            setUser(null)
            setIsOwner(false)
            setToken(null)
            localStorage.removeItem('token')
            return data // Return the data
           }
        } catch (error) {
            // If there's an error fetching user data, clear the user state
            setUser(null)
            setIsOwner(false)
            console.error('Error fetching user data:', error.message)
            console.error('Error stack:', error.stack)
            console.error('Error config:', error.config)
            console.error('Error request:', error.request)
            console.error('Error response:', error.response)
            return {success: false, message: error.message} // Return error data
        }
    }

    // Function to fetch all cars from the server

    const fetchCars = async()=>{
        try {
            const {data} =  await axios.get('/api/user/cars')
            data.success ? setCars(data.cars) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
            
        }
    }

//Function to logout the user
 const logout = ()=>{
    console.log('Logout function called')
    localStorage.removeItem('token')
    localStorage.removeItem('ownerAuthenticated')
    setToken(null)
    setUser(null)
    setIsOwner(false)
    axios.defaults.headers.common['Authorization'] = ''
    toast.success('You have been logged out ')
 }


    //useEffect to retrieve the token from local storage and set it in context

    useEffect(()=>{
        const token = localStorage.getItem('token')
        console.log('AppContext useEffect - Token from localStorage:', token)
        if (token) {
            setToken(token)
        }
        fetchCars()
    },[])

    //useEffect to fetch user data when token is available

    useEffect(()=>{
        console.log('Token useEffect triggered - Token value:', token)
        if(token)
        {
            console.log('Setting authorization header with token')
            axios.defaults.headers.common['Authorization']=`Bearer ${token}`
            console.log('Authorization header set to:', axios.defaults.headers.common['Authorization'])
            // Also log the axios instance to see if it's the same instance
            console.log('Axios instance:', axios)
            fetchUser()
        } else {
            console.log('Token is null or undefined, not fetching user')
        }
    
    },[token])


    const value = {
        navigate, currency,axios,user, setUser,
        token, setToken: setTokenWithDebug,isOwner,setIsOwner,fetchUser,showLogin,setShowLogin,
        logout,fetchCars, cars,setCars,pickupDate, setPickupDate,
        returnDate, setReturnDate


    }
    return(
     <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
    )
}
//Custom hook for easier access

export const useAppContext = ()=>{
    return useContext(AppContext)
}