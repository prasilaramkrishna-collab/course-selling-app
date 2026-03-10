// CREATE COURSE CONTROLLER
import { Course } from '../models/course.model.js';
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from '../models/purchase.model.js';
import { CourseProgress } from '../models/courseProgress.model.js';
import mongoose from 'mongoose';

export const createCourse = async (req, res) => {
    const adminId = req.adminId;
    
    // Validate admin authentication
    if (!adminId) {
        console.error('ERROR: adminId is undefined - middleware may not have authenticated');
        return res.status(401).json({ errors: 'Authentication failed - admin ID not set' });
    }
    
    const { title, description, price } = req.body;
    try {
        // Validate required fields
        if (!title || !description || !price) {
            return res.status(400).json({ errors: 'All fields are required' });
        }
        // Validate file upload
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ errors: 'No file uploaded' });
        }
        const { image } = req.files;
        // Accept all image formats
        if (!image.mimetype.startsWith('image/')) {
            return res.status(400).json({ errors: 'Please upload a valid image file' });
        }
        // Upload to Cloudinary
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
        if (!cloud_response || cloud_response.error) {
            return res.status(500).json({ errors: 'Error uploading file to Cloudinary.' });
        }
        // Create course
        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.secure_url,
            },
            creatorId: adminId,
            materials: [] // Initialize with empty array
        };
        
        // Add materials if provided
        if (req.body.materials) {
            try {
                const parsedMaterials = JSON.parse(req.body.materials);
                courseData.materials = Array.isArray(parsedMaterials) ? parsedMaterials : [];
                console.log('Parsed materials:', courseData.materials);
            } catch (error) {
                console.log('Materials parsing error:', error);
                courseData.materials = [];
            }
        } else {
            console.log('No materials provided in request - initializing empty array');
        }
        
        const course = await Course.create(courseData);
        console.log('Created course with materials:', course.materials);
        res.json({ message: 'Course created successfully', course });
    } catch (error) {
        console.error('CREATE COURSE ERROR:', error);
        res.status(500).json({ error: 'Error creating course', details: error.message });
    }
};

export const updateCourse=async(req,res)=>{
    const adminId = req.adminId;
    
    // Validate admin authentication
    if (!adminId) {
        console.error('ERROR: adminId is undefined - middleware may not have authenticated');
        return res.status(401).json({ errors: 'Authentication failed - admin ID not set' });
    }
    
    const {courseId}=req.params;
    const { title, description, price } = req.body;
    
    try {
        // Validate course exists
        const courseSearch = await Course.findById(courseId);
        if (!courseSearch) {
            return res.status(404).json({ errors: "Course not found" });
        }
        
        // Check if course belongs to this admin or allow any admin to update (for convenience)
        // Comment out this check if you want only course creators to update
        if (courseSearch.creatorId && String(courseSearch.creatorId) !== String(adminId)) {
            console.log('Course owner:', courseSearch.creatorId, 'Current admin:', adminId);
            // Allow update anyway - uncomment the return below if you want strict ownership check
            // return res.status(403).json({ errors: "You can only update your own courses" });
        }
        
        // Prepare update data
        const updateData = { title, description, price };
        
        // Handle materials if provided
        if (req.body.materials) {
            try {
                const parsedMaterials = JSON.parse(req.body.materials);
                updateData.materials = Array.isArray(parsedMaterials) ? parsedMaterials : [];
                console.log('Update: Parsed materials:', updateData.materials);
            } catch (error) {
                console.log('Materials parsing error:', error);
                updateData.materials = [];
            }
        } else {
            console.log('Update: No materials in request');
        }

        // Handle course plan if provided
        if (req.body.coursePlan) {
            try {
                const parsedPlan = JSON.parse(req.body.coursePlan);
                updateData.coursePlan = Array.isArray(parsedPlan) ? parsedPlan : [];
                console.log('Update: Parsed course plan:', updateData.coursePlan);
            } catch (error) {
                console.log('Course plan parsing error:', error);
            }
        }

        // Handle quiz if provided
        if (req.body.quiz) {
            try {
                const parsedQuiz = JSON.parse(req.body.quiz);
                updateData.quiz = Array.isArray(parsedQuiz) ? parsedQuiz : [];
                console.log('Update: Parsed quiz:', updateData.quiz);
            } catch (error) {
                console.log('Quiz parsing error:', error);
            }
        }

        // Handle coding problems if provided
        if (req.body.codingProblems) {
            try {
                const parsedCodingProblems = JSON.parse(req.body.codingProblems);
                updateData.codingProblems = Array.isArray(parsedCodingProblems) ? parsedCodingProblems : [];
                console.log('Update: Parsed coding problems:', updateData.codingProblems);
            } catch (error) {
                console.log('Coding problems parsing error:', error);
            }
        }
        
        // Handle image upload if provided
        if (req.files && req.files.image) {
            const { image } = req.files;
            
            // Accept all image formats
            if (!image.mimetype.startsWith('image/')) {
                return res.status(400).json({ errors: 'Please upload a valid image file' });
            }
            
            // Upload to Cloudinary
            const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
            if (!cloud_response || cloud_response.error) {
                return res.status(500).json({ errors: 'Error uploading file to Cloudinary.' });
            }
            
            updateData.image = {
                public_id: cloud_response.public_id,
                url: cloud_response.secure_url,
            };
        }
        
        // Update course - use findByIdAndUpdate for better result handling
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedCourse) {
            return res.status(500).json({ errors: "Failed to update course" });
        }
        
        console.log('Course updated successfully:', updatedCourse._id);
        res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
    } catch(error) {
        console.log('Error in updating course:', error);
        res.status(500).json({ errors: "Error updating course", details: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    const adminId = req.adminId;
    
    // Validate admin authentication
    if (!adminId) {
        console.error('ERROR: adminId is undefined - middleware may not have authenticated');
        return res.status(401).json({ errors: 'Authentication failed - admin ID not set' });
    }
    
    const { courseId } = req.params;
    try {
        // Validate courseId as a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ errors: "Invalid courseId format" });
        }
        const course = await Course.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(courseId),
            creatorId: adminId,
        });
        if (!course) {
            return res.status(404).json({ errors: "Course not found" });
        }
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ errors: "Error deleting course" });
        console.log('Error in  deleting course:', error);
    }
};

export const getCourses=async(req,res)=>{
    try{
        const courses=await Course.find({}).lean();
        // Ensure materials is always an array
        const enrichedCourses = courses.map(course => ({
            ...course,
            materials: Array.isArray(course.materials) ? course.materials : []
        }));
        res.status(201).json({ courses: enrichedCourses });
    } catch(error) {
        res.status(500).json({ errors: "Error fetching courses" });
        console.log('Error in fetching courses:', error);
    }
}

export const courseDetails=async(req,res)=>{
    const {courseId}=req.params;
    try{
        const course=await Course.findById(courseId).lean();
        if(!course){
            return res.status(404).json({errors: "Course not found" });
        }
        // Ensure materials is always an array
        // Ensure coursePlan is always an array
        const enrichedCourse = {
            ...course,
            materials: Array.isArray(course.materials) ? course.materials : [],
            coursePlan: Array.isArray(course.coursePlan) ? course.coursePlan : [],
            quiz: Array.isArray(course.quiz) ? course.quiz : []
        };
        res.status(200).json({ course: enrichedCourse });
    } catch(error) {
        res.status(500).json({errors: "Error fetching course details" });
        console.log('Error in fetching course details:', error);
    }
}

export const buyCourses=async(req,res)=>{
    const {userId}=req;
    const {courseId}=req.params;

    try{
        const course=await Course.findById(courseId);
        if(!course){
            return res.status(404).json({errors: "Course not found" });
        }
        const existingPurchase=await Purchase.findOne({userId, courseId});
        if(existingPurchase){
            return res.status(400).json({errors: "Course already purchased" });
        }
        const newPurchase = new Purchase({ userId, courseId });
        await newPurchase.save();
        res.status(201).json({ message: "Course purchased successfully", newPurchase });
    }catch(error){
        res.status(500).json({ errors: "Error buying course" });
        console.log('Error in buying course:', error);
    
}
};

// GET COURSE MATERIALS
export const getCourseMaterials=async(req,res)=>{
    const {courseId}=req.params;
    try{
        const course=await Course.findById(courseId).select('title materials').lean();
        if(!course){
            return res.status(404).json({
                success: false,
                errors: "Course not found" 
            });
        }
        
        const materials = Array.isArray(course.materials) ? course.materials : [];
        
        res.status(200).json({ 
            success: true,
            courseTitle: course.title,
            materials: materials,
            materialCount: materials.length
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            errors: "Error fetching course materials" 
        });
        console.log('Error in fetching course materials:', error);
    }
};

// GET ALL COURSES WITH MATERIALS (for admin dashboard)
export const getAllCoursesWithMaterials=async(req,res)=>{
    try{
        const courses=await Course.find({}).select('title materials creatorId image').lean();
        
        const enrichedCourses = courses.map(course => ({
            _id: course._id,
            title: course.title,
            image: course.image,
            creatorId: course.creatorId,
            materials: Array.isArray(course.materials) ? course.materials : [],
            materialCount: Array.isArray(course.materials) ? course.materials.length : 0
        }));
        
        res.status(200).json({ 
            success: true,
            courses: enrichedCourses,
            totalCourses: enrichedCourses.length
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            errors: "Error fetching courses with materials" 
        });
        console.log('Error in fetching courses with materials:', error);
    }
};

const normalizeModules = (coursePlan = []) => {
    return (Array.isArray(coursePlan) ? coursePlan : []).map((moduleItem, moduleIndex) => {
        const lessonsFromModel = Array.isArray(moduleItem.lessons) ? moduleItem.lessons : [];
        const lessonsFromTopics = Array.isArray(moduleItem.topics)
            ? moduleItem.topics.map((topic) => ({ title: topic, duration: "" }))
            : [];

        const lessons = lessonsFromModel.length > 0 ? lessonsFromModel : lessonsFromTopics;

        return {
            moduleIndex,
            title: moduleItem.title || `Module ${moduleIndex + 1}`,
            description: moduleItem.description || "",
            duration: moduleItem.duration || "",
            lessons: lessons.map((lesson, lessonIndex) => ({
                lessonIndex,
                title: lesson.title || `Lesson ${lessonIndex + 1}`,
                duration: lesson.duration || "",
            })),
        };
    });
};

const calculateOverallProgress = (modules, completedLessons = []) => {
    const totalLessons = modules.reduce((acc, moduleItem) => acc + moduleItem.lessons.length, 0);
    if (totalLessons === 0) return 0;

    const completedSet = new Set(
        completedLessons.map((item) => `${item.moduleIndex}-${item.lessonIndex}`)
    );
    const completedCount = completedSet.size;
    return Math.round((completedCount / totalLessons) * 100);
};

export const getCoursePlan = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.userId;

    try {
        const course = await Course.findById(courseId)
            .select('title description estimatedDuration coursePlan')
            .lean();

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        const modules = normalizeModules(course.coursePlan);

        let progress = await CourseProgress.findOne({ userId, courseId }).lean();
        if (!progress) {
            progress = await CourseProgress.create({
                userId,
                courseId,
                completedLessons: [],
                overallProgress: 0,
            });
            progress = progress.toObject();
        }

        const completedSet = new Set(
            (progress.completedLessons || []).map((item) => `${item.moduleIndex}-${item.lessonIndex}`)
        );

        const modulesWithProgress = modules.map((moduleItem) => {
            const lessons = moduleItem.lessons.map((lesson) => ({
                ...lesson,
                completed: completedSet.has(`${moduleItem.moduleIndex}-${lesson.lessonIndex}`),
            }));

            const lessonCount = lessons.length;
            const completedCount = lessons.filter((lesson) => lesson.completed).length;

            return {
                ...moduleItem,
                lessons,
                progress: lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0,
            };
        });

        const overallProgress = calculateOverallProgress(modules, progress.completedLessons || []);

        return res.status(200).json({
            success: true,
            coursePlan: {
                courseId,
                courseName: course.title,
                overview: course.description,
                estimatedDuration: course.estimatedDuration || '',
                modules: modulesWithProgress,
                overallProgress,
            },
        });
    } catch (error) {
        console.log('Error fetching course plan:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching course plan',
        });
    }
};

export const updateLessonCompletion = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.userId;
    const { moduleIndex, lessonIndex, completed = true } = req.body;

    if (typeof moduleIndex !== 'number' || typeof lessonIndex !== 'number') {
        return res.status(400).json({
            success: false,
            message: 'moduleIndex and lessonIndex must be numbers',
        });
    }

    try {
        const course = await Course.findById(courseId).select('coursePlan').lean();
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        const modules = normalizeModules(course.coursePlan);
        if (!modules[moduleIndex] || !modules[moduleIndex].lessons[lessonIndex]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid moduleIndex or lessonIndex',
            });
        }

        let progress = await CourseProgress.findOne({ userId, courseId });
        if (!progress) {
            progress = await CourseProgress.create({
                userId,
                courseId,
                completedLessons: [],
                overallProgress: 0,
            });
        }

        const existingIndex = progress.completedLessons.findIndex(
            (item) => item.moduleIndex === moduleIndex && item.lessonIndex === lessonIndex
        );

        if (completed && existingIndex === -1) {
            progress.completedLessons.push({ moduleIndex, lessonIndex, completedAt: new Date() });
        }

        if (!completed && existingIndex !== -1) {
            progress.completedLessons.splice(existingIndex, 1);
        }

        progress.overallProgress = calculateOverallProgress(modules, progress.completedLessons);
        await progress.save();

        return res.status(200).json({
            success: true,
            message: completed ? 'Lesson marked completed' : 'Lesson marked incomplete',
            overallProgress: progress.overallProgress,
        });
    } catch (error) {
        console.log('Error updating lesson completion:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating lesson completion',
        });
    }
};