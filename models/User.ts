import mongoose, { Schema, Document, models, model } from "mongoose";

// 1. Interface for TypeScript typing
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  likes: string[]
}

// 2. Mongoose Schema
const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
 
);

// 3. Model export (prevents model overwrite on dev server hot reload)
const User = models.User || model<IUser>("User", UserSchema);

export default User;
