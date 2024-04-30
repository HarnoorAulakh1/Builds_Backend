import mongoose from "mongoose";
import { comment } from "./comments.js";
import { profile } from "./profile.model.js";

const schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
  },
  username: {
    type: String,
    required: true,
  },
  email:{
    type: String,
  },
  first: {
    type: String,
  },
  last: {
    type: String,
  },
  caption: {
    type: String,
  },
  photo: {
    type: String,
  },
  image: {
    type: String,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
},{timestamps:true});

export const post=mongoose.model("post",schema);