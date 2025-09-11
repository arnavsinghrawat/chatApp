import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ userId },secret);
    
    return token;
}