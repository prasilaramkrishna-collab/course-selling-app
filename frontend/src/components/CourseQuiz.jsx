import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import FeedbackForm from "./FeedbackForm";
import { useLanguage } from "../context/LanguageContext";
function CourseQuiz() {
  const { courseId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [codingAnswer, setCodingAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [timeLeft, setTimeLeft] = useState(null); // in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [viewingCodingProblem, setViewingCodingProblem] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const text = {
    English: {
      noQuiz: "No quiz available for this course",
      failedLoadQuiz: "Failed to load quiz",
      selectAnswer: "Please select an answer before proceeding",
      answerAll: "Please answer all questions before submitting",
      submitError: "Error submitting quiz",
      loadingQuiz: "Loading quiz...",
      quizUnavailable: "Quiz not available",
      congratulations: "Congratulations!",
      passedQuiz: "You Passed the Quiz!",
      quizCompleted: "Quiz Completed",
      passCriteria: "You need 70% or higher to pass and receive a certificate",
      score: "Score",
      percentage: "Percentage",
      status: "Status",
      viewCertificate: "View & Download Certificate",
      feedbackPrompt: "We'd love to hear about your experience!",
      shareFeedback: "Share Your Feedback",
      feedbackRequired: "Submit feedback to unlock your certificate",
      feedbackCompleted: "Feedback submitted. Your certificate is now ready.",
      backToPurchases: "Back to Purchases",
      question: "Question",
      of: "of",
      previous: "Previous",
      next: "Next",
      submitQuiz: "Submit Quiz",
      answerProgress: "Answer Progress:",
      timeRemaining: "Time Remaining:",
      timeUp: "Time's up! Quiz auto-submitted.",
      codingProblem: "Coding Problem",
      writeYourCode: "Write your code here...",
      testCases: "Test Cases:",
      hints: "Hints:",
      viewCodingProblem: "View Coding Problem",
      backToQuiz: "Back to Quiz Questions",
    },
    Hindi: {
      noQuiz: "इस कोर्स के लिए कोई क्विज उपलब्ध नहीं है",
      failedLoadQuiz: "क्विज लोड करने में विफल",
      selectAnswer: "आगे बढ़ने से पहले उत्तर चुनें",
      answerAll: "सबमिट करने से पहले सभी प्रश्नों का उत्तर दें",
      submitError: "क्विज सबमिट करने में त्रुटि",
      loadingQuiz: "क्विज लोड हो रही है...",
      quizUnavailable: "क्विज उपलब्ध नहीं है",
      congratulations: "बधाई हो!",
      passedQuiz: "आप क्विज पास हो गए!",
      quizCompleted: "क्विज पूर्ण हुई",
      passCriteria: "पास होने और प्रमाणपत्र पाने के लिए 70% या अधिक चाहिए",
      score: "स्कोर",
      percentage: "प्रतिशत",
      status: "स्थिति",
      viewCertificate: "प्रमाणपत्र देखें और डाउनलोड करें",
      feedbackPrompt: "हम आपके अनुभव के बारे में सुनना चाहेंगे!",
      shareFeedback: "अपना फीडबैक साझा करें",
      feedbackRequired: "प्रमाणपत्र खोलने के लिए फीडबैक सबमिट करें",
      feedbackCompleted: "फीडबैक सबमिट हो गया। आपका प्रमाणपत्र अब तैयार है।",
      backToPurchases: "खरीदारी पर वापस जाएं",
      question: "प्रश्न",
      of: "में से",
      previous: "पिछला",
      next: "अगला",
      submitQuiz: "क्विज सबमिट करें",
      answerProgress: "उत्तर प्रगति:",
      timeRemaining: "शेष समय:",
      timeUp: "समय समाप्त! क्विज स्वतः सबमिट हुई।",
      codingProblem: "कोडिंग समस्या",
      writeYourCode: "अपना कोड यहाँ लिखें...",
      testCases: "परीक्षण मामले:",
      hints: "संकेत:",
      viewCodingProblem: "कोडिंग समस्या देखें",
      backToQuiz: "क्विज प्रश्नों पर वापस जाएं",
    },
    Kannada: {
      noQuiz: "ಈ ಕೋರ್ಸ್‌ಗೆ ಯಾವುದೇ ಕ್ವಿಜ್ ಲಭ್ಯವಿಲ್ಲ",
      failedLoadQuiz: "ಕ್ವಿಜ್ ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ",
      selectAnswer: "ಮುಂದುವರೆಯುವ ಮೊದಲು ಉತ್ತರ ಆಯ್ಕೆಮಾಡಿ",
      answerAll: "ಸಲ್ಲಿಸುವ ಮೊದಲು ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ",
      submitError: "ಕ್ವಿಜ್ ಸಲ್ಲಿಸುವಲ್ಲಿ ದೋಷ",
      loadingQuiz: "ಕ್ವಿಜ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      quizUnavailable: "ಕ್ವಿಜ್ ಲಭ್ಯವಿಲ್ಲ",
      congratulations: "ಅಭಿನಂದನೆಗಳು!",
      passedQuiz: "ನೀವು ಕ್ವಿಜ್ ಪಾಸಾಗಿದ್ದೀರಿ!",
      quizCompleted: "ಕ್ವಿಜ್ ಪೂರ್ಣಗೊಂಡಿದೆ",
      passCriteria: "ಪಾಸ್ ಆಗಿ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಲು 70% ಅಥವಾ ಹೆಚ್ಚು ಬೇಕು",
      score: "ಸ್ಕೋರ್",
      percentage: "ಶೇಕಡಾವಾರು",
      status: "ಸ್ಥಿತಿ",
      viewCertificate: "ಪ್ರಮಾಣಪತ್ರ ನೋಡಿ ಮತ್ತು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      feedbackPrompt: "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಕೇಳಲು ನಾವು ಬಯಸುತ್ತೇವೆ!",
      shareFeedback: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಹಂಚಿಕೊಳ್ಳಿ",
      feedbackRequired: "ಪ್ರಮಾಣಪತ್ರ ತೆಗೆಯಲು ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ",
      feedbackCompleted: "ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಪ್ರಮಾಣಪತ್ರ ಈಗ ಸಿದ್ಧವಾಗಿದೆ.",
      backToPurchases: "ಖರೀದಿಗಳಿಗೆ ಹಿಂದಿರುಗಿ",
      question: "ಪ್ರಶ್ನೆ",
      of: "ರಲ್ಲಿ",
      previous: "ಹಿಂದಿನದು",
      next: "ಮುಂದಿನದು",
      submitQuiz: "ಕ್ವಿಜ್ ಸಲ್ಲಿಸಿ",
      answerProgress: "ಉತ್ತರ ಪ್ರಗತಿ:",
      timeRemaining: "ಉಳಿದ ಸಮಯ:",
      timeUp: "ಸಮಯ ಮುಗಿದಿದೆ! ಕ್ವಿಜ್ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ।",
      codingProblem: "ಕೋಡಿಂಗ್ ಸಮಸ್ಯೆ",
      writeYourCode: "ನಿಮ್ಮ ಕೋಡ್ ಇಲ್ಲಿ ಬರೆಯಿರಿ...",
      testCases: "ಪರೀಕ್ಷಾ ಪ್ರಕರಣಗಳು:",
      hints: "ಸುಳಿವುಗಳು:",
      viewCodingProblem: "ಕೋಡಿಂಗ್ ಸಮಸ್ಯೆಯನ್ನು ನೋಡಿ",
      backToQuiz: "ಕ್ವಿಜ್ ಪ್ರಶ್ನೆಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
    },
  };

  const t = text[language] || text.English;

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // Timer effect
  useEffect(() => {
    if (timerActive && timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timerActive && timeLeft === 0 && !submitted) {
      toast.error(t.timeUp);
      handleSubmitQuiz();
    }
  }, [timeLeft, timerActive, submitted]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/api/quiz/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setQuiz(response.data);
        setCourseName(response.data.courseTitle);
        setAnswers(Array(response.data.totalQuestions).fill(null));
        
        // Initialize timer (quiz time limit is in minutes, convert to seconds)
        const timeLimitInSeconds = (response.data.quizTimeLimit || 20) * 60;
        setTimeLeft(timeLimitInSeconds);
        setTimerActive(true);
        
        // Initialize coding answer with starter code if available
        if (response.data.codingProblems && response.data.codingProblems.length > 0) {
          setCodingAnswer(response.data.codingProblems[0].starterCode || "");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        if (error.response?.status === 404) {
          toast.error(t.noQuiz);
        } else {
          toast.error(t.failedLoadQuiz);
        }
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId, token, navigate]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchFeedbackStatus = async () => {
      try {
        const response = await api.get(`/api/feedback/check/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setHasSubmittedFeedback(Boolean(response.data?.hasFeedback));
      } catch (error) {
        console.error("Error checking feedback status:", error);
      }
    };

    fetchFeedbackStatus();
  }, [courseId, token]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion] === null) {
      toast.error(t.selectAnswer);
      return;
    }
    if (currentQuestion < quiz.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (answers.includes(null)) {
      toast.error(t.answerAll);
      return;
    }

    try {
      const formattedAnswers = answers.map((answer, index) => ({
        questionNumber: index + 1,
        selectedAnswer: answer,
      }));

      const response = await api.post(
        "/api/quiz/submit",
        {
          courseId,
          answers: formattedAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setResult(response.data.submission);
      setSubmitted(true);

      if (response.data.submission?.status === "passed" && !hasSubmittedFeedback) {
        setShowFeedback(true);
      }

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error(error.response?.data?.message || t.submitError);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">{t.loadingQuiz}</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">{t.quizUnavailable}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <>
        {showFeedback && result.status === "passed" && (
          <FeedbackForm
            courseId={courseId}
            courseName={courseName}
            onSubmitSuccess={() => {
              setHasSubmittedFeedback(true);
              setShowFeedback(false);
              toast.success(t.feedbackCompleted);
              navigate(`/certificate/${courseId}`);
            }}
            onCancel={() => {
              setShowFeedback(false);
            }}
          />
        )}
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="mb-6">
                {result.status === "passed" ? (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-3xl font-bold text-green-600">
                      {t.congratulations}
                    </h1>
                    <p className="text-gray-600 mt-2">{t.passedQuiz}</p>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">📚</div>
                    <h1 className="text-3xl font-bold text-orange-600">
                      {t.quizCompleted}
                    </h1>
                    <p className="text-gray-600 mt-2">{t.passCriteria}</p>
                  </>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 mb-6 text-white">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm opacity-80">{t.score}</p>
                    <p className="text-3xl font-bold">
                      {result.score}/{result.totalQuestions}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">{t.percentage}</p>
                    <p className="text-3xl font-bold">{result.percentage}%</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">{t.status}</p>
                    <p className="text-2xl font-bold uppercase">
                      {result.status}
                    </p>
                  </div>
                </div>
              </div>

              {result.status === "passed" && (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    {hasSubmittedFeedback ? t.feedbackCompleted : t.feedbackRequired}
                  </p>

                  {hasSubmittedFeedback ? (
                    <button
                      onClick={() => navigate(`/certificate/${courseId}`)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold mb-4 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🎓</span>
                      {t.viewCertificate}
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowFeedback(true)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold mb-4 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>⭐</span>
                      {t.shareFeedback}
                    </button>
                  )}
                </>
              )}

              <button
                onClick={() => navigate("/purchases")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {t.backToPurchases}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentQ = quiz.quiz[currentQuestion];
  const hasCodingProblem = quiz.codingProblems && quiz.codingProblems.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Timer Display */}
          <div className="mb-6 flex justify-between items-center bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg">
            <div>
              <p className="text-sm opacity-90">{t.timeRemaining}</p>
              <p className="text-3xl font-bold">{formatTime(timeLeft)}</p>
            </div>
            {hasCodingProblem && (
              <button
                onClick={() => setViewingCodingProblem(!viewingCodingProblem)}
                className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {viewingCodingProblem ? t.backToQuiz : t.viewCodingProblem}
              </button>
            )}
          </div>

          {!viewingCodingProblem ? (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <h2 className="text-sm font-semibold text-gray-700">
                    {t.question} {currentQuestion + 1} {t.of} {quiz.totalQuestions}
                  </h2>
                  <span className="text-sm font-semibold text-indigo-600">
                    {Math.round(((currentQuestion + 1) / quiz.totalQuestions) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestion + 1) / quiz.totalQuestions) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(option)}
                    className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                      answers[currentQuestion] === option
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion] === option
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-gray-300"
                        }`}
                      >
                        {answers[currentQuestion] === option && (
                          <span className="text-white text-sm">✓</span>
                        )}
                      </div>
                      <span className="font-medium text-gray-800">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← {t.previous}
            </button>

            {currentQuestion < quiz.quiz.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                {t.next} →
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {t.submitQuiz}
              </button>
            )}
          </div>

          {/* Question Indicators */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3">{t.answerProgress}</p>
            <div className="flex flex-wrap gap-2">
              {quiz.quiz.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (answers[index] !== null) {
                      setCurrentQuestion(index);
                    }
                  }}
                  className={`w-10 h-10 rounded-full font-semibold transition-all ${
                    answers[index] !== null
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
            </>
          ) : (
            <>
              {/* Coding Problem View */}
              {hasCodingProblem && (
                <div className="space-y-6">
                  <div className="border-l-4 border-indigo-600 pl-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {t.codingProblem}: {quiz.codingProblems[0].title}
                    </h2>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Difficulty:</span>{" "}
                      <span className={`px-2 py-1 rounded text-sm ${
                        quiz.codingProblems[0].difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                        quiz.codingProblems[0].difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {quiz.codingProblems[0].difficulty}
                      </span>
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-line">
                      {quiz.codingProblems[0].description}
                    </p>
                  </div>

                  {/* Code Editor */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.writeYourCode}
                    </label>
                    <textarea
                      value={codingAnswer}
                      onChange={(e) => setCodingAnswer(e.target.value)}
                      className="w-full h-64 p-4 font-mono text-sm border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none bg-gray-900 text-green-400"
                      placeholder="// Start coding here..."
                      spellCheck="false"
                    />
                  </div>

                  {/* Test Cases */}
                  {quiz.codingProblems[0].testCases && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {t.testCases}
                      </h3>
                      <div className="space-y-2">
                        {quiz.codingProblems[0].testCases.map((testCase, index) => (
                          <div key={index} className="bg-white p-3 rounded shadow-sm">
                            <p className="text-sm">
                              <span className="font-semibold">Input:</span> {testCase.input}
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold">Expected Output:</span> {testCase.expectedOutput}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hints */}
                  {quiz.codingProblems[0].hints && quiz.codingProblems[0].hints.length > 0 && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        💡 {t.hints}
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {quiz.codingProblems[0].hints.map((hint, index) => (
                          <li key={index} className="text-sm text-gray-700">{hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseQuiz;
