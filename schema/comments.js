import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },
    username: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const comment = mongoose.model("comment", schema);
