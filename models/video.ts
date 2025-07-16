import mongoose, { Schema, model, models, Document, Types } from "mongoose";

// Interface
export interface IVideo extends Document {
  url: string;
  name?: string;
  fileType: string;
  thumbnail?: string;
  createdAt: Date;
  likes: Types.ObjectId[];
  uploadedBy: Types.ObjectId; // ← FIXED: now correctly typed
}

// Schema
const videoSchema = new Schema<IVideo>(
  {
    url: { type: String, required: true },
    name: { type: String },
    fileType: { type: String, required: true },
    thumbnail: { type: String },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",           // ← Use reference
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Video = models.Video || model<IVideo>("Video", videoSchema);
export default Video;
