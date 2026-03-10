import mongoose from "mongoose";

const purchaseSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref: "User",
    },
    courseId:{
        type:mongoose.Types.ObjectId,
        ref: "Course",
    },
    paymentId:{
        type:String,
        required:true,
    },
    orderId:{
        type:String,
        required:true,
    },
    paymentStatus:{
        type:String,
        enum:["pending", "completed", "failed"],
        default:"completed",
    },
    purchaseDate:{
        type:Date,
        default:Date.now,
    },
}, { timestamps: true });

export const Purchase=mongoose.model("Purchase",purchaseSchema);