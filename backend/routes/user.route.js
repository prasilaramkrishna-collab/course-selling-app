import express from 'express';
import { login, logout, purchases, signup, verifyEmail, resetPassword, createOrder, createCartPaymentIntent, uploadProfilePhoto, getUserProfile, updateLanguagePreference } from '../controllers/user.controllers.js';
import { Purchase } from '../models/purchase.model.js';
import userMiddleware from '../middlewares/user.mid.js';
const router=express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.get("/logout", logout)
router.post("/verify-email", verifyEmail)
router.post("/reset-password", resetPassword)
router.get("/purchases", userMiddleware, purchases);
router.post("/order", userMiddleware, createOrder);
router.post("/create-cart-payment-intent", userMiddleware, createCartPaymentIntent);
router.post("/upload-profile-photo", userMiddleware, uploadProfilePhoto);
router.get("/profile", userMiddleware, getUserProfile);
router.post("/update-language", userMiddleware, updateLanguagePreference);
export default router;
