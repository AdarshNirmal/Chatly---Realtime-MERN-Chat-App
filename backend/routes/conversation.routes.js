import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getUserConversations } from "../controllers/conversation.controllers.js"

const conversationRouter = express.Router()

conversationRouter.get("/list", isAuth, getUserConversations)

export default conversationRouter