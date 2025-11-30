import mongoose from "mongoose";

const connectDb =async ()=>{
    try {
        await  mongoose.connect(process.env.MONGODB_URL)
        console.log("🤝Chatty connect🚀");
        
    } catch (error) {
        console.log("🚨Chatty error🚨");
        
    }
}
export default connectDb