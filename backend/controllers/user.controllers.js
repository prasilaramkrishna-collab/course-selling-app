import { User } from '../models/user.model.js';
import { Purchase } from '../models/purchase.model.js';
import { Course } from '../models/course.model.js';
import bcrypt from 'bcryptjs';
import { z } from "zod";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../config.js';
import { v2 as cloudinary } from 'cloudinary';

export const signup=async(req,res)=>{
   const {firstName,lastName,email,password,language}=req.body;

   const userSchema=z.object({
      firstName: z.string().min(3,{message:"First name must be at least 3 characters"}).max(50,{message:"First name must be at most 50 characters"}),
      lastName: z.string().min(3,{message:"Last name must be at least 3 characters"}).max(50,{message:"Last name must be at most 50 characters"}),
      email: z.string().email(),
      password: z.string().min(6,{message:"Password must be at least 6 characters"}),
      language: z.enum(["English", "Hindi", "Kannada"]).optional(),
   });

   const validatedData=userSchema.safeParse(req.body);
   if(!validatedData.success){
      return res.status(400).json({ errors: validatedData.error.issues.map(err => err.message)});
   }

   const hashedPassword=await bcrypt.hash(password,10);
   console.log('SIGNUP BODY:', req.body);
   try{
      const existingUser=await User.findOne({email:email});
      if(existingUser){
          return res.status(400).json({ errors: "User already exists" });
      }

      let profilePhotoUrl = null;

      // Handle profile photo upload if provided
      if (req.files && req.files.profilePhoto) {
         const { profilePhoto } = req.files;
         
         // Validate file is an image
         if (!profilePhoto.mimetype.startsWith('image/')) {
            return res.status(400).json({ errors: 'Please upload a valid image file' });
         }

         // Upload to Cloudinary
         const cloud_response = await cloudinary.uploader.upload(profilePhoto.tempFilePath, {
            folder: 'profile_photos'
         });

         if (!cloud_response || cloud_response.error) {
            return res.status(500).json({ errors: 'Error uploading profile photo' });
         }

         profilePhotoUrl = cloud_response.secure_url;
      }

      const newUser=new User({
         firstName,
         lastName,
         email,
         password:hashedPassword,
         profilePhoto: profilePhotoUrl,
         language: language || 'English'
      });
      await newUser.save();
      res.status(201).json({ message: "Signup successful" , newUser});
   }catch(error){
      console.error("Error during signup:", error);
      res.status(500).json({ errors: "Error during signup", details: error.message, stack: error.stack });
   }
};

export const login=async(req,res)=>{
   const {email,password}=req.body;
      try{
         const user= await User.findOne({email:email});
         if(!user){
            return res.status(403).json({ errors: "Invalid credentials" });
         }
         const isPasswordCorrect=await bcrypt.compare(password,user.password);
         if(!isPasswordCorrect){
            return res.status(403).json({ errors: "Invalid credentials" });
         }

         // Debug: log the JWT secret
         console.log('JWT_USER_PASSWORD:', config.JWT_USER_PASSWORD);

         //jwt  code
         const token = jwt.sign({
            id: user._id ,
           },
            config.JWT_USER_PASSWORD,
            {expiresIn: '7d'}
           );
           const cookieOptions = {
           expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
            httpOnly: true,//cant be accessed via js directly
            secure: false, // Set to true in production with HTTPS
            sameSite: 'Lax'//csrf attack prevention, Lax allows cookies in same-site navigation
           };
         res.cookie("jwt", token, cookieOptions);
         res.status(201).json({ message: "Login successful", user, token });
      }catch(error){
        console.error("Error during login:", error);
        res.status(500).json({ errors: "Error during login", details: error.message, stack: error.stack });
      }
};

export const logout=async(req,res)=>{
   try{
    if (!req.cookies.jwt) {
        return res.status(400).json({ errors: "Kindly login first" });
    }
   const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax'
   };
   res.clearCookie("jwt", cookieOptions);
   res.status(200).json({ message: "Logged out successfully" });
   }catch(error){
      console.error("Error during logout:", error);
      res.status(500).json({ errors: "Error during logout"});
   }
};

export const purchases=async(req,res)=>{
   const userId = req.userId;

   try{
      // Ensure userId is an ObjectId
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const purchased = await Purchase.find({ userId: userObjectId });
      
      if (purchased.length === 0) {
         return res.status(200).json({ purchased: [], courseData: [] });
      }

      let purchasedCourseId = [];
      for(let i=0; i<purchased.length; i++){
         purchasedCourseId.push(purchased[i].courseId);
      }

      // Explicitly select all fields including materials
      const courseData = await Course.find({ 
         _id: { $in: purchasedCourseId } 
      }).select('+title +description +price +image +materials +creatorId');

      console.log('Purchases: Found', courseData.length, 'courses');
      courseData.forEach((course, idx) => {
         console.log(`Course ${idx} (${course.title}): materials =`, course.materials, 'materials count:', Array.isArray(course.materials) ? course.materials.length : 'not an array');
      });

      // Ensure materials is always an array
      const enrichedCourseData = courseData.map(course => ({
         ...course.toObject ? course.toObject() : course,
         materials: Array.isArray(course.materials) ? course.materials : []
      }));

      res.status(200).json({ purchased, courseData: enrichedCourseData });
   }catch(error){
      res.status(500).json({ errors: "Error fetching purchases" });
      console.log("Error in purchase", error);
   }
};

export const verifyEmail=async(req,res)=>{
   const {email}=req.body;
   try{
      const user = await User.findOne({email:email});
      if(!user){
         return res.status(404).json({ errors: "Email not found in our records" });
      }
      res.status(200).json({ message: "Email verified successfully" });
   }catch(error){
      console.error("Error verifying email:", error);
      res.status(500).json({ errors: "Error verifying email" });
   }
};

export const resetPassword=async(req,res)=>{
   const {email, newPassword}=req.body;
   try{
      if(!email || !newPassword){
         return res.status(400).json({ errors: "Email and password are required" });
      }
      if(newPassword.length < 6){
         return res.status(400).json({ errors: "Password must be at least 6 characters" });
      }
      
      const user = await User.findOne({email:email});
      if(!user){
         return res.status(404).json({ errors: "User not found" });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updateOne({email:email}, {password: hashedPassword});
      
      res.status(200).json({ message: "Password reset successfully" });
   }catch(error){
      console.error("Error resetting password:", error);
      res.status(500).json({ errors: "Error resetting password" });
   }
};

export const createOrder = async (req, res) => {
   const { userId, courseId, paymentId, amount, status } = req.body;
   
   try {
      if (!userId || !courseId) {
         return res.status(400).json({ errors: "Missing required fields" });
      }

      // Check if course exists
      const course = await Course.findById(courseId);
      if (!course) {
         return res.status(404).json({ errors: "Course not found" });
      }

      // Check if already purchased
      const existingPurchase = await Purchase.findOne({ userId, courseId });
      if (existingPurchase) {
         return res.status(400).json({ errors: "Course already purchased" });
      }

      // Create new purchase
      const newPurchase = new Purchase({ 
         userId, 
         courseId
      });
      await newPurchase.save();

      res.status(201).json({ 
         message: "Order completed successfully", 
         purchase: newPurchase 
      });
   } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ errors: "Error completing order" });
   }
};

export const createCartPaymentIntent = async (req, res) => {
   const { amount, courseIds } = req.body;
   const userId = req.userId;

   try {
      if (!amount || !courseIds || courseIds.length === 0) {
         return res.status(400).json({ errors: "Invalid cart data" });
      }

      // Verify all courses exist
      const courses = await Course.find({ _id: { $in: courseIds } });
      if (courses.length !== courseIds.length) {
         return res.status(404).json({ errors: "Some courses not found" });
      }

      // Check if any course is already purchased
      const existingPurchases = await Purchase.find({ 
         userId, 
         courseId: { $in: courseIds } 
      });
      
      if (existingPurchases.length > 0) {
         const purchasedTitles = existingPurchases.map(p => 
            courses.find(c => c._id.toString() === p.courseId.toString())?.title
         ).filter(Boolean);
         return res.status(400).json({ 
            errors: `You have already purchased: ${purchasedTitles.join(', ')}` 
         });
      }

      // Check if Stripe is configured
      if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
         return res.status(503).json({ 
            errors: "Payment gateway not configured. Please contact administrator." 
         });
      }

      // TODO: In production, create real Stripe payment intent here
      // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      // const paymentIntent = await stripe.paymentIntents.create({
      //   amount: amount * 100, // Convert to cents
      //   currency: 'inr',
      //   metadata: { userId: userId.toString(), courseIds: courseIds.join(',') }
      // });
      // return res.status(200).json({ clientSecret: paymentIntent.client_secret, amount });
      
      return res.status(503).json({ 
         errors: "Stripe payment integration pending. Please configure Stripe to enable payments." 
      });
   } catch (error) {
      console.error("Error creating cart payment intent:", error);
      res.status(500).json({ errors: "Error initializing payment" });
   }
};

// UPLOAD PROFILE PHOTO
export const uploadProfilePhoto = async (req, res) => {
   const userId = req.userId;

   try {
      // Validate file upload
      if (!req.files || !req.files.profilePhoto) {
         return res.status(400).json({ errors: 'No file uploaded' });
      }

      const { profilePhoto } = req.files;

      // Validate file is an image
      if (!profilePhoto.mimetype.startsWith('image/')) {
         return res.status(400).json({ errors: 'Please upload a valid image file' });
      }

      // Get user
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ errors: 'User not found' });
      }

      // Delete old photo from cloudinary if it exists
      if (user.profilePhoto) {
         try {
            const publicId = user.profilePhoto.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
         } catch (err) {
            console.log('Error deleting old photo:', err);
         }
      }

      // Upload new photo to Cloudinary
      const cloud_response = await cloudinary.uploader.upload(profilePhoto.tempFilePath, {
         folder: 'profile_photos'
      });

      if (!cloud_response || cloud_response.error) {
         return res.status(500).json({ errors: 'Error uploading file to Cloudinary' });
      }

      // Update user with new photo URL
      user.profilePhoto = cloud_response.secure_url;
      await user.save();

      return res.status(200).json({
         success: true,
         message: 'Profile photo updated successfully',
         profilePhoto: user.profilePhoto
      });
   } catch (error) {
      console.error('Error uploading profile photo:', error);
      return res.status(500).json({ errors: 'Error uploading profile photo' });
   }
};

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
   const userId = req.userId;

   try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
         return res.status(404).json({ errors: 'User not found' });
      }

      return res.status(200).json({
         success: true,
         user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePhoto: user.profilePhoto,
            language: user.language
         }
      });
   } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ errors: 'Error fetching profile' });
   }
};

// UPDATE USER LANGUAGE PREFERENCE
export const updateLanguagePreference = async (req, res) => {
   const userId = req.userId;
   const { language } = req.body;

   try {
      if (!language) {
         return res.status(400).json({ errors: 'Language is required' });
      }

      const validLanguages = ["English", "Hindi", "Kannada"];
      if (!validLanguages.includes(language)) {
         return res.status(400).json({ errors: `Invalid language. Supported languages: ${validLanguages.join(', ')}` });
      }

      const user = await User.findByIdAndUpdate(
         userId,
         { language },
         { new: true }
      ).select('-password');

      if (!user) {
         return res.status(404).json({ errors: 'User not found' });
      }

      return res.status(200).json({
         success: true,
         message: 'Language preference updated successfully',
         user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePhoto: user.profilePhoto,
            language: user.language
         }
      });
   } catch (error) {
      console.error('Error updating language preference:', error);
      return res.status(500).json({ errors: 'Error updating language preference' });
   }
};

