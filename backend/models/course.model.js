import fileUpload from "express-fileupload";
import mongoose from "mongoose";

const courseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    estimatedDuration: {
        type: String,
        default: "",
    },
    image:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        },
    },
    materials: [{
        title: {
            type: String,
            required: false,
        },
        link: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            enum: ['video', 'pdf', 'doc', 'other'],
            default: 'other'
        }
    }],
    coursePlan: [{
        chapter: {
            type: Number,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        duration: {
            type: String,
        },
        lessons: [{
            title: {
                type: String,
            },
            duration: {
                type: String,
            },
        }],
        topics: [{
            type: String,
        }]
    }],
    quiz: [{
        questionNumber: {
            type: Number,
        },
        question: {
            type: String,
        },
        options: [{
            type: String,
        }],
        correctAnswer: {
            type: String,
        },
        explanation: {
            type: String,
        }
    }],
    codingProblems: [{
        problemNumber: {
            type: Number,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        starterCode: {
            type: String,
        },
        testCases: [{
            input: String,
            expectedOutput: String,
        }],
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Easy'
        },
        hints: [{
            type: String,
        }]
    }],
    quizTimeLimit: {
        type: Number,
        default: 20,
        comment: 'Time limit in minutes'
    },
    creatorId:{
        type:mongoose.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true })

export const Course=mongoose.model("Course",courseSchema);