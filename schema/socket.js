import mongoose from "mongoose";
import WebSocket from "ws";

const schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
    required: true,
  },
  web: {
    type:String,
    required: true,
  },
});

export const socket = mongoose.model("socket", schema);

