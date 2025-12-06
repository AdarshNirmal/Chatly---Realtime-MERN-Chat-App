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
  ],
  lastMessage: {                       
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null
  },
  unreadCount: {                       
    type: Map,
    of: Number,
    default: {}
  }
}, { timestamps: true })

const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation