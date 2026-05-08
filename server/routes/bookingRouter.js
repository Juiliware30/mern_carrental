import express from 'express';
import { changeBookingStatus, checkAvailabilityOfCar, createBooking, getOwnerBookings, getUserBookings } from '../controllers/BookingController.js';
import {protech} from "../middleware/auth.js";



const bookingRouter =  express.Router();
bookingRouter.post('/check-availability',checkAvailabilityOfCar)
bookingRouter.post('/create', protech , createBooking)
bookingRouter.get('/user',protech,getUserBookings)
bookingRouter.get('/owner',protech,getOwnerBookings)
bookingRouter.post('/change-status',protech,changeBookingStatus)


export default bookingRouter;