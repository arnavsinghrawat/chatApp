import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../lib/utils";
import cloudinary from "../lib/cloudinary";
import { profile } from "console";

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) {
            return res
                .status(404)
                .json({ success: false, message: "User does not exist" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id.toString());

        return res.json({
            success: true,
            userData,
            token,
            message: "Login Successful",
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res
            .status(500)
            .json({ success: false, message: "An unknown error occurred" });
    }
};


export const signup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { fullName, email, password, bio } = req.body;

        if (!fullName || !email || !password || !bio) {
            return res
                .status(400)
                .json({ success: false, message: "Missing details" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "Account already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio,
        });

        const token = generateToken(newUser._id.toString());

        return res.status(201).json({
            success: true,
            userData: newUser,
            token,
            message: "Account created successfully",
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res
            .status(500)
            .json({ success: false, message: "An unknown error occurred" });
    }
};

//controller to check wheteher user is authenticated
export const checkAuth = (req: Request, res: Response) => {
    res.json({ success: true, user: req.user });
}

//controller to update profile details
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user?._id;
        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName }, { new: true });
        }

        return res.status(500).json({ succes: true, user: updatedUser });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res
            .status(500)
            .json({ success: false, message: "An unknown error occurred" });
    }
}