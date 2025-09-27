import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ userId },secret);
    
    return token;
}

export const generateAccessToken = (userId: string) => {
    const secret = process.env.ACCESS_SECRET

    if(!secret) {
        throw new Error("ACCESS_SECRET is missing in the env")
    }

    const token = jwt.sign({userId}, secret, {expiresIn: "30m"})

    return token;
}

export const generateRefreshToken = (userId: string) => {
    const secret = process.env.REFRESH_SECRET

    if(!secret) {
        throw new Error("REFRESH_SECRET is missing in the env")
    }

    const token = jwt.sign({userId}, secret, {expiresIn: "7d"})

    return token
}