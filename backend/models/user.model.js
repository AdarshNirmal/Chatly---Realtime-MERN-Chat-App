import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
    },
    userName:{
        type:String,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        default:""
    }
},{timestamps:true})

 const User=mongoose.model("User",userSchema)

 export default User