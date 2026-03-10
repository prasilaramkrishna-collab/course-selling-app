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
  const adminEmail = adminProfile?.email || adminData?.admin?.email || "admin@futureproof.com";
  const currentProfilePhoto = adminProfile?.profilePhoto || adminData?.admin?.profilePhoto || "/logo.webp";

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

    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_22%),radial-gradient(circle_at_85%_20%,_rgba(45,212,191,0.12),_transparent_25%),linear-gradient(180deg,#eef4ff_0%,#f7fafc_45%,#eef3ff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6">
        <aside className="w-full shrink-0 overflow-y-auto rounded-[2rem] bg-slate-950/95 p-6 text-white shadow-2xl shadow-slate-900/20 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-80">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="relative">
                <img
                  src={currentProfilePhoto}
                  alt="Profile"
                  className="h-24 w-24 rounded-[1.5rem] object-cover ring-4 ring-white/10"
                />
                <button
                  onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                  className="absolute -bottom-2 -right-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 p-2.5 text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-105"
                  title="Upload Photo"
                >
                  <FaCamera size={14} />
                </button>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Admin live
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Operator</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{adminName}</h2>
              <p className="mt-1 text-sm text-slate-400">{adminEmail}</p>
            </div>

            {showPhotoUpload && (
              <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-slate-900/90 p-4">
                {profilePhoto ? (
                  <div className="space-y-3">
                    <img
                      src={URL.createObjectURL(profilePhoto)}
                      alt="Preview"
                      className="mx-auto h-24 w-24 rounded-[1.25rem] object-cover ring-2 ring-cyan-400/30"
                    />
                    <p className="text-center text-xs uppercase tracking-[0.2em] text-slate-400">Ready to upload</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setProfilePhoto(null);
                          setShowPhotoUpload(false);
                        }}
                        className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUploadPhoto}
                        disabled={uploading}
                        className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-2 text-sm font-bold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="block w-full cursor-pointer rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-4 text-center text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    >
                      Choose a profile photo
                    </label>
                  </>
                )}
              </div>
            )}
          </div>

          <nav className="mt-6 space-y-3">
            <Link to="/admin/our-courses" className="flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-white/5 px-4 py-4 text-sm font-semibold text-white/85 transition hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-white">
              <span>Our Courses</span>
              <span className="text-white/40">→</span>
            </Link>
            <Link to="/admin/create-course" className="flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-white/5 px-4 py-4 text-sm font-semibold text-white/85 transition hover:border-orange-400/20 hover:bg-orange-400/10 hover:text-white">
              <span>Create Course</span>
              <span className="text-white/40">＋</span>
            </Link>
            <Link to="/admin/course-materials" className="flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-white/5 px-4 py-4 text-sm font-semibold text-white/85 transition hover:border-blue-400/20 hover:bg-blue-400/10 hover:text-white">
              <span className="flex items-center gap-2"><MdLibraryBooks /> Materials</span>
              <span className="text-white/40">→</span>
            </Link>
            <Link to="/admin/certificates" className="flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-white/5 px-4 py-4 text-sm font-semibold text-white/85 transition hover:border-purple-400/20 hover:bg-purple-400/10 hover:text-white">
              <span>📜 Certificates</span>
              <span className="text-white/40">→</span>
            </Link>
            <Link to="/admin/feedback" className="flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-white/5 px-4 py-4 text-sm font-semibold text-white/85 transition hover:border-teal-400/20 hover:bg-teal-400/10 hover:text-white">
              <span>⭐ User Feedback</span>
              <span className="text-white/40">→</span>
            </Link>
          </nav>

          <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-gradient-to-br from-white/8 to-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Control summary</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">Course catalog</p>
                <p className="mt-1 text-2xl font-bold text-white">{loadingCourses ? "..." : totalCourses}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">Revenue tracked</p>
                <p className="mt-1 text-2xl font-bold text-white">₹{loadingPurchases ? "..." : totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <Link to="/" className="rounded-[1.25rem] border border-white/8 bg-white px-4 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-slate-100">
              Back to website
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-[1.25rem] bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.01]"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 space-y-6 overflow-y-auto rounded-[2rem] bg-white/60 p-4 shadow-xl shadow-slate-200/60 backdrop-blur-xl sm:p-6 lg:p-8">
          <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#132d46_42%,#082f49_100%)] p-6 text-white shadow-2xl shadow-cyan-950/20">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Operations cockpit
                </div>
                <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl">
                  Welcome back, {adminName}.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Track course growth, revenue, learner actions, certificates, and content updates from a dashboard that finally feels as polished as the public experience.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:w-[32rem]">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/45">Courses</p>
                  <p className="mt-3 text-3xl font-bold text-white">{loadingCourses ? "..." : totalCourses}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/45">Average price</p>
                  <p className="mt-3 text-3xl font-bold text-white">₹{loadingCourses ? "..." : averagePrice}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/45">Status</p>
                  <p className="mt-3 text-xl font-bold text-emerald-300">System active</p>
                  <p className="mt-1 text-sm text-slate-300">All admin tools online.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recent catalog</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">Recently added courses</h2>
                </div>
                <Link to="/admin/our-courses" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                  View all
                </Link>
              </div>

              {loadingCourses ? (
                <p className="text-slate-500">Loading recent courses...</p>
              ) : recentCourses.length === 0 ? (
                <p className="text-slate-500">No courses yet. Create your first course.</p>
              ) : (
                <div className="space-y-4">
                  {recentCourses.map((course, index) => (
                    <div key={course._id} className="flex flex-col gap-4 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-cyan-500 text-base font-bold text-white shadow-lg shadow-cyan-200/50">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-900">{course.title}</p>
                          <p className="mt-1 text-sm text-slate-500">₹{course.price} • Updated {formatActivityTime(course.updatedAt || course.createdAt)}</p>
                        </div>
                      </div>
                      <Link
                        to={`/admin/update-course/${course._id}`}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                      >
                        Edit course
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recent operations</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Activity stream</h2>

              {loadingCourses ? (
                <p className="mt-5 text-slate-500">Loading activity...</p>
              ) : recentActivity.length === 0 ? (
                <p className="mt-5 text-slate-500">No recent activity yet.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">{item.action}</p>
                          <p className="mt-2 text-base font-bold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{formatActivityTime(item.timestamp)}</p>
                        </div>
                        <Link
                          to={`/admin/update-course/${item.id}`}
                          className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-950 hover:text-white"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Revenue intelligence</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Who purchased courses</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.25rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Purchases <span className="ml-2 font-bold">{loadingPurchases ? "..." : totalPurchases}</span>
                </div>
                <div className="rounded-[1.25rem] bg-orange-50 px-4 py-3 text-sm text-orange-800">
                  Revenue <span className="ml-2 font-bold">₹{loadingPurchases ? "..." : totalRevenue}</span>
                </div>
              </div>
            </div>

            {loadingPurchases ? (
              <p className="text-slate-500">Loading purchase data...</p>
            ) : purchaseRows.length === 0 ? (
              <p className="text-slate-500">No purchases found yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-[1.5rem] border border-slate-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-slate-950 text-left text-white">
                    <tr>
                      <th className="px-5 py-4 text-sm font-semibold">Buyer Name</th>
                      <th className="px-5 py-4 text-sm font-semibold">Email</th>
                      <th className="px-5 py-4 text-sm font-semibold">Course</th>
                      <th className="px-5 py-4 text-sm font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseRows.map((row, index) => (
                      <tr key={row.purchaseId} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">{row.buyerName}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{row.buyerEmail}</td>
                        <td className="px-5 py-4 text-sm text-slate-800">{row.courseTitle}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">₹{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
    </>
  );
}

export default Dashboard;
