import dotenv from "dotenv";
import mongoose from "mongoose";
import { Course } from "../models/course.model.js";

dotenv.config();

const buildFallbackQuiz = (course) => {
  const topics = [];
  const plan = Array.isArray(course.coursePlan) ? course.coursePlan : [];

  for (const moduleItem of plan) {
    if (Array.isArray(moduleItem.topics)) {
      for (const topic of moduleItem.topics) {
        if (typeof topic === "string" && topic.trim()) {
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
    : [course.title, "Course Basics", "Core Concepts", "Best Practices", "Final Review"];

  return baseTopics.slice(0, 8).map((topic, index) => ({
    questionNumber: index + 1,
    question: "Which topic is covered in this course?",
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
      if (!q.question || options.length < 2) return null;
      const safeOptions = options.slice(0, 4);
      return {
        questionNumber: q.questionNumber || index + 1,
        question: q.question,
        options: safeOptions,
        correctAnswer: safeOptions.includes(q.correctAnswer) ? q.correctAnswer : safeOptions[0],
        explanation: q.explanation || "",
      };
    })
    .filter(Boolean);
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const courses = await Course.find({});
  let updatedCount = 0;

  for (const course of courses) {
    const normalized = normalizeQuiz(course.quiz || []);
    if (normalized.length > 0 && normalized.length === (course.quiz || []).length) {
      continue;
    }

    course.quiz = normalized.length > 0 ? normalized : buildFallbackQuiz(course);
    await course.save();
    updatedCount += 1;
  }

  console.log(`Quiz backfill complete. Updated ${updatedCount} course(s).`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Quiz backfill failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
