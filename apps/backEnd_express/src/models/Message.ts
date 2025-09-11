import mongoose, { Document, Schema, Model, Types } from "mongoose";

interface IMessage {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    text?: string;
    image?: string; 
    seen: boolean;
}

interface MessageDocument extends IMessage, Document {
    createdAt: Date;
    updatedAt: Date;
}

interface MessageModel extends Model<MessageDocument> { }

const messageSchema: Schema<MessageDocument> = new mongoose.Schema<MessageDocument>({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
    seen: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Message: MessageModel = mongoose.model<MessageDocument, MessageModel>("Message", messageSchema);

export default Message;