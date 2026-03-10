import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload, FaCertificate } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

function Purchases() {
  const [purchases, setPurchase] = useState([]);
  const [certificates, setCertificates] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const { language } = useLanguage();

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
      myPurchases: "My Purchases",
      noPurchases: "You have no purchases yet.",
      completed: "Completed",
      hideMaterials: "Hide Materials",
      accessMaterials: "Access Course Materials",
      materialsTitle: "Course Materials:",
      untitledMaterial: "Untitled Material",
      materialsSoon: "Course materials will be available soon!",
      viewCertificate: "View Certificate",
      coursePlan: "Course Plan",
      takeQuiz: "Take Quiz",
      purchaseFetchError: "Failed to fetch purchase data",
      purchaseLoadError: "Failed to load your purchases",
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
      myPurchases: "मेरी खरीदारी",
      noPurchases: "आपने अभी तक कोई कोर्स नहीं खरीदा है।",
      completed: "पूर्ण",
      hideMaterials: "सामग्री छुपाएं",
      accessMaterials: "कोर्स सामग्री देखें",
      materialsTitle: "कोर्स सामग्री:",
      untitledMaterial: "बिना शीर्षक सामग्री",
      materialsSoon: "कोर्स सामग्री जल्द उपलब्ध होगी!",
      viewCertificate: "सर्टिफिकेट देखें",
      coursePlan: "कोर्स प्लान",
      takeQuiz: "क्विज दें",
      purchaseFetchError: "खरीदारी डेटा प्राप्त नहीं हो सका",
      purchaseLoadError: "आपकी खरीदारी लोड नहीं हो सकी",
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
      myPurchases: "ನನ್ನ ಖರೀದಿಗಳು",
      noPurchases: "ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಖರೀದಿ ಮಾಡಿಲ್ಲ.",
      completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
      hideMaterials: "ವಸ್ತುಗಳನ್ನು ಮರೆಮಾಡಿ",
      accessMaterials: "ಕೋರ್ಸ್ ವಸ್ತುಗಳನ್ನು ತೆರೆಯಿರಿ",
      materialsTitle: "ಕೋರ್ಸ್ ವಸ್ತುಗಳು:",
      untitledMaterial: "ಶೀರ್ಷಿಕೆ ಇಲ್ಲದ ವಸ್ತು",
      materialsSoon: "ಕೋರ್ಸ್ ವಸ್ತುಗಳು ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯವಾಗುತ್ತವೆ!",
      viewCertificate: "ಪ್ರಮಾಣಪತ್ರ ನೋಡಿ",
      coursePlan: "ಕೋರ್ಸ್ ಯೋಜನೆ",
      takeQuiz: "ಕ್ವಿಜ್ ತೆಗೆದುಕೊಳ್ಳಿ",
      purchaseFetchError: "ಖರೀದಿ ಡೇಟಾ ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ",
      purchaseLoadError: "ನಿಮ್ಮ ಖರೀದಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ",
    },
  };

  const t = text[language] || text.English;
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  console.log("purchases: ", purchases);

  // Fetch user profile
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/api/v1/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setUserProfile(response.data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Token handling
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  if (!token) {
    navigate("/login");
  }

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await api.get(`/api/v1/user/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log("Purchases API Response:", response.data);
        console.log("Course Data:", response.data.courseData);
        response.data.courseData.forEach((course, idx) => {
          console.log(`Course ${idx} materials:`, course.materials);
        });
        setPurchase(response.data.courseData);

        // Fetch certificates for all purchased courses
        const courseIds = response.data.courseData.map(course => course._id);
        await fetchCertificates(courseIds);

        if (location.state?.justPurchased) {
          const firstCourseWithMaterialsIndex = response.data.courseData.findIndex(
            (course) => Array.isArray(course.materials) && course.materials.length > 0
          );
          if (firstCourseWithMaterialsIndex !== -1) {
            setExpandedCourse(firstCourseWithMaterialsIndex);
          }
          window.history.replaceState({}, document.title);
        }
      } catch (error) {
        setErrorMessage(t.purchaseFetchError);
        toast.error(t.purchaseLoadError);
      }
    };
    if (token) {
      fetchPurchases();
    }
  }, [token, location.state]);

  // Fetch certificates for purchased courses
  const fetchCertificates = async (courseIds) => {
    const certMap = {};
    for (const courseId of courseIds) {
      try {
        const response = await api.get(`/api/certificate/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if (response.data.success) {
          certMap[courseId] = response.data.certificate;
        }
      } catch (error) {
        // Certificate not found - user hasn't completed quiz yet
        certMap[courseId] = null;
      }
    }
    setCertificates(certMap);
  };

  // Logout
  const handleLogout = async () => {
    try {
      const response = await api.get(`/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
    } catch(error) {
      console.log("Error in logging out ", error);
      const errorMsg = error.response?.data?.errors || error.message || "Error in logging out";
      toast.error(errorMsg);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Modern Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-slate-800 border-r border-slate-700 p-6 transform transition-all duration-300 z-40 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="User navigation"
      >
        {/* User Profile */}
        <div className="mb-8 pt-2">
          <div className="flex items-center gap-4">
            <img
              src={userProfile?.profilePhoto || "/logo.webp"}
              alt={`${userProfile?.firstName || "User"} profile`}
              className="rounded-lg h-12 w-12 object-cover border-2 border-orange-500/40 hover:border-orange-500 transition-colors"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {userProfile?.firstName}
              </p>
              <p className="text-xs text-gray-400 truncate">{userProfile?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          {[
            { path: "/", label: t.home, icon: <RiHome2Fill /> },
            { path: "/courses", label: t.courses, icon: <FaDiscourse /> },
            { path: "/purchases", label: t.purchases, icon: <FaDownload />, isActive: true },
            { path: "/my-certificates", label: t.certificates, icon: <FaCertificate /> },
            { path: "/settings", label: t.settings, icon: <IoMdSettings /> },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium group ${
                item.isActive
                  ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/10 text-orange-400 border-l-2 border-orange-500"
                  : "text-gray-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <span className="text-lg flex-shrink-0 transition-transform group-hover:scale-110 duration-300">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Cart */}
        <div className="mb-8 pb-6 border-b border-slate-700">
          <Link
            to="/cart"
            className="relative flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 font-medium"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="text-2xl">🛒</span>
            <span>{t.cart}</span>
            {cartItems.length > 0 && (
              <span className="ml-auto bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 animate-pulse">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-slate-700">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 font-semibold text-sm group"
            >
              <IoLogOut className="text-lg transition-transform group-hover:scale-110" />
              {t.logout}
            </button>
          ) : (
            <Link
              to="/login"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-green-400 hover:bg-green-500/10 transition-all duration-200 font-semibold text-sm"
            >
              <IoLogIn className="text-lg" /> {t.login}
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-slate-800/95 backdrop-blur border-b border-slate-700 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-orange-500 transition-colors"
              aria-label="Toggle navigation"
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {t.myPurchases}
            </h1>

            <div className="w-8" />
          </div>
        </header>

        {/* Error Message */}
        {errorMessage && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 animate-pulse">
            <p className="text-sm font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          {purchases.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-gray-400">
                  You have{" "}
                  <span className="text-white font-semibold">{purchases.length}</span>{" "}
                  active course{purchases.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {purchases.map((purchase, index) => {
                  const materials = Array.isArray(purchase.materials) ? purchase.materials : [];
                  const hasMaterials = materials.length > 0;
                  const isExpanded = expandedCourse === index;
                  const hasCertificate = certificates[purchase._id];

                  return (
                    <div
                      key={index}
                      className="group rounded-xl overflow-hidden bg-slate-700 hover:bg-slate-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 flex flex-col h-full"
                    >
                      {/* Course Image */}
                      <div className="relative h-48 overflow-hidden bg-slate-600">
                        <img
                          src={purchase.image?.url || "/placeholder.svg"}
                          alt={purchase.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                        
                        {/* Completion Badge */}
                        {hasCertificate && (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
                            <span>✓</span> {t.completed}
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 flex flex-col flex-grow space-y-4">
                        {/* Title & Description */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                            {purchase.title}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {purchase.description ? purchase.description.slice(0, 100) + "..." : "No description"}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                          <span className="text-orange-400 text-lg font-bold">₹{purchase.price || "N/A"}</span>
                          <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                            Active
                          </span>
                        </div>

                        {/* Materials Section */}
                        {hasMaterials && (
                          <div className="space-y-3">
                            <button
                              onClick={() => setExpandedCourse(isExpanded ? null : index)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 transition-colors duration-200 text-sm font-semibold text-white group"
                              aria-expanded={isExpanded}
                            >
                              <span className="flex items-center gap-2">
                                📚 {t.accessMaterials}
                              </span>
                              <span className="text-lg transform transition-transform duration-300 group-hover:translate-y-1">
                                {isExpanded ? "▲" : "▼"}
                              </span>
                            </button>

                            {isExpanded && (
                              <div className="bg-slate-600/50 border border-slate-600 rounded-lg p-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                {materials.map((material, matIndex) => (
                                  <a
                                    key={matIndex}
                                    href={material.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-2 hover:bg-slate-500 rounded transition-all duration-200 group/item"
                                  >
                                    <span className="text-lg flex-shrink-0 group-hover/item:scale-125 transition-transform duration-200">
                                      {material.type === "video" && "🎥"}
                                      {material.type === "pdf" && "📄"}
                                      {material.type === "doc" && "📝"}
                                      {material.type === "other" && "📎"}
                                    </span>
                                    <span className="text-sm text-gray-300 group-hover/item:text-white transition-colors truncate">
                                      {material.title || t.untitledMaterial}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {!hasMaterials && (
                          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p className="text-yellow-400 text-xs font-medium">ℹ️ {t.materialsSoon}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {hasCertificate && (
                            <Link
                              to={`/certificate/${purchase._id}`}
                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-3 py-2 rounded-lg font-semibold text-center transition-all duration-300 text-sm hover:shadow-lg hover:shadow-yellow-500/20 col-span-2"
                            >
                              🏆 {t.viewCertificate}
                            </Link>
                          )}
                          <Link
                            to={`/course-plan/${purchase._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold text-center transition-all duration-300 text-sm hover:shadow-lg hover:shadow-blue-500/20"
                          >
                            📘 {t.coursePlan}
                          </Link>
                          <Link
                            to={`/quiz/${purchase._id}`}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-semibold text-center transition-all duration-300 text-sm hover:shadow-lg hover:shadow-purple-500/20"
                          >
                            📝 {t.takeQuiz}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-lg text-gray-400 mb-6">{t.noPurchases}</p>
                <Link
                  to="/courses"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20"
                >
                  Explore Courses
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Purchases;


