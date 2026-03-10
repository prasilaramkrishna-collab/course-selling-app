import express from 'express';
import {
     createCourse,
     updateCourse,
     deleteCourse,
     getCourses,
     courseDetails,
     buyCourses,
     getCourseMaterials,
     getAllCoursesWithMaterials,
     getCoursePlan,
     updateLessonCompletion
} from '../controllers/course.controllers.js';
import  userMiddleware  from '../middlewares/user.mid.js';
import adminMiddleware from '../middlewares/admin.mid.js';

const router=express.Router();

router.post("/create",adminMiddleware, createCourse)
router.put("/update/:courseId",adminMiddleware, updateCourse)
router.delete("/delete/:courseId",adminMiddleware, deleteCourse)
router.get("/courses", getCourses)
router.get("/materials/all", getAllCoursesWithMaterials)
router.get("/:courseId/plan", userMiddleware, getCoursePlan)
router.put("/:courseId/progress/lesson", userMiddleware, updateLessonCompletion)
router.get("/:courseId/materials", getCourseMaterials)
router.get("/:courseId", courseDetails)

router.post("/buy/:courseId", userMiddleware, buyCourses)

export default router;