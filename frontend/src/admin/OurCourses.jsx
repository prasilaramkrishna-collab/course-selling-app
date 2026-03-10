import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { RiHome2Fill } from "react-icons/ri";
import { FaBook } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdLibraryBooks } from "react-icons/md";

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminProfile, setAdminProfile] = useState(null);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  const token = admin?.token;

  useEffect(() => {
    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
    }
  }, [token, navigate]);

  // Fetch admin profile
  useEffect(() => {
    if (token) {
      fetchAdminProfile();
    }
  }, [token]);

  const fetchAdminProfile = async () => {
    try {
      const response = await api.get("/api/v1/admin/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setAdminProfile(response.data.admin);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(`/api/v1/course/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
        toast.error("Failed to load courses");
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  // delete courses code
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(
        `/api/v1/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter((course) => course._id !== id);
      setCourses(updatedCourses);
    } catch (error) {
      console.log("Error in deleting course ", error);
      const errorMsg = error.response?.data?.errors || error.message || "Error deleting course";
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

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
            <button className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2 rounded flex items-center justify-center">
              <RiHome2Fill className="mr-2" /> Dashboard
            </button>
          </Link>
          <Link to="/admin/our-courses">
            <button className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded flex items-center justify-center">
              <FaBook className="mr-2" /> Our Courses
            </button>
          </Link>
          <Link to="/admin/course-materials">
            <button className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded flex items-center justify-center">
              <MdLibraryBooks className="mr-2" /> Materials
            </button>
          </Link>
          <Link to="/admin/create-course">
            <button className="w-full bg-purple-700 hover:bg-purple-600 text-white py-2 rounded flex items-center justify-center">
              <IoMdAdd className="mr-2" /> Create Course
            </button>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Our Courses</h1>
            <Link
              to="/admin/create-course"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <IoMdAdd className="mr-2" /> Add Course
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No courses found. Create your first course!</p>
              <Link
                to="/admin/create-course"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
              >
                Create Course
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses
                  .filter((course) => {
                    const query = searchQuery.toLowerCase();
                    return (
                      course.title.toLowerCase().includes(query) ||
                      course.description.toLowerCase().includes(query)
                    );
                  })
                  .map((course) => (
                    <div key={course._id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow">
                      {/* Course Image */}
                      <img
                        src={course?.image?.url || '/placeholder.svg'}
                        alt={course.title}
                        className="h-40 w-full object-cover rounded-lg bg-gray-200 mb-4"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.svg';
                        }}
                      />
                      {/* Course Title */}
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {course.title}
                      </h2>
                      {/* Course Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {course.description}
                      </p>
                      {/* Course Price */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-gray-800">
                          ₹{course.price}
                        </span>
                        <span className="text-green-600 text-sm font-semibold bg-green-100 px-2 py-1 rounded">
                          10% off
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Link
                          to={`/admin/update-course/${course._id}`}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-center font-semibold transition-colors"
                        >
                          Update
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default OurCourses;
