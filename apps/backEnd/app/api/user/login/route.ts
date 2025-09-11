import { NextRequest, NextResponse } from "next/server";
import User from "../../../../db/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../../libs/utils";

export const login = async (req: NextRequest) => {
    try {
        const {email, password} = await req.json()
        const userData = await User.findOne({email});

        if(!userData)
        {
            return NextResponse.json({success: false, message: "User does not exist"},{status: 500})
        }

        const isPasswordCorrect = await bcrypt.compare(password,userData?.password);
        
        if(!isPasswordCorrect) {
            return NextResponse.json({success: false, message: "Invalid credentials"},{status: 500});
        }
        
        const token = generateToken(userData._id.toString());

        return NextResponse.json({success: true, userData, token, message: "Login Successful"});
    } catch (error: unknown) {

        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: false, message: "An unknown error occurred" },
            { status: 500 }
        );
        
    }
}