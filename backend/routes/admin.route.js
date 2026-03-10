import express from 'express';
import { login, logout, purchasesOverview, signup, uploadProfilePhoto, getAdminProfile, getAdminPreviewByEmail } from '../controllers/admin.controllers.js';
import adminMiddleware from '../middlewares/admin.mid.js';


const router=express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.get("/preview", getAdminPreviewByEmail)
router.get("/logout", logout)
router.get("/purchases-overview", adminMiddleware, purchasesOverview)
router.post("/upload-profile-photo", adminMiddleware, uploadProfilePhoto)
router.get("/profile", adminMiddleware, getAdminProfile)

export default router;
