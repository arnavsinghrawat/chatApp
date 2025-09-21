import { Request, Response } from "express";
import Message from "../models/Message";
import User from "../models/User";
import cloudinary from "../lib/cloudinary";
import { userSocketMap, io, ServerToClientEvents } from "../server";

export const getUserForSideBar = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;

        // get all users except the logged-in one
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        // get unseen messages for this user
        const allUnseen = await Message.find({
            receiverId: userId,
            seen: false,
        }).select("senderId");

        // unseen count by sender
        const unseenMessages: Record<string, number> = {};
        allUnseen.forEach((msg) => {
            const senderId = msg.senderId.toString();
            unseenMessages[senderId] = (unseenMessages[senderId] || 0) + 1;
        });

        res.json({ success: true, users: filteredUsers, unseenMessages });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: "An unknown error occurred" });
    }
};


export const getMessages = async (req: Request, res: Response) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user!._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        });
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });
        res.status(200).json({ success: true, messages });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res
            .status(500)
            .json({ success: false, message: "An unknown error occurred" });
    }
}

export const markMessageAsSeen = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.status(200).json({ success: true });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res
            .status(500)
            .json({ success: false, message: "An unknown error occurred" });
    }
}

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id.toString();
        const senderId = req.user!._id.toString();

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        if (!newMessage) {
            return res.status(500).json({ success: false, message: "Message not being able to be created by mongo DB" });
        }

        const appropriateNewMessage: Parameters<ServerToClientEvents["newMessage"]>[0] = {
            _id: newMessage.id.toString(),
            senderId: newMessage.senderId.toString(),
            receiverId: newMessage.receiverId.toString(),
            text: newMessage.text ?? undefined,
            image: newMessage.image ?? undefined,
            createdAt: newMessage.createdAt.toISOString(),
        };

        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", appropriateNewMessage!);
        }

        res.status(200).json({ success: true, newMessage });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res
            .status(500)
            .json({ success: false, message: "An unknown error occurred" });
    }
}

export const getSideContainerImageMessages = async (req: Request, res: Response) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user!._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ],
            image: { $exists: true, $ne: null },  
            seen: true                      
        });

        res.status(200).json({ success: true, messages });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        return res
            .status(500)
            .json({ success: false, message: "An unknown error occurred" });
    }
}