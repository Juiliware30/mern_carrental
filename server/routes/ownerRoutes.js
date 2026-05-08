import express from 'express'
import { protech } from '../middleware/auth.js';
import { addCar, changeRoleToOwner, deleteCar, getCarById, getDashboardData, getOwnerCars, toggleCarAvailability, updateCar, updateUserImage } from '../controllers/OwnerController.js';
import upload from '../middleware/multer.js';

const ownerRouter =  express.Router();

ownerRouter.post("/change-role",protech,changeRoleToOwner)
ownerRouter.post("/add-car", protech,upload.single("image"), addCar)
ownerRouter.get("/cars", protech,getOwnerCars)
ownerRouter.get("/car/:carId", protech, getCarById)
ownerRouter.post("/update-car/:carId", protech, upload.single("image"), updateCar)
ownerRouter.post("/toggle-car", protech, toggleCarAvailability)
ownerRouter.post("/delete-car", protech,deleteCar)

ownerRouter.get("/dashboard",protech,getDashboardData)
ownerRouter.post("/update-image",protech,upload.single('image'),updateUserImage)

export default ownerRouter;