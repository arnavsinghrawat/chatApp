import User from "../models/User";
import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { JwtPayload } from "../types/type";

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log("request arrived")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("no token is provided")
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const accessToken = authHeader.split(" ")[1];

    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET!) as JwtPayload;
    // console.log("decoded value",decoded)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    // console.log(req.user)
    next();
  } catch (error: unknown) {

    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "An unknown error occurred" });
  }
};

