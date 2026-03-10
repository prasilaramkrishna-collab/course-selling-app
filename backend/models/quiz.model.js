import mongoose from "mongoose";

const quizSubmissionSchema = new mongoose.Schema({
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
    quizType: {
        type: String,
        enum: ["module", "final"],
        default: "final",
    },
    moduleIndex: {
        type: Number,
        default: null,
    },
    answers: [{
        questionNumber: {
            type: Number,
        },
        selectedAnswer: {
            type: String,
        },
        isCorrect: {
            type: Boolean,
        }
    }],
    score: {
        type: Number,
        default: 0,
    },
    totalQuestions: {
        type: Number,
        default: 0,
    },
    percentage: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['passed', 'failed'],
        default: 'failed',
    },
    passingScore: {
        type: Number,
        default: 70,
    },
    isCourseCompleted: {
        type: Boolean,
        default: false,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

export const QuizSubmission = mongoose.model("QuizSubmission", quizSubmissionSchema);
