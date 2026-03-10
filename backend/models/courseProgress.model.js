import mongoose from "mongoose";

const completedLessonSchema = new mongoose.Schema({
    moduleIndex: {
        type: Number,
        required: true,
    },
    lessonIndex: {
        type: Number,
        required: true,
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });

const courseProgressSchema = new mongoose.Schema({
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
    completedLessons: [completedLessonSchema],
    overallProgress: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);
