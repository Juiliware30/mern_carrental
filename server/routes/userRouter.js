import express from "express"
import { getCars, getUserData, loginUser, registerUser } from "../controllers/UserController.js";
import { protech } from "../middleware/auth.js";


const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protech, getUserData)
userRouter.get('/cars', getCars)

export default userRouter;