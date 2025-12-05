import http from 'http'
import express from 'express'
import { Server } from 'socket.io'
import Message from "../models/message.model.js"  

let app = express()

const server = http.createServer(app)
const io  = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",                             
      "https://chatly-realtime-mern-chat-app.onrender.com"  
    ],
    credentials: true
  }
})

const userSocketMap = {}                         

export const getReceiverSocketId = (receiver) => {  
  return userSocketMap[receiver]
}

io.on("connection", async (socket) => {         
  const userId = socket.handshake.query.userId

  if (userId != undefined) {
    userSocketMap[userId] = socket.id


    await Message.updateMany(
      {
        receiver: userId,        
        status: "sent"          
      },
      { $set: { status: "delivered" } }
    )
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  
  socket.on("typing", ({ to }) => {
    const receiverSocketId = userSocketMap[to]
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { from: userId })
    }
  })

 
  socket.on("stopTyping", ({ to }) => {
    const receiverSocketId = userSocketMap[to]
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { from: userId })
    }
  })

  socket.on("disconnect", () => {
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})

export { app, server, io }