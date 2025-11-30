import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import {getMessage, sendMessage} from '../controllers/message.controllers.js'

const messageRouter=express.Router()


messageRouter.post("/send/:receiver",isAuth,upload.single("image"),sendMessage)
messageRouter.get("/get/:receiver",isAuth,getMessage)








export default messageRouter