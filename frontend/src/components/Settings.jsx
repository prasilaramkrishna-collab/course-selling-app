import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload, FaCertificate } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FaCamera } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Cropper from "react-easy-crop";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

function Settings() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const userData = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = Boolean(userData?.token);
  const token = userData?.token;

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [savingLanguage, setSavingLanguage] = useState(false);
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const text = {
    English: {
      home: "Home",
      courses: "Courses",
      purchases: "Purchases",
      cart: "Cart",
      certificates: "Certificates",
      settings: "Settings",
      logout: "Logout",
      login: "Login",
    },
    Hindi: {
      home: "होम",
      courses: "कोर्स",
      purchases: "खरीदे गए कोर्स",
      cart: "कार्ट",
      certificates: "सर्टिफिकेट",
      settings: "सेटिंग्स",
      logout: "लॉगआउट",
      login: "लॉगिन",
    },
    Kannada: {
      home: "ಮುಖಪುಟ",
      courses: "ಕೋರ್ಸ್‌ಗಳು",
      purchases: "ಖರೀದಿಗಳು",
      cart: "ಕಾರ್ಟ್",
      certificates: "ಪ್ರಮಾಣಪತ್ರಗಳು",
      settings: "ಸೆಟ್ಟಿಂಗ್ಸ್",
      logout: "ಲಾಗ್ ಔಟ್",
      login: "ಲಾಗಿನ್",
    },
  };
  const t = text[language] || text.English;
  
  // Cropper states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalFile, setOriginalFile] = useState(null);

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchUserProfile();
    }
  }, [isLoggedIn, token]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (profilePhoto) {
        URL.revokeObjectURL(URL.createObjectURL(profilePhoto));
      }
    };
  }, [profilePhoto]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/api/v1/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setUserProfile(response.data.user);
      setLanguage(response.data.user?.language || "English");
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleLanguageUpdate = async () => {
    if (!language) {
      toast.error("Please select a language");
      return;
    }

    setSavingLanguage(true);
    try {
      const response = await api.post(
        "/api/v1/user/update-language",
        { language },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setUserProfile(response.data.user);
      const updatedUser = {
        ...userData,
        language: response.data.user?.language || language,
        user: userData?.user
          ? { ...userData.user, language: response.data.user?.language || language }
          : userData?.user,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setLanguage(response.data.user?.language || language);
      toast.success("Language preference updated");
    } catch (error) {
      console.error("Error updating language:", error);
      toast.error(error.response?.data?.errors || "Failed to update language");
    } finally {
      setSavingLanguage(false);
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
      const response = await api.post("/api/v1/user/upload-profile-photo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success("Profile photo updated successfully!");
      setProfilePhoto(null);
      fetchUserProfile();
      
      // Update localStorage with new photo
      const updatedUser = { ...userData, profilePhoto: response.data.profilePhoto };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error(error.response?.data?.errors || "Error uploading photo");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await api.get(`/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message || "Logged out successfully");
    } catch (error) {
      const errorMsg = error.response?.data?.errors || error.message || "Error in logging out";
      toast.error(errorMsg);
    } finally {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-slate-950 via-purple-950 to-indigo-900 text-white">
      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-800/30">
              <h3 className="text-xl font-semibold text-white">Crop Profile Photo</h3>
              <button
                onClick={handleCropCancel}
                className="text-gray-400 hover:text-white transition-colors"
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
            <div className="p-4 space-y-4 border-t border-purple-800/30">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Zoom</label>
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
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropConfirm}
                  className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200"
                >
                  Crop & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-slate-900/90 p-5 md:min-h-screen border-r border-purple-800/40">
          <div className="flex items-center mb-10 mt-2">
            <img 
              src={userProfile?.profilePhoto || "/logo.webp"} 
              alt="Profile" 
              className="rounded-full h-12 w-12 object-cover" 
            />
          </div>
          <nav>
            <ul>
              <li className="mb-4">
                <Link to="/" className="flex items-center hover:text-purple-400 transition-colors">
                  <RiHome2Fill className="mr-2" /> {t.home}
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/courses" className="flex items-center hover:text-purple-400 transition-colors">
                  <FaDiscourse className="mr-2" /> {t.courses}
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/cart" className="flex items-center hover:text-purple-400 transition-colors">
                  🛒 {t.cart} ({cartItems.length})
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/purchases" className="flex items-center hover:text-purple-400 transition-colors">
                  <FaDownload className="mr-2" /> {t.purchases}
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/my-certificates" className="flex items-center hover:text-purple-400 transition-colors">
                  <FaCertificate className="mr-2" /> {t.certificates}
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/settings" className="flex items-center text-pink-400 font-semibold">
                  <IoMdSettings className="mr-2" /> {t.settings}
                </Link>
              </li>
              <li>
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="flex items-center hover:text-purple-400 transition-colors">
                    <IoLogOut className="mr-2" /> {t.logout}
                  </button>
                ) : (
                  <Link to="/login" className="flex items-center hover:text-purple-400 transition-colors">
                    <IoLogIn className="mr-2" /> {t.login}
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-800/30">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            {isLoggedIn ? (
              <div className="space-y-6">
                {/* Profile Photo Section */}
                <div className="flex flex-col items-center space-y-4 pb-6 border-b border-purple-800/30">
                  <div className="relative">
                    <img
                      src={
                        profilePhoto 
                          ? URL.createObjectURL(profilePhoto) 
                          : userProfile?.profilePhoto || "/logo.webp"
                      }
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-purple-500/50"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer transition-colors"
                    >
                      <FaCamera size={20} />
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {profilePhoto && (
                    <div className="flex flex-col items-center space-y-2">
                      <p className="text-sm text-gray-300">Image cropped and ready to upload</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setProfilePhoto(null)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUploadPhoto}
                          disabled={uploading}
                          className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {uploading ? "Uploading..." : "Upload Photo"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Details */}
                <div className="space-y-3">
                  <p className="text-gray-300">
                    <span className="font-semibold text-purple-300">Email:</span> {userProfile?.email || userData?.email || "N/A"}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold text-purple-300">Name:</span> {userProfile?.firstName || userData?.firstName || "User"} {userProfile?.lastName || userData?.lastName || ""}
                  </p>
                  <div className="pt-2">
                    <label className="block text-gray-300 mb-2">
                      <span className="font-semibold text-purple-300">Preferred Language:</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-slate-900 border border-purple-700/50 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {supportedLanguages.map((optionLanguage) => (
                          <option key={optionLanguage} value={optionLanguage}>
                            {optionLanguage}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleLanguageUpdate}
                        disabled={savingLanguage}
                        className="bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingLanguage ? "Saving..." : "Save Language"}
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Current: {userProfile?.language || language || "English"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Please log in to view your settings</p>
            )}
            <div className="mt-6">
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
