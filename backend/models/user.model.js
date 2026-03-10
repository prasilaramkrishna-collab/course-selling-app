import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        union:true,
    },
    password:{
        type:String,
        required:true,

    },
    profilePhoto:{
        type:String,
        default: null,
    },
    purchasedCourses:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Course",
        }
    ],
    language:{
        type:String,
        enum:["English", "Hindi", "Kannada"],
        default:"English"
    }
}, { timestamps: true })


export const User=mongoose.model("User",userSchema);