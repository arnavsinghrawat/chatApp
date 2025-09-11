import User from "../models/User";
import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { JwtPayload } from "../types/type";

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token.toString(), process.env.JWT_SECRET!) as JwtPayload;
    
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error: unknown) {

    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "An unknown error occurred" });
  }
};
