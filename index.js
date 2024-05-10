import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import fs from "fs";
import diskStorage from "multer";
import cloud from "cloudinary";
import path from "path";
import multer from "multer";
import { memoryStorage } from "multer";
import axios from "axios";
import dotenv from "dotenv";
import { post } from "./schema/post.js";
import { profile } from "./schema/profile.model.js";
import { comment } from "./schema/comments.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { log } from "console";
import { login } from "./controllers/user.js";
import postRouter from "./routes/post.js";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";
import notification from "./schema/notification.js";
import messageRouter from "./routes/messages.js";
dotenv.config({ path: "./.env" });

const cloudinary = cloud.v2;

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
const port = 3000;

// export const __dirname = dirname(fileURLToPath(import.meta.url));
// app.use("/", express.static(__dirname));
 console.log("welcome");

app.use("/user",userRouter);
app.use("/post",postRouter);
app.use("/message",messageRouter);

app.get("/", (req, res) => {
  profile
    .find()
    .then((response) => res.send(response))
    .catch((err) => res.send(err.message));
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});