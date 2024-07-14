import express from "express";
import { WebSocketServer } from "ws";
import WebSocket from "ws";
import messages from "../schema/messages.js";

const app = express();
const httpServer = app.listen(8080);
export const wss = new WebSocketServer({ server: httpServer });

let map = new Map();

wss.on("connection", async function connection(ws, req) {
  console.log("Client connected");
  const urlParams = new URLSearchParams(req.url.split("?")[1]);
  const senderId = urlParams.get("senderId");
  console.log("sender Id: " + senderId);
  map.set(senderId, ws);

  ws.on("message", async function message(data, isBinary) {
    const { senderId, receiverId, message } = JSON.parse(data);
    let response;

    console.log("Data: " + Object.keys(JSON.parse(data)).length);
    if(Object.keys(JSON.parse(data)).length===3)
      response = await messages.create(JSON.parse(data));
    //console.log(senderId + " " + receiverId+" "+map.has(receiverId));
    if (map.has(receiverId)) {
      const socket = map.get(receiverId);
      //console.log("Socket: " + (socket.readyState === WebSocket.OPEN));
      if (socket.readyState === WebSocket.OPEN) {
        //console.log("Socket: sent" + receiverId);
        socket.send(JSON.stringify(response), { binary: isBinary });
      }
    }

    // wss.clients.forEach(function each(client) {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(data, { binary: isBinary });
    //   }
    // });
  });

  ws.on("close", function close(code, reason) {
    console.log(`Client disconnected: ${map.get(senderId)} ${senderId}`);
    console.log(map.size);
    map.delete(senderId);
    console.log(map.size);
  });

  ws.send(JSON.stringify("Hello! Message From Server!!"));
});

console.log("Server is listening on port 8080");
