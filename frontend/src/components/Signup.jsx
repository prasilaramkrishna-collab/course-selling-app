import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaCamera } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Cropper from "react-easy-crop";
import { useLanguage } from "../context/LanguageContext";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  
  // Cropper states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalFile, setOriginalFile] = useState(null);

  const navigate = useNavigate();
  const { language } = useLanguage();

  const text = {
    English: {
      invalidImage: "Please select a valid image file",
      imageTooLarge: "Image size should be less than 5MB",
      croppedReady: "Photo cropped! Ready to signup.",
      cropFailed: "Failed to crop image",
      fillAll: "Please fill all fields",
      networkBackend: "Cannot connect to server. Please make sure backend is running on port 4001",
      networkReach: "Network error - Cannot reach server",
      networkTry: "Network error. Please try again.",
      cropProfile: "Crop Profile Photo",
      zoom: "Zoom",
      cancel: "Cancel",
      cropContinue: "Crop & Continue",
      login: "Login",
      joinNow: "Join now",
      welcome: "Welcome to",
      signupSubtitle: "Just Signup To Join Us!",
      profilePhotoOptional: "Profile Photo (Optional)",
      changePhoto: "Change Photo",
      addPhoto: "Add Photo",
      firstName: "Firstname",
      lastName: "Lastname",
      email: "Email",
      password: "Password",
      preferredLanguage: "Preferred Language",
      languageDescription: "Choose your preferred language for the platform",
      firstNamePlaceholder: "Type your firstname",
      lastNamePlaceholder: "Type your lastname",
      signup: "Signup",
    },
    Hindi: {
      invalidImage: "कृपया वैध इमेज फ़ाइल चुनें",
      imageTooLarge: "इमेज का आकार 5MB से कम होना चाहिए",
      croppedReady: "फोटो क्रॉप हो गई! साइनअप के लिए तैयार।",
      cropFailed: "इमेज क्रॉप करने में विफल",
      fillAll: "कृपया सभी फ़ील्ड भरें",
      networkBackend: "सर्वर से कनेक्ट नहीं हो पा रहा। कृपया सुनिश्चित करें कि बैकएंड पोर्ट 4001 पर चल रहा है",
      networkReach: "नेटवर्क त्रुटि - सर्वर तक पहुंच नहीं",
      networkTry: "नेटवर्क त्रुटि। कृपया फिर से प्रयास करें।",
      cropProfile: "प्रोफाइल फोटो क्रॉप करें",
      zoom: "ज़ूम",
      cancel: "रद्द करें",
      cropContinue: "क्रॉप करें और आगे बढ़ें",
      login: "लॉगिन",
      joinNow: "अभी जुड़ें",
      welcome: "स्वागत है",
      signupSubtitle: "हमसे जुड़ने के लिए साइनअप करें!",
      profilePhotoOptional: "प्रोफाइल फोटो (वैकल्पिक)",
      changePhoto: "फोटो बदलें",
      addPhoto: "फोटो जोड़ें",
      firstName: "पहला नाम",
      lastName: "अंतिम नाम",
      email: "ईमेल",
      password: "पासवर्ड",
      preferredLanguage: "पसंदीदा भाषा",
      languageDescription: "प्लेटफ़ॉर्म के लिए अपनी पसंदीदा भाषा चुनें",
      firstNamePlaceholder: "अपना पहला नाम लिखें",
      lastNamePlaceholder: "अपना अंतिम नाम लिखें",
      signup: "साइनअप",
    },
    Kannada: {
      invalidImage: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಚಿತ್ರ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ",
      imageTooLarge: "ಚಿತ್ರದ ಗಾತ್ರ 5MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು",
      croppedReady: "ಫೋಟೋ ಕ್ರಾಪ್ ಆಯಿತು! ಸೈನ್ ಅಪ್‌ಗೆ ಸಿದ್ಧವಾಗಿದೆ.",
      cropFailed: "ಚಿತ್ರ ಕ್ರಾಪ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ",
      fillAll: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ",
      networkBackend: "ಸರ್ವರ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಬ್ಯಾಕ್‌ಎಂಡ್ 4001 ಪೋರ್ಟ್‌ನಲ್ಲಿ ಓಡುತ್ತಿದೆ ಎಂದು ಖಚಿತಪಡಿಸಿ",
      networkReach: "ನೆಟ್‌ವರ್ಕ್ ದೋಷ - ಸರ್ವರ್ ತಲುಪಲಾಗಲಿಲ್ಲ",
      networkTry: "ನೆಟ್‌ವರ್ಕ್ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      cropProfile: "ಪ್ರೊಫೈಲ್ ಫೋಟೋ ಕ್ರಾಪ್ ಮಾಡಿ",
      zoom: "ಜೂಮ್",
      cancel: "ರದ್ದುಮಾಡಿ",
      cropContinue: "ಕ್ರಾಪ್ ಮಾಡಿ ಮುಂದುವರಿಸಿ",
      login: "ಲಾಗಿನ್",
      joinNow: "ಈಗ ಸೇರಿ",
      welcome: "ಸ್ವಾಗತ",
      signupSubtitle: "ನಮ್ಮೊಂದಿಗೆ ಸೇರಲು ಸೈನ್ ಅಪ್ ಮಾಡಿ!",
      profilePhotoOptional: "ಪ್ರೊಫೈಲ್ ಫೋಟೋ (ಐಚ್ಛಿಕ)",
      changePhoto: "ಫೋಟೋ ಬದಲಿಸಿ",
      addPhoto: "ಫೋಟೋ ಸೇರಿಸಿ",
      firstName: "ಮೊದಲ ಹೆಸರು",
      lastName: "ಕೊನೆಯ ಹೆಸರು",
      email: "ಇಮೇಲ್",
      password: "ಪಾಸ್ವರ್ಡ್",
      preferredLanguage: "ಆದ್ಯತೆಯ ಭಾಷೆ",
      languageDescription: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗಾಗಿ ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      firstNamePlaceholder: "ನಿಮ್ಮ ಮೊದಲ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
      lastNamePlaceholder: "ನಿಮ್ಮ ಕೊನೆಯ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
      signup: "ಸೈನ್ ಅಪ್",
    },
  };

  const t = text[language] || text.English;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t.invalidImage);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t.imageTooLarge);
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
      toast.success(t.croppedReady);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error(t.cropFailed);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageSrc(null);
    setOriginalFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Attempting signup to:", `/api/v1/user/signup`);
    
    if (!firstName || !lastName || !email || !password) {
      toast.error(t.fillAll);
      return;
    }

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("language", preferredLanguage);
      
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const response = await api.post(
        `/api/v1/user/signup`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Signup successful: ", response.data);
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response) {
        const errorMsg = Array.isArray(error.response.data.errors) 
          ? error.response.data.errors.join(", ") 
          : error.response.data.errors || "Signup failed!!!";
        toast.error(errorMsg);
        setErrorMessage(errorMsg);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error(t.networkBackend);
        setErrorMessage(t.networkReach);
      } else {
        console.error("Error setting up request:", error.message);
        toast.error(t.networkTry);
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <>
      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">{t.cropProfile}</h3>
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
            <div className="p-4 space-y-4 border-t border-gray-700">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">{t.zoom}</label>
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
                  {t.cancel}
                </button>
                <button
                  onClick={handleCropConfirm}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200"
                >
                  {t.cropContinue}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-700/60 bg-slate-900/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.webp" alt="Logo" className="w-10 h-10 rounded-full border border-orange-500/40" />
            <Link to="/" className="text-xl font-bold text-orange-400 hover:text-orange-300 transition-colors">
              Future Proof
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="border border-slate-500 hover:border-slate-300 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-sm md:text-base transition-all duration-200"
            >
              {t.login}
            </Link>
            <Link
              to="/courses"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm md:text-base transition-all duration-200"
            >
              {t.joinNow}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <section className="hidden lg:block">
          <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/5 border border-orange-500/20 rounded-3xl p-8">
            <p className="text-sm uppercase tracking-widest text-orange-300 mb-4">Future Proof</p>
            <h1 className="text-4xl font-black leading-tight text-white mb-4">
              {t.welcome} <span className="text-orange-400">Future Proof</span>
            </h1>
            <p className="text-slate-300 text-lg">{t.signupSubtitle}</p>
          </div>
        </section>

        <section className="w-full">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700/60 rounded-2xl shadow-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
              {t.signup}
            </h2>
            <p className="text-center text-slate-300 mb-6">{t.signupSubtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">{t.profilePhotoOptional}</label>
                <div className="flex items-center gap-4">
                  {profilePhoto ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(profilePhoto)}
                        alt="Profile Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => setProfilePhoto(null)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                      >
                        <MdClose size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-dashed border-slate-500 flex items-center justify-center">
                      <FaCamera className="text-slate-400" size={24} />
                    </div>
                  )}
                  <label
                    htmlFor="profile-upload"
                    className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    {profilePhoto ? t.changePhoto : t.addPhoto}
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="firstname" className="block text-sm text-slate-300 mb-2">
                  {t.firstName}
                </label>
                <input
                  type="text"
                  id="firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={t.firstNamePlaceholder}
                />
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm text-slate-300 mb-2">
                  {t.lastName}
                </label>
                <input
                  type="text"
                  id="lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={t.lastNamePlaceholder}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-slate-300 mb-2">
                  {t.email}
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="name@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="language" className="block text-sm text-slate-300 mb-2">
                  {t.preferredLanguage}
                </label>
                <p className="text-xs text-slate-400 mb-2">{t.languageDescription}</p>
                <select
                  id="language"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-slate-300 mb-2">
                  {t.password}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="text-red-300 bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-sm text-center">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-orange-500/30 hover:shadow-xl"
              >
                {t.signup}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
    </>
  );
}

export default Signup;
