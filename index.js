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
import {wss} from "./websocket/chat.js";
import {app} from "./websocket/chat.js";

const cloudinary = cloud.v2;

//export const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
const port =process.env.PORT || 3000;

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


// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
 

// export const wss = new WebSocketServer({ server: app.listen(port) });

// let map = new Map();

// wss.on("connection", async function connection(ws, req) {
//   console.log("Client connected");
//   const urlParams = new URLSearchParams(req.url.split("?")[1]);
//   const senderId = urlParams.get("senderId");
//   console.log("sender Id: " + senderId);
//   map.set(senderId, ws);

//   ws.on("message", async function message(data, isBinary) {
//     const { senderId, receiverId, message } = JSON.parse(data);
//     let response;

//     console.log("Data: " + Object.keys(JSON.parse(data)).length);
//     if(Object.keys(JSON.parse(data)).length===3)
//       response = await messages.create(JSON.parse(data));
//     //console.log(senderId + " " + receiverId+" "+map.has(receiverId));
//     if (map.has(receiverId)) {
//       const socket = map.get(receiverId);
//       //console.log("Socket: " + (socket.readyState === WebSocket.OPEN));
//       if (socket.readyState === WebSocket.OPEN) {
//         //console.log("Socket: sent" + receiverId);
//         socket.send(JSON.stringify(response), { binary: isBinary });
//       }
//     }

//     // wss.clients.forEach(function each(client) {
//     //   if (client.readyState === WebSocket.OPEN) {
//     //     client.send(data, { binary: isBinary });
//     //   }
//     // });
//   });

//   ws.on("close", function close(code, reason) {
//     console.log(`Client disconnected: ${map.get(senderId)} ${senderId}`);
//     console.log(map.size);
//     map.delete(senderId);
//     console.log(map.size);
//   });

//   ws.send(JSON.stringify("Hello! Message From Server!!"));
// });

// console.log("Server is listening on port 8080");


