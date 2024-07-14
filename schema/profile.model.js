import mongoose, { mongo } from "mongoose";
import { post } from "./post.js";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// mongoose.connect("mongodb://localhost:27017/profile");

mongoose.connect("mongodb+srv://aulakh:Xv4x0XdtKe9UGzho@cluster0.uoqaz4z.mongodb.net/");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    first: {
      type: String,
      required: true,
    },
    last: {
      type: String,
      required: true,
    },
    phno: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "profile",
      },
    ],
    socket:{
      type:String,
    },
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
  },
  { timestamps: true },
);

schema.pre("validate", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

schema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}

schema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username,
      first: this.first,
      last: this.last,
      phno: this.phno,
      photo: this.photo,
      bio: this.bio,
      posts: this.posts,
    },
    { expiresIn: "1h" },
    process.env.Access_Token
  );
};


export const profile = mongoose.model("profile", schema);
