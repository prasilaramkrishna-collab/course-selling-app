import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function CourseMaterials() {
  const [coursesWithMaterials, setCoursesWithMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoursesWithMaterials = async () => {
      try {
        const admin = JSON.parse(localStorage.getItem("admin"));
        const token = admin?.token;

        if (!token) {
          navigate("/admin/login");
          return;
        }

        const response = await api.get(
          "/api/v1/course/materials/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        console.log("Courses with materials:", response.data.courses);
        setCoursesWithMaterials(response.data.courses || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses with materials:", error);
        toast.error("Failed to load course materials");
        setLoading(false);
      }
    };

    fetchCoursesWithMaterials();
  }, [navigate]);

  const filteredCourses = coursesWithMaterials.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading course materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          📚 Course Materials Library
        </h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-blue-600">
              {coursesWithMaterials.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Materials</p>
            <p className="text-3xl font-bold text-green-600">
              {coursesWithMaterials.reduce(
                (sum, course) => sum + course.materialCount,
                0
              )}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Courses with No Materials</p>
            <p className="text-3xl font-bold text-orange-600">
              {coursesWithMaterials.filter((c) => c.materialCount === 0).length}
            </p>
          </div>
        </div>

        {/* Courses List */}
        {filteredCourses.length > 0 ? (
          <div className="space-y-4">
            {filteredCourses.map((course, index) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedCourse(expandedCourse === index ? null : index)
                  }
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {course.image?.url && (
                      <img
                        src={course.image.url}
                        alt={course.title}
                        className="w-16 h-16 rounded object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {course.title}
                      </h2>
                      <p className="text-gray-600">
                        📦 {course.materialCount}{" "}
                        {course.materialCount === 1 ? "material" : "materials"}
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl">
                    {expandedCourse === index ? "▼" : "▶"}
                  </span>
                </button>

                {/* Materials List */}
                {expandedCourse === index && (
                  <div className="border-t bg-gray-50 p-6">
                    {course.materialCount > 0 ? (
                      <div className="space-y-3">
                        {course.materials.map((material, matIndex) => (
                          <div
                            key={matIndex}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-2xl">
                                    {material.type === "video" && "🎥"}
                                    {material.type === "pdf" && "📄"}
                                    {material.type === "doc" && "📝"}
                                    {material.type === "other" && "📎"}
                                  </span>
                                  <h3 className="font-semibold text-gray-900">
                                    {material.title}
                                  </h3>
                                </div>
                                <a
                                  href={material.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                                >
                                  {material.link}
                                </a>
                                <p className="text-xs text-gray-500 mt-1">
                                  Type: {material.type}
                                </p>
                              </div>
                              <button
                                onClick={() => handleCopyLink(material.link)}
                                className="flex-shrink-0 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">
                          ℹ️ No materials added yet
                        </p>
                        <button
                          onClick={() =>
                            navigate(`/admin/update-course/${course._id}`)
                          }
                          className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Add Materials
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No courses found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseMaterials;
