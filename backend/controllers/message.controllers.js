import uploadOnCloudinary from "../config/clodinary.js";
import Conversation from "../models/Conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId
    const { receiver } = req.params
    const { message } = req.body

    let image
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path)
    }

    let conversation = await Conversation.findOne({
     partcipants:{$all:[sender,receiver]}
})

let newMessage=await Message.create({
    sender,receiver,message,image
})

if(!conversation){
    conversation=await Conversation.create({
        partcipants:[sender,receiver],
        messages:[newMessage._id]
    })
}else{
    conversation.messages.push(newMessage._id)
    await conversation.save()
}

const receiverSocketId=getReceiverSocketId(receiver)
if(receiverSocketId){
     newMessage.status = "delivered"
     await newMessage.save()
    io.to(receiverSocketId).emit("newMessage",newMessage)
}

return res.status(201).json(newMessage)

  } catch (error) {
    console.log("send message error:", error)
    return res.status(500).json({ message: `send Message error ${error.message}` })
  }
}


export const getMessage = async (req, res) => {
  try {
    const sender = req.userId
    const { receiver } = req.params

    let conversation = await Conversation.findOne({
      partcipants: { $all: [sender, receiver] }
    }).populate("messages")

    if (!conversation) {
      return res.status(400).json({ message: "converstaion not found" })
    }

    await Message.updateMany(
      {
        sender: receiver,         
        receiver: sender,         
        status: { $in: ["sent", "delivered"] }
      },
      { $set: { status: "seen" } }
    )

    conversation = await Conversation.findOne({
      partcipants: { $all: [sender, receiver] }
    }).populate("messages")

    return res.status(200).json(conversation.messages)
  } catch (error) {
    console.log("get message error:", error)
    return res.status(500).json({ message: `get Message error ${error.message}` })
  }
}