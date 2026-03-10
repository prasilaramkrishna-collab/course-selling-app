import express from 'express';
import { getUserCertificate, getAllUserCertificates, verifyCertificate, getAllCertificates, sendCertificateEmail } from '../controllers/certificate.controller.js';
import userMiddleware from '../middlewares/user.mid.js';
import adminMiddleware from '../middlewares/admin.mid.js';

const router = express.Router();

// GET /api/certificate/:courseId - Get certificate for a specific course
router.get('/course/:courseId', userMiddleware, getUserCertificate);

// GET /api/certificate/all - Get all user certificates
router.get('/all', userMiddleware, getAllUserCertificates);

// GET /api/certificate/admin/all-certificates - Get all certificates (ADMIN)
router.get('/admin/all-certificates', adminMiddleware, getAllCertificates);

// GET /api/certificate/verify/:certificateNumber - Verify certificate
router.get('/verify/:certificateNumber', verifyCertificate);

// POST /api/certificate/email/:courseId - Send certificate via email
router.post('/email/:courseId', userMiddleware, sendCertificateEmail);

export default router;
