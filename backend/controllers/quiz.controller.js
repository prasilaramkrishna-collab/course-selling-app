import { QuizSubmission } from '../models/quiz.model.js';
import { Certificate } from '../models/certificate.model.js';
import { Course } from '../models/course.model.js';
import { User } from '../models/user.model.js';
import crypto from 'crypto';
import { getEmailConfigStatus, sendUserEmail } from '../utils/mailer.js';

const buildFallbackQuiz = (course) => {
    const topics = [];
    const plan = Array.isArray(course.coursePlan) ? course.coursePlan : [];

    for (const moduleItem of plan) {
        if (Array.isArray(moduleItem.topics)) {
            for (const topic of moduleItem.topics) {
                if (typeof topic === 'string' && topic.trim()) {
                    topics.push(topic.trim());
                }
            }
        }
        if (Array.isArray(moduleItem.lessons)) {
            for (const lesson of moduleItem.lessons) {
                if (lesson?.title) {
                    topics.push(String(lesson.title).trim());
                }
            }
        }
    }

    const uniqueTopics = [...new Set(topics)].filter(Boolean);
    const baseTopics = uniqueTopics.length > 0
        ? uniqueTopics
        : [course.title, 'Course Basics', 'Core Concepts', 'Best Practices', 'Final Review'];

    const selectedTopics = baseTopics.slice(0, 8);

    return selectedTopics.map((topic, index) => ({
        questionNumber: index + 1,
        question: `Which topic is covered in this course?`,
        options: [
            topic,
            `Unrelated Topic ${index + 1}A`,
            `Unrelated Topic ${index + 1}B`,
            `Unrelated Topic ${index + 1}C`,
        ],
        correctAnswer: topic,
        explanation: `${topic} is part of the course curriculum.`,
    }));
};

const normalizeQuiz = (quiz = []) => {
    return quiz
        .map((q, index) => {
            const options = Array.isArray(q.options) ? q.options.filter(Boolean) : [];
            if (!q.question || options.length < 2) {
                return null;
            }
            const safeOptions = options.slice(0, 4);
            return {
                questionNumber: q.questionNumber || index + 1,
                question: q.question,
                options: safeOptions,
                correctAnswer: safeOptions.includes(q.correctAnswer) ? q.correctAnswer : safeOptions[0],
                explanation: q.explanation || '',
            };
        })
        .filter(Boolean);
};

const ensureCourseHasQuiz = async (course) => {
    const normalized = normalizeQuiz(course.quiz || []);
    if (normalized.length > 0) {
        if (normalized.length !== (course.quiz || []).length) {
            course.quiz = normalized;
            await course.save();
        }
        return normalized;
    }

    const generatedQuiz = buildFallbackQuiz(course);
    course.quiz = generatedQuiz;
    await course.save();
    return generatedQuiz;
};

// SUBMIT QUIZ
export const submitQuiz = async (req, res) => {
    try {
        const { courseId, answers } = req.body;
        const userId = req.userId;

        // Validate input
        if (!courseId || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid course ID or answers'
            });
        }

        // Fetch course details
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const courseQuiz = await ensureCourseHasQuiz(course);

        // Calculate score
        let correctCount = 0;
        const evaluatedAnswers = answers.map(answer => {
            const question = courseQuiz.find(q => q.questionNumber === answer.questionNumber);
            if (!question) {
                return { ...answer, isCorrect: false };
            }

            const isCorrect = answer.selectedAnswer === question.correctAnswer;
            if (isCorrect) correctCount++;

            return { ...answer, isCorrect };
        });

        const totalQuestions = courseQuiz.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        const status = percentage >= 70 ? 'passed' : 'failed';

        // Save quiz submission
        const submission = new QuizSubmission({
            userId,
            courseId,
            answers: evaluatedAnswers,
            score: correctCount,
            totalQuestions,
            percentage,
            status
        });

        await submission.save();

        // Generate certificate if passed (only for final quiz)
        let certificate = null;
        const quizType = req.body.quizType || 'final'; // Default to final quiz
        
        if (status === 'passed' && quizType === 'final') {
            const user = await User.findById(userId);
            const certificateNumber = `CERT-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
            const uniqueCertificateId = `UCN-${Date.now()}-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

            certificate = new Certificate({
                userId,
                courseId,
                courseName: course.title,
                userName: `${user.firstName} ${user.lastName}`,
                certificateNumber,
                uniqueCertificateId,
                percentage,
                quizScore: correctCount,
                totalQuestions,
                validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year valid
            });

            await certificate.save();

            // Send automatic congratulations email with certificate details
            try {
                const emailConfig = getEmailConfigStatus();
                if (!emailConfig.isConfigured) {
                    console.warn(`Certificate email skipped. Missing env: ${emailConfig.missing.join(', ')}`);
                } else {
                const emailSubject = `Congratulations! Certificate Awarded - ${course.title}`;
                const certificatePageUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/certificate/${courseId}`;
                const emailBody = `
                <div style="font-family: Playfair Display, serif; background-color: #f5f5f5; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h1 style="color: #1f2937; font-size: 28px; margin-bottom: 20px;">🎓 Congratulations!</h1>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                            Dear <strong>${user.firstName} ${user.lastName}</strong>,
                        </p>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                            You have successfully completed the course <strong>${course.title}</strong> and earned your certificate of achievement!
                        </p>
                        
                        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 5px;">
                            <p style="color: #1e40af; margin: 5px 0;"><strong>Certificate Details:</strong></p>
                            <ul style="color: #1e40af; margin: 10px 0; padding-left: 20px;">
                                <li>Certificate Number: ${certificate.certificateNumber}</li>
                                <li>Course: ${course.title}</li>
                                <li>Achievement: ${percentage}%</li>
                                <li>Quiz Score: ${correctCount}/${totalQuestions}</li>
                                <li>Completion Date: ${new Date(certificate.completionDate).toLocaleDateString()}</li>
                                <li>Valid Until: ${new Date(certificate.validUntil).toLocaleDateString()}</li>
                            </ul>
                        </div>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                            You can view, download, and share your certificate anytime from your account dashboard. Click the button below to access your certificates.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${certificatePageUrl}" style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Open Certificate Page</a>
                        </div>
                        
                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                                <strong>Next Steps:</strong> Explore more courses to enhance your skills and knowledge.
                            </p>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                            Best regards,<br>
                            <strong>FUTURE PROOF Learning Platform</strong>
                        </p>
                    </div>
                </div>
                `;
                const emailResult = await sendUserEmail({
                    to: user.email,
                    subject: emailSubject,
                    html: emailBody,
                });

                if (!emailResult.success) {
                    console.error('Error sending certificate email:', emailResult.reason);
                }
                }
            } catch (emailError) {
                console.error('Error in email process:', emailError);
                // Don't fail the quiz submission if email fails
            }
        }

        return res.status(200).json({
            success: true,
            message: status === 'passed' && quizType === 'final' ? 'Final quiz passed! Certificate generated.' : status === 'passed' ? 'Quiz passed!' : 'Quiz submitted. You need 70% to pass.',
            submission: {
                score: correctCount,
                totalQuestions,
                percentage,
                status,
                quizType
            },
            certificate: certificate ? {
                certificateNumber: certificate.certificateNumber,
                uniqueCertificateId: certificate.uniqueCertificateId,
                _id: certificate._id,
                completionDate: certificate.completionDate
            } : null
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        return res.status(500).json({
            success: false,
            message: 'Error submitting quiz',
            error: error.message
        });
    }
};

// GET QUIZ FOR COURSE
export const getQuiz = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId).select('title quiz codingProblems quizTimeLimit');
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const courseQuiz = await ensureCourseHasQuiz(course);

        // Remove correct answers from quiz (don't send to frontend)
        const quizWithoutAnswers = courseQuiz.map(q => ({
            questionNumber: q.questionNumber,
            question: q.question,
            options: q.options
        }));

        return res.status(200).json({
            success: true,
            courseTitle: course.title,
            totalQuestions: quizWithoutAnswers.length,
            quiz: quizWithoutAnswers,
            codingProblems: course.codingProblems || [],
            quizTimeLimit: course.quizTimeLimit || 20
        });
    } catch (error) {
        console.error('Error fetching quiz:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching quiz'
        });
    }
};

// GET USER'S QUIZ SUBMISSION
export const getUserQuizSubmission = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;

        const submission = await QuizSubmission.findOne({ userId, courseId });

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'No quiz submission found for this course'
            });
        }

        return res.status(200).json({
            success: true,
            submission: {
                score: submission.score,
                totalQuestions: submission.totalQuestions,
                percentage: submission.percentage,
                status: submission.status,
                submittedAt: submission.submittedAt
            }
        });
    } catch (error) {
        console.error('Error fetching quiz submission:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching quiz submission'
        });
    }
};
