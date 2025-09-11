import mongoose from "mongoose";

let isConnected: boolean | undefined = (globalThis as any).isConnected;

export async function connectDB() {
    if (isConnected) {
        return;
    }

    try {
        const uri = process.env.DATABASE_URI;
        if (!uri) {
            throw new Error("DATABASE_URI is not defined in environment variables");
        }
        const conn = await mongoose.connect(uri);

        (globalThis as any).isConnected = true;

        isConnected = true;

        console.log("Connection is established: ", conn.connection.host);
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
}