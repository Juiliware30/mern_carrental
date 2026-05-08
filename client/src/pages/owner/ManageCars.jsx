import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaEdit, FaTrash } from 'react-icons/fa'


const ManageCars = () => {
  console.log('ManageCars component rendered - Version 2 with Edit Icon')
  const { isOwner, axios, currency } = useAppContext()
  const navigate = useNavigate()


  const [cars, setCars] = useState([])

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get('/api/owner/cars')

      if (data.success) {
        setCars(data.cars)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-car', { carId })

      if (data.success) {
        toast.success(data.message)
        fetchOwnerCars()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteCar = async (carId) => {

    try {
      const confirm = window.confirm('Are you sure you want to delete this car ?')
      if (!confirm) return null
      const { data } = await axios.post('/api/owner/delete-car', { carId })

      if (data.success) {
        toast.success(data.message)
        fetchOwnerCars()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    isOwner && fetchOwnerCars()
  }, [isOwner])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Cars"
        subTitle="View All list cars, update their details,or remove from the booking platform" />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Category</th>
              <th className='p-3 font-medium'> Price</th>
              <th className='p-3 font-medium max-md:hidden'> Status</th>
              <th className='p-3 font-medium text-center'> Action</th>
            </tr>

          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className='border-t border-borderColor'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                  <div className='max-md:hidden'>
                    <p className='font-medium'>{car.brand} {car.model}</p>
                    <p className='text-xs text-gray-500'>{car.seating_capacity} .{car.transmission}</p>
                  </div>
                </td>
                <td className='p-3 max-md:hidden'>{car.category}</td>
                <td className='p-3'>{currency}{car.pricePerDay}/day</td>

                <td className='p-3 max-md:hidden'>
                  <span className={`px-3 py-1 rounded-full text-xs ${car.isAvailable ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                    {car.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className='p-3'>
                  <div className='flex items-center justify-center gap-5'>
                    <div onClick={() => toggleAvailability(car._id)} className='cursor-pointer text-gray-500 hover:text-primary transition-colors' title="Toggle Availability">
                      {car.isAvailable ? <FaEye size={15} /> : <FaEyeSlash size={15} />}
                    </div>

                    <div onClick={() => navigate(`/owner/edit-car/${car._id}`)} className='cursor-pointer text-gray-500 hover:text-blue-500 transition-colors' title="Edit Car">
                      <FaEdit size={15} />
                    </div>

                    <div onClick={() => deleteCar(car._id)} className='cursor-pointer text-gray-500 hover:text-red-500 transition-colors' title="Delete Car">
                      <FaTrash size={13} />
                    </div>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default ManageCars