import { NextRequest, NextResponse } from "next/server";
import User from "../../../../db/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../../libs/utils";

export const signup = async (req: NextRequest) => {

    try {
        const { fullName, email, password, bio } = await req.json();

        if (!fullName || !email || !password || !bio) {
            return NextResponse.json({ success: false, message: "Missing Details" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ success: false, message: "Account already exists" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        });

        const token = generateToken(newUser._id.toString());

        return NextResponse.json({ success: true, userData: newUser, token, message: "Account" }, { status: 200 });

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