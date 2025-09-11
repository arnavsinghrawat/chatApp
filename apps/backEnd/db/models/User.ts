import { Schema, model } from 'mongoose';

interface IUser {
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
  bio?: string;
}


const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  profilePic: { type: String, default: "" },
  bio: { type: String },
}, { timestamps: true });


const User = model<IUser>('User', userSchema);

export default User;