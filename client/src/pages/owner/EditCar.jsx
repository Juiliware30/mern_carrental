import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const EditCar = () => {
  const { axios, currency } = useAppContext()
  const { id } = useParams()
  const navigate = useNavigate()

  const [image, setImage] = useState(null)
  const [existingImage, setExistingImage] = useState('')
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchCarData = async () => {
    try {
      const { data } = await axios.get(`/api/owner/car/${id}`)
      if (data.success) {
        setCar({
          brand: data.car.brand,
          model: data.car.model,
          year: data.car.year,
          pricePerDay: data.car.pricePerDay,
          category: data.car.category,
          transmission: data.car.transmission,
          fuel_type: data.car.fuel_type,
          seating_capacity: data.car.seating_capacity,
          location: data.car.location,
          description: data.car.description,
        })
        setExistingImage(data.car.image)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCarData()
  }, [id])

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (isLoading) return null

    setIsLoading(true)
    try {
      const formData = new FormData()
      if (image) {
        formData.append('image', image)
      }
      
      const carData = {
        ...car,
        year: Number(car.year),
        pricePerDay: Number(car.pricePerDay),
        seating_capacity: Number(car.seating_capacity)
      }
      formData.append('carData', JSON.stringify(carData))
      
      console.log('Updating car with ID:', id)
      console.log('Payload:', carData)
      const { data } = await axios.post(`/api/owner/update-car/${id}`, formData)
      if (data.success) {
        toast.success(data.message)
        navigate('/owner/manage-cars')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
      <Title title="Edit Car" subTitle="Update car details, pricing, and availability." />

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>

        {/* Car Image */}
        <div className=' flex items-center gap-2 w-full'>
          <label htmlFor="car-image">
            <img src={image ? URL.createObjectURL(image) : (existingImage || assets.upload_icon)} alt=" " className=' h-20 w-32 object-cover rounded cursor-pointer' />
            <input type="file" id='car-image' accept="image/*" hidden onChange={e => setImage(e.target.files[0])} />
          </label>
          <p className='text-sm text-gray-500'>Click to update car picture</p>
        </div>

        {/* Car Brand & Model */}
        <div className=' grid grid-cols-1 md:grid-cols-2  gap-6'>
          <div className=' flex flex-col w-full'>
            <label>Brand</label>
            <input type="text" placeholder="e.g. BMW, Mercedes, Audi" required
              className=' px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.brand} onChange={e => setCar({ ...car, brand: e.target.value })} />
          </div>

          <div className=' flex flex-col w-full'>
            <label >Model</label>
            <input type="text" placeholder='e.g. X5, Corolla, A4' required
              className=' px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.model} onChange={e => setCar({ ...car, model: e.target.value })} />
          </div>
        </div>


        {/* Car Year Price , Category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className=' flex flex-col w-full'>
            <label htmlFor="">Year</label>
            <input type="number" placeholder='2025' required
              className=' px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.year} onChange={e => setCar({ ...car, year: e.target.value })} />
          </div>
          <div className=' flex flex-col w-full'>
            <label htmlFor="">Daily Price ({currency})</label>
            <input type="number" placeholder='100' required
              className=' px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.pricePerDay} onChange={e => setCar({ ...car, pricePerDay: e.target.value })} />
          </div>
          <div className='flex flex-col w-full'>
            <label>Category</label>
            <select onChange={e => setCar({ ...car, category: e.target.value })} value={car.category}
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV"> SUV</option>
              <option value="Van">VAN</option>
            </select>
          </div>
        </div>

        {/* car Transmission ,fuel Type ,Seating Capacity */}
        <div className=' grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label htmlFor="">Transmission</label>
            <select name="" id="" onChange={e => setCar({ ...car, transmission: e.target.value })} value={car.transmission}
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual"> Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>

          <div className='flex flex-col w-full'>
            <label htmlFor="">Fuel Type</label>
            <select name="" id="" onChange={e => setCar({ ...car, fuel_type: e.target.value })} value={car.fuel_type}
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a fuel type</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol"> Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className=' flex flex-col w-full'>
            <label htmlFor="">Seating Capacity</label>
            <input type="number" placeholder='4' required
              className=' px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.seating_capacity} onChange={e => setCar({ ...car, seating_capacity: e.target.value })} />
          </div>

        </div>

        {/* Car Location */}
        <div className='flex flex-col w-full'>
          <label >Location</label>
          <select name="" id="" onChange={e => setCar({ ...car, location: e.target.value })} value={car.location}
            className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
            <option value="">Select a location</option>
            <option value="Mumbai">India</option>
            <option value="Nashik">Nashik</option>
            <option value="Pune">Pune</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>

        {/* Car Description */}
        <div className=' flex flex-col w-full'>
          <label htmlFor="">Description</label>
          <textarea rows={5} placeholder='e.g A luxurious SUV with a spacious interior and powerful engine' required
            className=' px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.description} onChange={e => setCar({ ...car, description: e.target.value })}>
          </textarea>
        </div>
        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'>
          <img src={assets.tick_icon} alt="" />
          {isLoading ? 'Updating....' : 'Update Car Details'}
        </button>


      </form>
    </div>
  )
}

export default EditCar
