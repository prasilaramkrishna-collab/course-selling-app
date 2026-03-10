import { Feedback } from '../models/feedback.model.js';
import { Course } from '../models/course.model.js';
import { User } from '../models/user.model.js';

// SUBMIT FEEDBACK
export const submitFeedback = async (req, res) => {
    try {
        const { courseId, rating, reviewTitle, reviewText, instructorRating, contentRating, recommendToOthers, improvements } = req.body;
        const userId = req.userId;

        // Validate input
        if (!courseId || !rating || !reviewTitle || !reviewText || !instructorRating || !contentRating) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Validate ratings are between 1-5
        if (![1, 2, 3, 4, 5].includes(rating) || ![1, 2, 3, 4, 5].includes(instructorRating) || ![1, 2, 3, 4, 5].includes(contentRating)) {
            return res.status(400).json({
                success: false,
                message: 'Ratings must be between 1 and 5'
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user already submitted feedback for this course
        const existingFeedback = await Feedback.findOne({ userId, courseId });
        if (existingFeedback) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted feedback for this course'
            });
        }

        // Create feedback
        const feedback = new Feedback({
            userId,
            courseId,
            courseName: course.title,
            userName: `${user.firstName} ${user.lastName}`,
            rating,
            reviewTitle,
            reviewText,
            instructorRating,
            contentRating,
            recommendToOthers: recommendToOthers !== undefined ? recommendToOthers : true,
            improvements: improvements || ''
        });

        await feedback.save();

        return res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            feedback: {
                _id: feedback._id,
                courseId: feedback.courseId,
                rating: feedback.rating,
                createdAt: feedback.createdAt
            }
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return res.status(500).json({
            success: false,
            message: 'Error submitting feedback',
            error: error.message
        });
    }
};

// GET USER'S FEEDBACK FOR A COURSE
export const getUserFeedback = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;

        const feedback = await Feedback.findOne({ userId, courseId }).lean();

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'No feedback found for this course'
            });
        }

        return res.status(200).json({
            success: true,
            feedback
        });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching feedback',
            error: error.message
        });
    }
};

// GET ALL FEEDBACK FOR A COURSE (ADMIN)
export const getCourseFeedback = async (req, res) => {
    try {
        const { courseId } = req.params;

        const feedbacks = await Feedback.find({ courseId })
            .populate('userId', 'firstName lastName email')
            .lean()
            .sort({ createdAt: -1 });

        if (feedbacks.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No feedback found for this course',
                total: 0,
                averageRating: 0,
                feedbacks: []
            });
        }

        // Calculate average ratings
        const avgRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
        const avgInstructorRating = feedbacks.reduce((sum, f) => sum + f.instructorRating, 0) / feedbacks.length;
        const avgContentRating = feedbacks.reduce((sum, f) => sum + f.contentRating, 0) / feedbacks.length;
        const recommendationPercentage = (feedbacks.filter(f => f.recommendToOthers).length / feedbacks.length) * 100;

        return res.status(200).json({
            success: true,
            total: feedbacks.length,
            averageRating: Math.round(avgRating * 10) / 10,
            averageInstructorRating: Math.round(avgInstructorRating * 10) / 10,
            averageContentRating: Math.round(avgContentRating * 10) / 10,
            recommendationPercentage: Math.round(recommendationPercentage),
            feedbacks: feedbacks.map(f => ({
                _id: f._id,
                studentName: f.userName,
                studentEmail: f.userId?.email,
                rating: f.rating,
                reviewTitle: f.reviewTitle,
                reviewText: f.reviewText,
                instructorRating: f.instructorRating,
                contentRating: f.contentRating,
                recommendToOthers: f.recommendToOthers,
                improvements: f.improvements,
                createdAt: f.createdAt
            }))
        });
    } catch (error) {
        console.error('Error fetching course feedback:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching feedback',
            error: error.message
        });
    }
};

// GET ALL FEEDBACK (ADMIN DASHBOARD)
export const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('userId', 'firstName lastName email')
            .populate('courseId', 'title')
            .lean()
            .sort({ createdAt: -1 });

        if (feedbacks.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No feedback found',
                total: 0,
                feedbacks: []
            });
        }

        const formattedFeedbacks = feedbacks.map(f => ({
            _id: f._id,
            studentName: f.userName,
            studentEmail: f.userId?.email,
            courseName: f.courseName,
            rating: f.rating,
            reviewTitle: f.reviewTitle,
            reviewText: f.reviewText,
            instructorRating: f.instructorRating,
            contentRating: f.contentRating,
            recommendToOthers: f.recommendToOthers,
            createdAt: f.createdAt
        }));

        return res.status(200).json({
            success: true,
            total: feedbacks.length,
            feedbacks: formattedFeedbacks
        });
    } catch (error) {
        console.error('Error fetching all feedback:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching feedback',
            error: error.message
        });
    }
};

// DELETE FEEDBACK (USER OR ADMIN)
export const deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const userId = req.userId;

        const feedback = await Feedback.findById(feedbackId);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        // Check if user is the one who submitted the feedback
        if (feedback.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this feedback'
            });
        }

        await Feedback.findByIdAndDelete(feedbackId);

        return res.status(200).json({
            success: true,
            message: 'Feedback deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting feedback',
            error: error.message
        });
    }
};

// UPDATE FEEDBACK (USER CAN EDIT THEIR OWN FEEDBACK)
export const updateFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const userId = req.userId;
        const { rating, reviewTitle, reviewText, instructorRating, contentRating, recommendToOthers, improvements } = req.body;

        const feedback = await Feedback.findById(feedbackId);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        // Check if user is the one who submitted the feedback
        if (feedback.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this feedback'
            });
        }

        // Update fields
        if (rating) feedback.rating = rating;
        if (reviewTitle) feedback.reviewTitle = reviewTitle;
        if (reviewText) feedback.reviewText = reviewText;
        if (instructorRating) feedback.instructorRating = instructorRating;
        if (contentRating) feedback.contentRating = contentRating;
        if (recommendToOthers !== undefined) feedback.recommendToOthers = recommendToOthers;
        if (improvements) feedback.improvements = improvements;

        await feedback.save();

        return res.status(200).json({
            success: true,
            message: 'Feedback updated successfully',
            feedback
        });
    } catch (error) {
        console.error('Error updating feedback:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating feedback',
            error: error.message
        });
    }
};

// CHECK IF USER ALREADY SUBMITTED FEEDBACK
export const checkFeedbackStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;

        const feedback = await Feedback.findOne({ userId, courseId });

        return res.status(200).json({
            success: true,
            hasFeedback: !!feedback,
            feedback: feedback || null
        });
    } catch (error) {
        console.error('Error checking feedback status:', error);
        return res.status(500).json({
            success: false,
            message: 'Error checking feedback status',
            error: error.message
        });
    }
};
