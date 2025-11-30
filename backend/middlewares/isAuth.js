import jwt from "jsonwebtoken"

const isAuth=async(req,res,next)=>{
    try {
        let token=req.cookies.token
        if(!token){
            return res.status(400).json({message:"token is not found"})
        }

    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET)
    req.userId = verifyToken.userId
    next()
  } catch (error) {
    console.log("isAuth error:", error)
    return res.status(500).json({ message: `isauth error ${error.message}` })
  }
}

export default isAuth
