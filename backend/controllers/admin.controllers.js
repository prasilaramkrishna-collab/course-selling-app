import { Admin } from '../models/admin.model.js';
import { Purchase } from '../models/purchase.model.js';
import { Course } from '../models/course.model.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { z } from "zod";
import jwt from 'jsonwebtoken';
import config from '../config.js';
import { v2 as cloudinary } from 'cloudinary';

export const signup=async(req,res)=>{
   const {firstName,lastName,email,password}=req.body;

   const adminSchema=z.object({
      firstName: z.string().min(3,{message:"First name must be at least 3 characters"}).max(50,{message:"First name must be at most 50 characters"}),
      lastName: z.string().min(3,{message:"Last name must be at least 3 characters"}).max(50,{message:"Last name must be at most 50 characters"}),
      email: z.string().email(),
      password: z.string().min(6,{message:"Password must be at least 6 characters"}),
   });

   const validatedData=adminSchema.safeParse(req.body);
   if(!validatedData.success){
      return res.status(400).json({ errors: validatedData.error.issues.map(err => err.message)});
   }

   const hashedPassword=await bcrypt.hash(password,10);
   console.log('SIGNUP BODY:', req.body);
   try{
      const existingAdmin=await Admin.findOne({email:email});
      if(existingAdmin){
          return res.status(400).json({ errors: "Admin already exists" });
      }
      const newAdmin=new Admin({firstName,lastName,email,password:hashedPassword});
      await newAdmin.save();
      res.status(201).json({ message: "Signup successful" , newAdmin});
   }catch(error){
      console.error("Error during signup:", error);
      res.status(500).json({ errors: "Error during signup"});
   }
};

export const login=async(req,res)=>{
   const {email,password}=req.body;
      try{
         const admin= await Admin.findOne({email:email});
         if(!admin){
            return res.status(403).json({ errors: "Invalid credentials" });
         }
         const isPasswordCorrect=await bcrypt.compare(password,admin.password);
         if(!isPasswordCorrect){
            return res.status(403).json({ errors: "Invalid credentials" });
         }

         // Debug: log the JWT secret
         console.log('JWT_ADMIN_PASSWORD:', config.JWT_ADMIN_PASSWORD);

         //jwt  code
         const token = jwt.sign({
            id: admin._id ,
           },
            config.JWT_ADMIN_PASSWORD,
            {expiresIn: '7d'}
           );
           const cookieOptions = {
           expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
            httpOnly: true,//cant be accessed via js directly
            secure: false, // Set to true in production with HTTPS
            sameSite: 'Lax'//csrf attack prevention, Lax allows cookies in same-site navigation
           };
         res.cookie("jwt", token, cookieOptions);
         res.status(201).json({ message: "Login successful", admin, token });
      }catch(error){
        console.error("Error during login:", error);
        res.status(500).json({ errors: "Error during login"});
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

export const purchasesOverview = async (req, res) => {
   try {
      const purchases = await Purchase.find({})
         .populate({ path: "userId", model: User, select: "firstName lastName email" })
         .populate({ path: "courseId", model: Course, select: "title price" })
         .sort({ _id: -1 })
         .limit(30);

      const purchaseRows = purchases.map((purchase) => ({
         purchaseId: purchase._id,
         buyerName: `${purchase?.userId?.firstName || ""} ${purchase?.userId?.lastName || ""}`.trim() || "Unknown User",
         buyerEmail: purchase?.userId?.email || "N/A",
         courseTitle: purchase?.courseId?.title || "Unknown Course",
         amount: Number(purchase?.courseId?.price || 0),
      }));

      const totalPurchases = purchaseRows.length;
      const totalRevenue = purchaseRows.reduce((sum, row) => sum + row.amount, 0);

      res.status(200).json({
         totalPurchases,
         totalRevenue,
         purchaseRows,
      });
   } catch (error) {
      console.error("Error fetching purchases overview:", error);
      res.status(500).json({ errors: "Error fetching purchases overview" });
   }
};

// UPLOAD PROFILE PHOTO
export const uploadProfilePhoto = async (req, res) => {
   const adminId = req.adminId;

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

      // Get admin
      const admin = await Admin.findById(adminId);
      if (!admin) {
         return res.status(404).json({ errors: 'Admin not found' });
      }

      // Delete old photo from cloudinary if it exists
      if (admin.profilePhoto) {
         try {
            const publicId = admin.profilePhoto.split('/').pop().split('.')[0];
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

      // Update admin with new photo URL
      admin.profilePhoto = cloud_response.secure_url;
      await admin.save();

      return res.status(200).json({
         success: true,
         message: 'Profile photo updated successfully',
         profilePhoto: admin.profilePhoto
      });
   } catch (error) {
      console.error('Error uploading profile photo:', error);
      return res.status(500).json({ errors: 'Error uploading profile photo' });
   }
};

// GET ADMIN PROFILE
export const getAdminProfile = async (req, res) => {
   const adminId = req.adminId;

   try {
      const admin = await Admin.findById(adminId).select('-password');
      if (!admin) {
         return res.status(404).json({ errors: 'Admin not found' });
      }

      return res.status(200).json({
         success: true,
         admin: {
            _id: admin._id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            profilePhoto: admin.profilePhoto
         }
      });
   } catch (error) {
      console.error('Error fetching admin profile:', error);
      return res.status(500).json({ errors: 'Error fetching profile' });
   }
};

