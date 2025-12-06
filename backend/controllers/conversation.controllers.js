import Conversation from "../models/Conversation.model.js"

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.userId

    const conversations = await Conversation.find({
      partcipants: userId
    })
      .populate("partcipants", "-password")
      .populate({
        path: "lastMessage",
        select: "message sender receiver createdAt status image"
      })
      .sort({ updatedAt: -1 })   

    return res.status(200).json(conversations)
  } catch (error) {
    console.log("get conversations error:", error)
    return res.status(500).json({ message: `get conversations error ${error.message}` })
  }
}