import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken, generateToken } from "../lib/utils";
import cloudinary from "../lib/cloudinary";
import { profile } from "console";
import jwt from "jsonwebtoken";

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

        // const token = generateToken(userData._id.toString());
        const token = generateAccessToken(userData._id.toString());
        const refreshToken = generateRefreshToken(userData._id.toString());

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            success: true,
            userData,
            token: token, // "token" --> "accessToken"
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

        const userData = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio,
        });

        // const token = generateToken(newUser._id.toString());
        const token = generateAccessToken(userData._id.toString());
        const refreshToken = generateRefreshToken(userData._id.toString());

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });


        return res.status(201).json({
            success: true,
            userData: userData,
            token: token,
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
// export const checkAuth = (req: Request, res: Response) => {
//     res.json({ success: true, user: req.user });
// }

export const checkAuth = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "An unknown error occurred" });
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { fullName, bio } = req.body;
        const userId = req.user?._id;

        let profilePicUrl: string | undefined;
        const updateData: any = { fullName, bio };

        if (req.file) {
            const profilePicUrl = await new Promise<string>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "profiles" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result?.secure_url || "");
                    }
                );
                stream.end(req!.file!.buffer);
            });

            updateData.profilePic = profilePicUrl;
        }


        if (profilePicUrl) updateData.profilePic = profilePicUrl;

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        return res.status(200).json({ success: true, user: updatedUser });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: "An unknown error occurred" });
    }
};

export const refreshFunction = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

        const secret = process.env.REFRESH_SECRET!;

        jwt.verify(refreshToken, secret, (err: any, payload: any) => {
            if (err) return res.status(403).json({ error: "Invalid refresh token" });

            const newAccessToken = generateAccessToken(payload.userId);
            res.json({ accessToken: newAccessToken });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
};
