import express from "express";
import { checkAuth,login,signup,updateProfile,refreshFunction } from "../controllers/userController";
import { protectRoute } from "../middleware/auth";
import upload from "../middleware/upload";

const userRouter = express.Router();

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.post('/update-profile',protectRoute,upload.single('profilePic'),updateProfile);
userRouter.get('/check',protectRoute, checkAuth);
userRouter.post('/refresh', refreshFunction)

export default userRouter;

