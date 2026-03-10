import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { MdLibraryBooks, MdClose } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
import Cropper from "react-easy-crop";

function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [purchaseRows, setPurchaseRows] = useState([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  
  // Cropper states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalFile, setOriginalFile] = useState(null);
  
  const adminData = JSON.parse(localStorage.getItem("admin") || "null");
  const adminToken = adminData?.token;
  const adminName =
    `${adminData?.admin?.firstName || ""} ${adminData?.admin?.lastName || ""}`.trim() ||
    "Admin";

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }
    fetchAdminProfile();
  }, [adminToken, navigate]);

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setOriginalFile(file);
      
      // Read file and set image source for cropper
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropModal(true);
        setShowPhotoUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg", 0.95);
    });
  };

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], originalFile.name, {
        type: "image/jpeg",
      });
      setProfilePhoto(croppedFile);
      setShowCropModal(false);
      setImageSrc(null);
      setShowPhotoUpload(true);
      toast.success("Image cropped! Click upload to save.");
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageSrc(null);
    setOriginalFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleUploadPhoto = async () => {
    if (!profilePhoto) {
      toast.error("Please select a photo first");
      return;
    }

    const formData = new FormData();
    formData.append("profilePhoto", profilePhoto);

    setUploading(true);
    try {
      const response = await api.post("/api/v1/admin/upload-profile-photo", formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success("Profile photo updated successfully!");
      setProfilePhoto(null);
      setShowPhotoUpload(false);
      fetchAdminProfile();
      
      // Update localStorage with new photo
      const updatedAdmin = { 
        ...adminData, 
        admin: { ...adminData.admin, profilePhoto: response.data.profilePhoto } 
      };
      localStorage.setItem("admin", JSON.stringify(updatedAdmin));
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error(error.response?.data?.errors || "Error uploading photo");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await api.get(`/api/v1/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data?.courses || []);
      } catch (error) {
        console.log("Error fetching dashboard courses", error);
        toast.error("Could not load dashboard overview");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!adminToken) {
        setLoadingPurchases(false);
        return;
      }

      try {
        setLoadingPurchases(true);
        const response = await api.get(`/api/v1/admin/purchases-overview`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          withCredentials: true,
        });

        setPurchaseRows(response.data?.purchaseRows || []);
        setTotalPurchases(response.data?.totalPurchases || 0);
        setTotalRevenue(response.data?.totalRevenue || 0);
      } catch (error) {
        console.log("Error fetching purchase overview", error);
        toast.error("Could not load purchase data");
      } finally {
        setLoadingPurchases(false);
      }
    };

    fetchPurchases();
  }, [adminToken]);

  const totalCourses = courses.length;
  const averagePrice = useMemo(() => {
    if (!courses.length) return 0;
    const sum = courses.reduce((acc, course) => acc + Number(course.price || 0), 0);
    return Math.round(sum / courses.length);
  }, [courses]);
  const recentCourses = useMemo(() => courses.slice(-3).reverse(), [courses]);
  const recentActivity = useMemo(() => {
    return [...courses]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
      .slice(0, 5)
      .map((course) => {
        const isUpdated =
          Boolean(course.updatedAt && course.createdAt) &&
          new Date(course.updatedAt).getTime() > new Date(course.createdAt).getTime();

        return {
          id: course._id,
          title: course.title,
          action: isUpdated ? "Course updated" : "Course created",
          timestamp: course.updatedAt || course.createdAt,
        };
      });
  }, [courses]);

  const formatActivityTime = (timestamp) => {
    if (!timestamp) return "Time unavailable";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "Time unavailable";
    return date.toLocaleString();
  };

  const handleLogout = async () => {
    try {
      const response = await api.get(`/api/v1/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
      window.location.href = '/admin/login';
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
      // Even if there's an error, clear local storage and redirect
      localStorage.removeItem("admin");
      window.location.href = '/admin/login';
    }
  };
  return (
    <>
      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Crop Profile Photo</h3>
              <button
                onClick={handleCropCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Cropper Area */}
            <div className="relative flex-1 bg-black" style={{ minHeight: "400px" }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Controls */}
            <div className="p-4 space-y-4 border-t border-gray-200">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCropCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropConfirm}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  Crop & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-5">
        <div className="flex items-center flex-col mb-10">
          <div className="relative">
            <img 
              src={adminProfile?.profilePhoto || "/logo.webp"} 
              alt="Profile" 
              className="rounded-full h-20 w-20 object-cover border-2 border-gray-300" 
            />
            <button
              onClick={() => setShowPhotoUpload(!showPhotoUpload)}
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full transition-colors"
              title="Upload Photo"
            >
              <FaCamera size={14} />
            </button>
          </div>
          <h2 className="text-lg font-semibold mt-4">I'm Admin</h2>
          
          {/* Photo Upload Section */}
          {showPhotoUpload && (
            <div className="mt-4 w-full bg-white p-3 rounded-lg shadow-md">
              {profilePhoto ? (
                <div className="space-y-2">
                  <img 
                    src={URL.createObjectURL(profilePhoto)} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-blue-500" 
                  />
                  <p className="text-xs text-gray-600 text-center">Image cropped and ready</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setProfilePhoto(null);
                        setShowPhotoUpload(false);
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUploadPhoto}
                      disabled={uploading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="admin-photo-upload"
                  />
                  <label
                    htmlFor="admin-photo-upload"
                    className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded cursor-pointer text-sm"
                  >
                    Choose Photo
                  </label>
                </>
              )}
            </div>
          )}
        </div>
        <nav className="flex flex-col space-y-4">
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

      <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {adminName}</h1>
          <p className="text-gray-600 mt-2">Manage your courses and keep content updated from this dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm text-gray-500">Total Courses</h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">{loadingCourses ? "..." : totalCourses}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm text-gray-500">Average Price</h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">₹{loadingCourses ? "..." : averagePrice}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm text-gray-500">Dashboard Status</h2>
            <p className="text-xl font-semibold text-green-600 mt-3">System Active</p>
            <p className="text-sm text-gray-500 mt-1">All admin tools are available.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recently Added Courses</h2>
            <Link to="/admin/our-courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </Link>
          </div>

          {loadingCourses ? (
            <p className="text-gray-500">Loading recent courses...</p>
          ) : recentCourses.length === 0 ? (
            <p className="text-gray-500">No courses yet. Create your first course.</p>
          ) : (
            <div className="space-y-3">
              {recentCourses.map((course) => (
                <div key={course._id} className="border border-gray-200 rounded-md p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{course.title}</p>
                    <p className="text-sm text-gray-500">₹{course.price}</p>
                  </div>
                  <Link
                    to={`/admin/update-course/${course._id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Update
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          {loadingCourses ? (
            <p className="text-gray-500">Loading activity...</p>
          ) : recentActivity.length === 0 ? (
            <p className="text-gray-500">No recent activity yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-md p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{item.action}: {item.title}</p>
                    <p className="text-sm text-gray-500">{formatActivityTime(item.timestamp)}</p>
                  </div>
                  <Link
                    to={`/admin/update-course/${item.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Open
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Who Purchased Courses</h2>
            <div className="text-sm text-gray-600">
              <span className="mr-4">Purchases: <strong>{loadingPurchases ? "..." : totalPurchases}</strong></span>
              <span>Revenue: <strong>₹{loadingPurchases ? "..." : totalRevenue}</strong></span>
            </div>
          </div>

          {loadingPurchases ? (
            <p className="text-gray-500">Loading purchase data...</p>
          ) : purchaseRows.length === 0 ? (
            <p className="text-gray-500">No purchases found yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left text-sm font-semibold text-gray-700 px-4 py-2">Buyer Name</th>
                    <th className="text-left text-sm font-semibold text-gray-700 px-4 py-2">Email</th>
                    <th className="text-left text-sm font-semibold text-gray-700 px-4 py-2">Course</th>
                    <th className="text-left text-sm font-semibold text-gray-700 px-4 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseRows.map((row) => (
                    <tr key={row.purchaseId} className="border-t border-gray-200">
                      <td className="px-4 py-2 text-sm text-gray-800">{row.buyerName}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{row.buyerEmail}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{row.courseTitle}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">₹{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default Dashboard;
