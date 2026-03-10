import { Certificate } from '../models/certificate.model.js';
import { Course } from '../models/course.model.js';
import { User } from '../models/user.model.js';
import { getEmailConfigStatus, sendUserEmail } from '../utils/mailer.js';

// GET USER'S CERTIFICATE
export const getUserCertificate = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;

        const certificate = await Certificate.findOne({ userId, courseId }).lean();

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found. Please complete the final quiz with 70% or above.'
            });
        }

        return res.status(200).json({
            success: true,
            certificate: {
                _id: certificate._id,
                certificateNumber: certificate.certificateNumber,
                uniqueCertificateId: certificate.uniqueCertificateId,
                courseName: certificate.courseName,
                userName: certificate.userName,
                percentage: certificate.percentage,
                quizScore: certificate.quizScore,
                totalQuestions: certificate.totalQuestions,
                completionDate: certificate.completionDate,
                validUntil: certificate.validUntil,
                issuedAt: certificate.issuedAt
            }
        });
    } catch (error) {
        console.error('Error fetching certificate:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching certificate'
        });
    }
};

// GET ALL USER CERTIFICATES
export const getAllUserCertificates = async (req, res) => {
    try {
        const userId = req.userId;

        const certificates = await Certificate.find({ userId }).lean();

        if (certificates.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No certificates found',
                certificates: []
            });
        }

        return res.status(200).json({
            success: true,
            total: certificates.length,
            certificates: certificates.map(cert => ({
                _id: cert._id,
                certificateNumber: cert.certificateNumber,
                courseName: cert.courseName,
                percentage: cert.percentage,
                completionDate: cert.completionDate,
                validUntil: cert.validUntil
            }))
        });
    } catch (error) {
        console.error('Error fetching certificates:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching certificates'
        });
    }
};

// VERIFY CERTIFICATE
export const verifyCertificate = async (req, res) => {
    try {
        const { certificateNumber } = req.params;

        const certificate = await Certificate.findOne({ certificateNumber }).populate('userId', 'firstName lastName email').lean();

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        const isValid = new Date(certificate.validUntil) > new Date();

        return res.status(200).json({
            success: true,
            isValid,
            certificate: {
                certificateNumber: certificate.certificateNumber,
                certificateName: certificate.userName,
                courseName: certificate.courseName,
                percentage: certificate.percentage,
                completionDate: certificate.completionDate,
                validUntil: certificate.validUntil,
                issuedAt: certificate.issuedAt
            }
        });
    } catch (error) {
        console.error('Error verifying certificate:', error);
        return res.status(500).json({
            success: false,
            message: 'Error verifying certificate'
        });
    }
};

// GET ALL CERTIFICATES (ADMIN)
export const getAllCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find()
            .populate('userId', 'firstName lastName email')
            .populate('courseId', 'title price')
            .lean()
            .sort({ completionDate: -1 });

        if (certificates.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No certificates issued yet',
                total: 0,
                certificates: []
            });
        }

        const formattedCertificates = certificates.map(cert => ({
            _id: cert._id,
            certificateNumber: cert.certificateNumber,
            studentName: cert.userName,
            studentEmail: cert.userId?.email,
            courseName: cert.courseName,
            percentage: cert.percentage,
            score: cert.quizScore,
            totalQuestions: cert.totalQuestions,
            completionDate: cert.completionDate,
            issuedAt: cert.issuedAt,
            validUntil: cert.validUntil,
            isValid: new Date(cert.validUntil) > new Date()
        }));

        return res.status(200).json({
            success: true,
            total: certificates.length,
            certificates: formattedCertificates
        });
    } catch (error) {
        console.error('Error fetching all certificates:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching certificates',
            error: error.message
        });
    }
};

// SEND CERTIFICATE VIA EMAIL
export const sendCertificateEmail = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { pdfData } = req.body;
        const userId = req.userId;

        // Fetch user details
        const user = await User.findById(userId).select('email firstName lastName');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Fetch certificate details
        const certificate = await Certificate.findOne({ userId, courseId }).lean();

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        const emailConfig = getEmailConfigStatus();
        if (!emailConfig.isConfigured) {
            return res.status(503).json({
                success: false,
                message: `Email service is not configured. Missing: ${emailConfig.missing.join(', ')}`
            });
        }

        const certificatePageUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/certificate/${courseId}`;

        // Prepare email content
        const emailSubject = `Your Course Completion Certificate - ${certificate.courseName}`;
        
        const emailBody = `
        <div style="font-family: Playfair Display, serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h1 style="color: #1f2937; font-size: 28px; margin-bottom: 20px;">🎓 Certificate Received</h1>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                    Dear <strong>${user.firstName} ${user.lastName}</strong>,
                </p>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                    Congratulations! Your certificate for the course <strong>${certificate.courseName}</strong> has been generated and is attached to this email.
                </p>
                
                <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 5px;">
                    <p style="color: #1e40af; margin: 5px 0;"><strong>Certificate Details:</strong></p>
                    <ul style="color: #1e40af; margin: 10px 0; padding-left: 20px;">
                        <li>Certificate Number: ${certificate.certificateNumber}</li>
                        <li>Course: ${certificate.courseName}</li>
                        <li>Achievement: ${certificate.percentage}%</li>
                        <li>Completion Date: ${new Date(certificate.completionDate).toLocaleDateString()}</li>
                        <li>Valid Until: ${new Date(certificate.validUntil).toLocaleDateString()}</li>
                    </ul>
                </div>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                    You can also view and download your certificate anytime from your account dashboard.
                </p>

                <div style="text-align: center; margin: 24px 0;">
                    <a href="${certificatePageUrl}" style="background-color: #1d4ed8; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: 600; display: inline-block;">
                        Open Certificate Page
                    </a>
                </div>
                
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">
                        <strong>Need Help?</strong> Contact us at support@futureproof.com
                    </p>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>FUTURE PROOF Learning Platform</strong>
                </p>
            </div>
        </div>
        `;

        const attachments = [];
        if (pdfData) {
            const pdfBuffer = Buffer.from(pdfData.split(',')[1] || pdfData, 'base64');
            attachments.push({
                filename: `${certificate.certificateNumber}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf'
            });
        }

        const emailResult = await sendUserEmail({
            to: user.email,
            subject: emailSubject,
            html: emailBody,
            attachments
        });

        if (!emailResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send certificate email',
                error: emailResult.reason
            });
        }

        return res.status(200).json({
            success: true,
            message: `Certificate sent successfully to ${user.email}`,
            recipient: user.email
        });

    } catch (error) {
        console.error('Error sending certificate email:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send certificate. Please try again later.',
            error: error.message
        });
    }
};
