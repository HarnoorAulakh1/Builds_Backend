import mongoose from "mongoose";
import { profile } from "./profile.model.js";

const schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },
    photo: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    profile_link: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },
    profile_username: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAfter: {
        type: Date,
        default: Date.now(),
    }
  },
  { timestamps: true }
);

const notification = mongoose.model("notification", schema);
export default notification;
