import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useLanguage } from "../context/LanguageContext";

function CoursePlan() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [coursePlan, setCoursePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const { language } = useLanguage();

  const text = {
    English: {
      failedLoadPlan: "Failed to load course plan",
      lessonCompleted: "Lesson marked completed",
      lessonIncomplete: "Lesson marked incomplete",
      failedUpdateLesson: "Failed to update lesson",
      loadingPlan: "Loading course plan...",
      planUnavailable: "Course plan unavailable.",
      planTitle: "Course Plan",
      noOverview: "No overview available.",
      estimatedDuration: "Estimated Duration",
      selfPaced: "Self-paced",
      overallProgress: "Overall Progress",
      modules: "Modules",
      module: "Module",
      noModuleDescription: "No module description.",
      duration: "Duration",
      flexible: "Flexible",
      complete: "complete",
      durationNotSpecified: "Duration not specified",
      saving: "Saving...",
      markIncomplete: "Mark Incomplete",
      markComplete: "Mark Complete",
      noLessons: "No lessons available for this module.",
      takeQuiz: "Take Quiz",
      backToPurchases: "Back to Purchases",
    },
    Hindi: {
      failedLoadPlan: "कोर्स प्लान लोड करने में विफल",
      lessonCompleted: "लेसन पूर्ण चिह्नित किया गया",
      lessonIncomplete: "लेसन अपूर्ण चिह्नित किया गया",
      failedUpdateLesson: "लेसन अपडेट करने में विफल",
      loadingPlan: "कोर्स प्लान लोड हो रहा है...",
      planUnavailable: "कोर्स प्लान उपलब्ध नहीं है।",
      planTitle: "कोर्स प्लान",
      noOverview: "कोई ओवरव्यू उपलब्ध नहीं है।",
      estimatedDuration: "अनुमानित अवधि",
      selfPaced: "स्व-गति",
      overallProgress: "कुल प्रगति",
      modules: "मॉड्यूल",
      module: "मॉड्यूल",
      noModuleDescription: "कोई मॉड्यूल विवरण नहीं।",
      duration: "अवधि",
      flexible: "लचीला",
      complete: "पूर्ण",
      durationNotSpecified: "अवधि निर्दिष्ट नहीं",
      saving: "सहेजा जा रहा है...",
      markIncomplete: "अपूर्ण चिह्नित करें",
      markComplete: "पूर्ण चिह्नित करें",
      noLessons: "इस मॉड्यूल के लिए कोई लेसन उपलब्ध नहीं है।",
      takeQuiz: "क्विज दें",
      backToPurchases: "खरीदारी पर वापस जाएं",
    },
    Kannada: {
      failedLoadPlan: "ಕೋರ್ಸ್ ಯೋಜನೆ ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ",
      lessonCompleted: "ಪಾಠ ಪೂರ್ಣಗೊಂಡಂತೆ ಗುರುತಿಸಲಾಗಿದೆ",
      lessonIncomplete: "ಪಾಠ ಅಪೂರ್ಣವಾಗಿ ಗುರುತಿಸಲಾಗಿದೆ",
      failedUpdateLesson: "ಪಾಠ ನವೀಕರಿಸಲು ವಿಫಲವಾಗಿದೆ",
      loadingPlan: "ಕೋರ್ಸ್ ಯೋಜನೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      planUnavailable: "ಕೋರ್ಸ್ ಯೋಜನೆ ಲಭ್ಯವಿಲ್ಲ.",
      planTitle: "ಕೋರ್ಸ್ ಯೋಜನೆ",
      noOverview: "ಯಾವುದೇ ಅವಲೋಕನ ಲಭ್ಯವಿಲ್ಲ.",
      estimatedDuration: "ಅಂದಾಜು ಅವಧಿ",
      selfPaced: "ಸ್ವಯಂ ವೇಗ",
      overallProgress: "ಒಟ್ಟು ಪ್ರಗತಿ",
      modules: "ಮಾಡ್ಯೂಲ್‌ಗಳು",
      module: "ಮಾಡ್ಯೂಲ್",
      noModuleDescription: "ಮಾಡ್ಯೂಲ್ ವಿವರಣೆ ಇಲ್ಲ.",
      duration: "ಅವಧಿ",
      flexible: "ಲಚೀಲ",
      complete: "ಪೂರ್ಣ",
      durationNotSpecified: "ಅವಧಿ ಸೂಚಿಸಲಾಗಿಲ್ಲ",
      saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",
      markIncomplete: "ಅಪೂರ್ಣ ಎಂದು ಗುರುತಿಸಿ",
      markComplete: "ಪೂರ್ಣ ಎಂದು ಗುರುತಿಸಿ",
      noLessons: "ಈ ಮಾಡ್ಯೂಲ್‌ಗೆ ಯಾವುದೇ ಪಾಠಗಳು ಲಭ್ಯವಿಲ್ಲ.",
      takeQuiz: "ಕ್ವಿಜ್ ತೆಗೆದುಕೊಳ್ಳಿ",
      backToPurchases: "ಖರೀದಿಗಳಿಗೆ ಹಿಂದಿರುಗಿ",
    },
  };

  const t = text[language] || text.English;

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const fetchCoursePlan = async () => {
    try {
      const response = await api.get(`/api/v1/course/${courseId}/plan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setCoursePlan(response.data.coursePlan);
    } catch (error) {
      toast.error(error.response?.data?.message || t.failedLoadPlan);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCoursePlan();
  }, [courseId, token]);

  const toggleLessonComplete = async (moduleIndex, lessonIndex, completed) => {
    const key = `${moduleIndex}-${lessonIndex}`;
    setSavingKey(key);
    try {
      await api.put(
        `/api/v1/course/${courseId}/progress/lesson`,
        {
          moduleIndex,
          lessonIndex,
          completed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      await fetchCoursePlan();
      toast.success(completed ? t.lessonCompleted : t.lessonIncomplete);
    } catch (error) {
      toast.error(error.response?.data?.message || t.failedUpdateLesson);
    } finally {
      setSavingKey("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">{t.loadingPlan}</p>
      </div>
    );
  }

  if (!coursePlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">{t.planUnavailable}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-900">{coursePlan.courseName} - {t.planTitle}</h1>
          <p className="text-slate-600 mt-2">{coursePlan.overview || t.noOverview}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">{t.estimatedDuration}</p>
              <p className="text-lg font-semibold text-blue-900">{coursePlan.estimatedDuration || t.selfPaced}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-sm text-emerald-700">{t.overallProgress}</p>
              <p className="text-lg font-semibold text-emerald-900">{coursePlan.overallProgress || 0}%</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <p className="text-sm text-indigo-700">{t.modules}</p>
              <p className="text-lg font-semibold text-indigo-900">{coursePlan.modules.length}</p>
            </div>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3 mt-5">
            <div
              className="h-3 rounded-full bg-linear-to-r from-emerald-500 to-blue-500"
              style={{ width: `${coursePlan.overallProgress || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-5">
          {coursePlan.modules.map((moduleItem) => (
            <div key={moduleItem.moduleIndex} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="p-5 border-b bg-linear-to-r from-slate-50 to-blue-50">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {t.module} {moduleItem.moduleIndex + 1}: {moduleItem.title}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">{moduleItem.description || t.noModuleDescription}</p>
                    <p className="text-sm text-slate-500 mt-1">{t.duration}: {moduleItem.duration || t.flexible}</p>
                  </div>
                  <span className="text-sm font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    {moduleItem.progress}% {t.complete}
                  </span>
                </div>
              </div>

              <div className="p-5">
                {moduleItem.lessons.length > 0 ? (
                  <ul className="space-y-3">
                    {moduleItem.lessons.map((lesson) => {
                      const key = `${moduleItem.moduleIndex}-${lesson.lessonIndex}`;
                      return (
                        <li
                          key={key}
                          className="flex items-center justify-between gap-4 p-3 border border-slate-200 rounded-lg"
                        >
                          <div>
                            <p className={`font-medium ${lesson.completed ? "text-emerald-700 line-through" : "text-slate-900"}`}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-slate-500">{lesson.duration || t.durationNotSpecified}</p>
                          </div>

                          <button
                            onClick={() =>
                              toggleLessonComplete(moduleItem.moduleIndex, lesson.lessonIndex, !lesson.completed)
                            }
                            disabled={savingKey === key}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                              lesson.completed
                                ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {savingKey === key ? t.saving : lesson.completed ? t.markIncomplete : t.markComplete}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-slate-500">{t.noLessons}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <Link
            to={`/quiz/${courseId}`}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {t.takeQuiz}
          </Link>
          <Link
            to="/purchases"
            className="px-5 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300"
          >
            {t.backToPurchases}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CoursePlan;
