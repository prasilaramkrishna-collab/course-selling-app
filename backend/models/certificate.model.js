import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    courseName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    certificateNumber: {
        type: String,
        unique: true,
        required: true,
    },
    uniqueCertificateId: {
        type: String,
        unique: true,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
    quizScore: {
        type: Number,
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    completionDate: {
        type: Date,
        default: Date.now,
    },
    validUntil: {
        type: Date,
    },
    issuedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

export const Certificate = mongoose.model("Certificate", certificateSchema);
