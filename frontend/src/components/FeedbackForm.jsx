import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function FeedbackForm({ courseId, courseName, onSubmitSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    rating: 5,
    reviewTitle: "",
    reviewText: "",
    instructorRating: 5,
    contentRating: 5,
    recommendToOthers: true,
    improvements: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) : value,
    });
  };

  const handleRatingClick = (field, rating) => {
    setFormData({
      ...formData,
      [field]: rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.reviewTitle.trim() || !formData.reviewText.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.reviewText.length < 20) {
      toast.error("Review must be at least 20 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/api/feedback/submit",
        {
          courseId,
          rating: formData.rating,
          reviewTitle: formData.reviewTitle,
          reviewText: formData.reviewText,
          instructorRating: formData.instructorRating,
          contentRating: formData.contentRating,
          recommendToOthers: formData.recommendToOthers,
          improvements: formData.improvements,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Thank you! Your feedback has been submitted.");
        setLoading(false);
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      }
    } catch (error) {
      setLoading(false);
      const errorMsg = error.response?.data?.message || "Error submitting feedback";
      toast.error(errorMsg);
      console.error("Error submitting feedback:", error);
    }
  };

  const renderStars = (rating, field) => {
    return (
      <div className="flex gap-3 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRatingClick(field, star);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            className={`text-5xl cursor-pointer transition-all duration-200 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-300 hover:scale-125 active:scale-110`}
            style={{
              pointerEvents: "auto",
              userSelect: "none",
            }}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={(e) => {
      if (e.target === e.currentTarget && onCancel) {
        onCancel();
      }
    }}>
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 sticky top-0 z-10">
          <h2 className="text-2xl font-bold mb-2">Share Your Feedback</h2>
          <p className="text-blue-100">Help us improve! Let us know about your learning experience.</p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Ratings */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Overall Rating */}
              <div className="border border-blue-200 rounded-lg p-5 bg-blue-50 hover:bg-blue-100 transition-colors">
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  How would you rate this course overall?
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {renderStars(formData.rating, "rating")}
                  </div>
                  <p className="text-lg font-bold text-blue-600 ml-6 whitespace-nowrap">
                    {formData.rating}/5 ⭐
                  </p>
                </div>
              </div>

              {/* Instructor Rating */}
              <div className="border border-green-200 rounded-lg p-5 bg-green-50 hover:bg-green-100 transition-colors">
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  How would you rate the instructor?
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {renderStars(formData.instructorRating, "instructorRating")}
                  </div>
                  <p className="text-lg font-bold text-green-600 ml-6 whitespace-nowrap">
                    {formData.instructorRating}/5 ⭐
                  </p>
                </div>
              </div>

              {/* Content Rating */}
              <div className="border border-purple-200 rounded-lg p-5 bg-purple-50 hover:bg-purple-100 transition-colors">
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  How would you rate the course content/materials?
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {renderStars(formData.contentRating, "contentRating")}
                  </div>
                  <p className="text-lg font-bold text-purple-600 ml-6 whitespace-nowrap">
                    {formData.contentRating}/5 ⭐
                  </p>
                </div>
              </div>

              {/* Recommend Checkbox */}
              <div className="border border-yellow-200 rounded-lg p-5 bg-yellow-50 hover:bg-yellow-100 transition-colors">
                <label className="flex items-center cursor-pointer gap-3">
                  <input
                    type="checkbox"
                    name="recommendToOthers"
                    checked={formData.recommendToOthers}
                    onChange={handleChange}
                    className="w-6 h-6 text-yellow-500 rounded cursor-pointer accent-yellow-500"
                  />
                  <span className="text-lg font-semibold text-gray-800">
                    I would recommend this course to others
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Text Reviews */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Review Title */}
              <div>
                <label htmlFor="reviewTitle" className="block text-lg font-semibold text-gray-800 mb-2">
                  Review Title * <span className="text-red-500">required</span>
                </label>
                <input
                  type="text"
                  id="reviewTitle"
                  name="reviewTitle"
                  value={formData.reviewTitle}
                  onChange={handleChange}
                  placeholder="e.g., Excellent course structure, practical approach, worth the investment"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={100}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.reviewTitle.length}/100 characters
                </p>
              </div>

              {/* Review Text */}
              <div>
                <label htmlFor="reviewText" className="block text-lg font-semibold text-gray-800 mb-2">
                  Detailed Review * <span className="text-red-500">required (minimum 20 characters)</span>
                </label>
                <textarea
                  id="reviewText"
                  name="reviewText"
                  value={formData.reviewText}
                  onChange={handleChange}
                  placeholder="Please share your detailed experience, what was good, what could be improved, and any tips for other students..."
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  maxLength={2000}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.reviewText.length}/2000 characters
                </p>
              </div>

              {/* Improvements */}
              <div>
                <label htmlFor="improvements" className="block text-lg font-semibold text-gray-800 mb-2">
                  What could be improved? <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  id="improvements"
                  name="improvements"
                  value={formData.improvements}
                  onChange={handleChange}
                  placeholder="Share any suggestions for improving the course..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  maxLength={1000}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.improvements.length}/1000 characters
                </p>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-12 rounded-full transition-colors ${
                    s <= step ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-600">
              Step {step} of 2
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              {step === 2 ? "Skip Survey" : "Cancel"}
            </button>

            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Next →
              </button>
            )}

            {step === 2 && (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⌛</span> Submitting...
                    </>
                  ) : (
                    <>
                      <span>✓</span> Submit Feedback
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;
