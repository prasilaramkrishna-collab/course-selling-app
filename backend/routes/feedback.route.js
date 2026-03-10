import express from 'express';
import {
    submitFeedback,
    getUserFeedback,
    getCourseFeedback,
    getAllFeedback,
    deleteFeedback,
    updateFeedback,
    checkFeedbackStatus
} from '../controllers/feedback.controller.js';
import userMiddleware from '../middlewares/user.mid.js';
import adminMiddleware from '../middlewares/admin.mid.js';

const router = express.Router();

// POST /api/feedback/submit - Submit feedback for a course
router.post('/submit', userMiddleware, submitFeedback);

// GET /api/feedback/:courseId - Get user's feedback for a course
router.get('/:courseId', userMiddleware, getUserFeedback);

// GET /api/feedback/check/:courseId - Check if user already submitted feedback
router.get('/check/:courseId', userMiddleware, checkFeedbackStatus);

// GET /api/feedback/course/:courseId - Get all feedback for a course (ADMIN)
router.get('/course/:courseId', getCourseFeedback);

// GET /api/feedback/admin/all - Get all feedback (ADMIN)
router.get('/admin/all', adminMiddleware, getAllFeedback);

// PUT /api/feedback/:feedbackId - Update feedback
router.put('/:feedbackId', userMiddleware, updateFeedback);

// DELETE /api/feedback/:feedbackId - Delete feedback
router.delete('/:feedbackId', userMiddleware, deleteFeedback);

export default router;
