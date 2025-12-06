import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  partcipants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }
  ]
  // ✅ lastMessage REMOVED
  // ✅ unreadCount REMOVED
}, { timestamps: true })

const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation