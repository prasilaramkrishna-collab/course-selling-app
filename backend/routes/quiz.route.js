import express from 'express';
import { submitQuiz, getQuiz, getUserQuizSubmission } from '../controllers/quiz.controller.js';
import userMiddleware from '../middlewares/user.mid.js';

const router = express.Router();

// POST /api/quiz/submit - Submit quiz answers
router.post('/submit', userMiddleware, submitQuiz);

// GET /api/quiz/:courseId - Get quiz for a course
router.get('/:courseId', getQuiz);

// GET /api/quiz/:courseId/submission - Get user's quiz submission
router.get('/:courseId/submission', userMiddleware, getUserQuizSubmission);

export default router;
