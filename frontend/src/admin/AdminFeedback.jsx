import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { MdLibraryBooks, MdStar, MdStarBorder } from "react-icons/md";

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [filterRating, setFilterRating] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [adminProfile, setAdminProfile] = useState(null);

  const adminData = JSON.parse(localStorage.getItem("admin") || "null");
  const adminToken = adminData?.token;
  const adminName =
    `${adminData?.admin?.firstName || ""} ${adminData?.admin?.lastName || ""}`.trim() ||
    "Admin";

  useEffect(() => {
    if (adminToken) {
      fetchAdminProfile();
    }
  }, [adminToken]);

  const fetchAdminProfile = async () => {
    try {
      const response = await api.get("/api/v1/admin/profile", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        withCredentials: true,
      });
      setAdminProfile(response.data.admin);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!adminToken) {
        toast.error("Please login as admin");
        window.location.href = "/admin/login";
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/feedback/admin/all`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          withCredentials: true,
        });

        setFeedbacks(response.data?.feedbacks || []);
        setFilteredFeedbacks(response.data?.feedbacks || []);
      } catch (error) {
        console.log("Error fetching feedback", error);
        toast.error("Could not load feedback data");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [adminToken]);

  useEffect(() => {
    let filtered = [...feedbacks];

    // Filter by rating
    if (filterRating !== "all") {
      const rating = parseInt(filterRating);
      filtered = filtered.filter((f) => f.rating === rating);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.studentName?.toLowerCase().includes(search) ||
          f.courseName?.toLowerCase().includes(search) ||
          f.reviewTitle?.toLowerCase().includes(search) ||
          f.reviewText?.toLowerCase().includes(search)
      );
    }

    setFilteredFeedbacks(filtered);
  }, [filterRating, searchTerm, feedbacks]);

  const handleLogout = async () => {
    try {
      const response = await api.get(`/api/v1/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
      window.location.href = "/admin/login";
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
      localStorage.removeItem("admin");
      window.location.href = "/admin/login";
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <MdStar className="text-yellow-500 text-lg" />
            ) : (
              <MdStarBorder className="text-gray-300 text-lg" />
            )}
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const averageRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  const recommendationRate = feedbacks.length
    ? ((feedbacks.filter((f) => f.recommendToOthers).length / feedbacks.length) * 100).toFixed(0)
    : 0;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-5">
        <div className="flex items-center flex-col mb-10">
          <img 
            src={adminProfile?.profilePhoto || "/logo.webp"} 
            alt="Profile" 
            className="rounded-full h-20 w-20 object-cover border-2 border-gray-300" 
          />
          <h2 className="text-lg font-semibold mt-4">I'm Admin</h2>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin/dashboard">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
              Dashboard
            </button>
          </Link>
          <Link to="/admin/our-courses">
            <button className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded">
              Our Courses
            </button>
          </Link>
          <Link to="/admin/create-course">
            <button className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 rounded">
              Create Course
            </button>
          </Link>
          <Link to="/admin/course-materials">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded flex items-center justify-center">
              <MdLibraryBooks className="mr-2" /> Materials
            </button>
          </Link>
          <Link to="/admin/certificates">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded">
              📜 Certificates
            </button>
          </Link>
          <Link to="/admin/feedback">
            <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded">
              ⭐ User Feedback
            </button>
          </Link>
          <Link to="/">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
              Home
            </button>
          </Link>
          <Link to="/admin/login">
            <button
              onClick={handleLogout}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
            >
              Logout
            </button>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">User Feedback</h1>
          <p className="text-gray-600 mt-2">View and analyze all user course feedback</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm text-gray-500">Total Feedback</h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {loading ? "..." : feedbacks.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm text-gray-500">Average Rating</h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {loading ? "..." : `${averageRating} ⭐`}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm text-gray-500">Recommendation Rate</h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {loading ? "..." : `${recommendationRate}%`}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by student, course, or review..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Rating
              </label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            All Feedback ({filteredFeedbacks.length})
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading feedback...</p>
          ) : filteredFeedbacks.length === 0 ? (
            <p className="text-gray-500">
              {feedbacks.length === 0
                ? "No feedback submitted yet."
                : "No feedback matches your filters."}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredFeedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {feedback.reviewTitle}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        by <span className="font-medium">{feedback.studentName}</span>
                        {feedback.studentEmail && (
                          <span className="text-gray-500"> ({feedback.studentEmail})</span>
                        )}
                      </p>
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        Course: {feedback.courseName}
                      </p>
                    </div>
                    <div className="text-right">
                      {renderStars(feedback.rating)}
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(feedback.createdAt)}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{feedback.reviewText}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Instructor Rating</p>
                      <div className="flex items-center mt-1">
                        <MdStar className="text-yellow-500" />
                        <span className="ml-1 text-sm font-medium">
                          {feedback.instructorRating}/5
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Content Rating</p>
                      <div className="flex items-center mt-1">
                        <MdStar className="text-yellow-500" />
                        <span className="ml-1 text-sm font-medium">
                          {feedback.contentRating}/5
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Recommends</p>
                      <p className="text-sm font-medium mt-1">
                        {feedback.recommendToOthers ? (
                          <span className="text-green-600">✓ Yes</span>
                        ) : (
                          <span className="text-red-600">✗ No</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminFeedback;
