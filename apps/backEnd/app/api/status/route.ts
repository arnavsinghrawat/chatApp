import { NextResponse } from "next/server";
import { connectDB } from "../../../db/connection";

export async function GET() {

    await connectDB();

    const data = {
        message: 'Server is live',
        timestamp: new Date().toISOString(),
    }

    return NextResponse.json(data, {
        status: 200,
    });
}