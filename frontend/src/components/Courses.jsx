import React, { useState, useEffect } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaCertificate } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi"; // Import menu and close icons
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const { language } = useLanguage();

  const text = {
    English: {
      home: "Home",
      courses: "Courses",
      purchases: "Purchases",
      cart: "Cart",
      settings: "Settings",
      logout: "Logout",
      login: "Login",
      loading: "Loading...",
      noCourses: "No course posted yet by admin",
      searchPlaceholder: "Type here to search...",
      addToCart: "Add to Cart",
      addedToCart: "Course added to cart!",
      alreadyInCart: "Course already in cart",
      loginRequired: "Please login to view courses",
    },
    Hindi: {
      home: "होम",
      courses: "कोर्स",
      purchases: "खरीदे गए कोर्स",
      cart: "कार्ट",
      settings: "सेटिंग्स",
      logout: "लॉगआउट",
      login: "लॉगिन",
      loading: "लोड हो रहा है...",
      noCourses: "अभी एडमिन द्वारा कोई कोर्स पोस्ट नहीं किया गया है",
      searchPlaceholder: "यहां खोजें...",
      addToCart: "कार्ट में जोड़ें",
      addedToCart: "कोर्स कार्ट में जोड़ दिया गया!",
      alreadyInCart: "कोर्स पहले से कार्ट में है",
      loginRequired: "कृपया कोर्स देखने के लिए लॉगिन करें",
    },
    Kannada: {
      home: "ಮುಖಪುಟ",
      courses: "ಕೋರ್ಸ್‌ಗಳು",
      purchases: "ಖರೀದಿಗಳು",
      cart: "ಕಾರ್ಟ್",
      settings: "ಸೆಟ್ಟಿಂಗ್ಸ್",
      logout: "ಲಾಗ್ ಔಟ್",
      login: "ಲಾಗಿನ್",
      loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      noCourses: "ನಿರ್ವಾಹಕರು ಇನ್ನೂ ಯಾವುದೇ ಕೋರ್ಸ್ ಪೋಸ್ಟ್ ಮಾಡಿಲ್ಲ",
      searchPlaceholder: "ಇಲ್ಲಿ ಹುಡುಕಿ...",
      addToCart: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
      addedToCart: "ಕೋರ್ಸ್ ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ!",
      alreadyInCart: "ಕೋರ್ಸ್ ಈಗಾಗಲೇ ಕಾರ್ಟ್‌ನಲ್ಲಿಿದೆ",
      loginRequired: "ಕೋರ್ಸ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ",
    },
  };

  const t = text[language] || text.English;

  const userData = JSON.parse(localStorage.getItem("user") || "null");
  const token = userData?.token;

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

  console.log("courses: ", courses);

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      // Redirect to login if not logged in
      toast.error(text[language]?.loginRequired || "Please login to view courses");
      navigate("/login");
    }
  }, [navigate, language]);

  // Fetch courses
  useEffect(() => {
    // Only fetch courses if user is logged in
    if (!isLoggedIn) return;
    
    const fetchCourses = async () => {
      try {
        const response = await api.get(`/api/v1/course/courses`, {
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, [isLoggedIn]);

  // Logout
  const handleLogout = async () => {
    try {
      const response = await api.get(`/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      window.location.href = '/';
    } catch (error) {
      console.log("Error in logging out ", error);
      const errorMsg = error.response?.data?.errors || error.message || "Error in logging out";
      toast.error(errorMsg);
      // Even if there's an error, clear local storage and redirect
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      window.location.href = '/';
    }
  };

  // Toggle sidebar for mobile devices
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Modern Sidebar Navigation */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-slate-800 border-r border-slate-700 p-6 transform transition-transform duration-300 z-40 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="User navigation"
      >
        {/* User Profile Section */}
        <div className="mb-8 pt-4">
          <div className="flex items-center gap-4 mb-2">
            <img
              src={userProfile?.profilePhoto || "/logo.webp"}
              alt={`${userProfile?.firstName || "User"} profile`}
              className="rounded-lg h-12 w-12 object-cover border-2 border-orange-500"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {userProfile?.firstName}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {userProfile?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <NavLink to="/" label={t.home} icon={<RiHome2Fill />} />
          <NavLink to="/courses" label={t.courses} icon={<FaDiscourse />} isActive={true} />
          <NavLink to="/purchases" label={t.purchases} icon={<FaDownload />} />
          <NavLink to="/my-certificates" label={t.certificates} icon={<FaCertificate />} />
          
          {/* Cart with badge */}
          <div className="relative">
            <NavLink to="/cart" label={`${t.cart}`} icon={<span>🛒</span>} />
            {cartItems.length > 0 && (
              <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cartItems.length}
              </span>
            )}
          </div>

          <NavLink to="/settings" label={t.settings} icon={<IoMdSettings />} />
        </nav>

        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors duration-200 font-semibold text-sm"
              aria-label="Logout from account"
            >
              <IoLogOut className="text-lg" />
              {t.logout}
            </button>
          ) : (
            <Link
              to="/login"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors duration-200 font-semibold text-sm"
            >
              <IoLogIn className="text-lg" />
              {t.login}
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header with Search and Toggle */}
        <header className="sticky top-0 z-20 bg-slate-800/95 backdrop-blur border-b border-slate-700 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-orange-500 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
            </button>

            {/* Page Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {t.courses}
            </h1>

            {/* Search Bar */}
            <div className="hidden sm:flex items-center flex-1 max-w-md mx-auto">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  aria-label="Search courses"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Profile Button */}
            <button
              onClick={() => navigate("/settings")}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Go to settings"
            >
              <FaCircleUser className="text-2xl sm:text-3xl text-orange-500" />
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="sm:hidden mt-4">
            <div className="relative w-full">
              <input
                type="search"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                aria-label="Search courses"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-orange-500/20 rounded-full">
                  <div className="text-3xl animate-spin">⏳</div>
                </div>
                <p className="text-lg text-gray-300">{t.loading}</p>
              </div>
            </div>
          ) : courses.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-lg text-gray-400">{t.noCourses}</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Results Count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-400">
                  Showing{" "}
                  <span className="text-white font-semibold">
                    {
                      courses.filter((course) => {
                        const query = searchQuery.toLowerCase();
                        return (
                          course.title.toLowerCase().includes(query) ||
                          course.description.toLowerCase().includes(query)
                        );
                      }).length
                    }
                  </span>{" "}
                  courses
                </p>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                {courses
                  .filter((course) => {
                    const query = searchQuery.toLowerCase();
                    return (
                      course.title.toLowerCase().includes(query) ||
                      course.description.toLowerCase().includes(query)
                    );
                  })
                  .map((course) => {
                    let imageUrl = "/placeholder.svg";
                    if (course.image) {
                      if (typeof course.image === "object" && course.image.url) {
                        imageUrl = course.image.url;
                      }
                    }

                    return (
                      <article
                        key={course._id}
                        className="group rounded-xl overflow-hidden bg-slate-700 hover:bg-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 flex flex-col h-full"
                      >
                        {/* Course Image */}
                        <div className="relative h-40 sm:h-48 overflow-hidden bg-slate-600">
                          <img
                            src={imageUrl}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.svg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Course Content */}
                        <div className="p-4 sm:p-5 flex flex-col flex-grow">
                          {/* Title */}
                          <h3 className="text-base sm:text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                            {course.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">
                            {course.description.length > 80
                              ? `${course.description.slice(0, 80)}...`
                              : course.description}
                          </p>

                          {/* Price and Action */}
                          <div className="mt-auto space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-orange-400 text-lg sm:text-xl font-bold">
                                  ₹{course.price}
                                </p>
                                <p className="text-xs text-gray-500 line-through">
                                  ₹5999
                                </p>
                              </div>
                              <span className="text-xs sm:text-sm font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded">
                                20% off
                              </span>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                              onClick={() => {
                                if (addToCart(course)) {
                                  toast.success(t.addedToCart);
                                  navigate("/cart");
                                } else {
                                  toast.error(t.alreadyInCart);
                                }
                              }}
                              className="w-full px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-700 text-sm"
                              aria-label={`Add ${course.title} to cart`}
                            >
                              🛒 {t.addToCart}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Courses;

// Navigation Link Helper Component
function NavLink({ to, label, icon, isActive }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
        isActive
          ? "bg-orange-500/20 text-orange-400 border-l-2 border-orange-500"
          : "text-gray-300 hover:text-white hover:bg-slate-700"
      }`}
    >
      <span className="text-lg flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  );
}






