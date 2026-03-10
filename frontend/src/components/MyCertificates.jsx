import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload, FaCertificate } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

function MyCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const navigate = useNavigate();
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
      myCertificates: "My Certificates",
      noCertificates: "You haven't earned any certificates yet.",
      noCertificatesSubtext: "Complete course quizzes to earn certificates!",
      completedOn: "Completed on",
      viewCertificate: "View Certificate",
      downloadPdf: "Download PDF",
      coursePlan: "Course Plan",
      retakeQuiz: "Retake Quiz",
      loading: "Loading your certificates...",
      earnedCertificate: "Certificate Earned",
      achievementUnlocked: "Achievement Unlocked!",
      congratulations: "Congratulations on completing",
      certificatesEarned: "Certificates Earned",
      totalCompleted: "Total Courses Completed",
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
      myCertificates: "मेरे सर्टिफिकेट",
      noCertificates: "आपने अभी तक कोई सर्टिफिकेट अर्जित नहीं किया है।",
      noCertificatesSubtext: "सर्टिफिकेट अर्जित करने के लिए कोर्स क्विज पूरा करें!",
      completedOn: "पूर्ण किया गया",
      viewCertificate: "सर्टिफिकेट देखें",
      downloadPdf: "PDF डाउनलोड करें",
      coursePlan: "कोर्स प्लान",
      retakeQuiz: "क्विज फिर से दें",
      loading: "आपके सर्टिफिकेट लोड हो रहे हैं...",
      earnedCertificate: "सर्टिफिकेट प्राप्त किया",
      achievementUnlocked: "उपलब्धि अनलॉक की गई!",
      congratulations: "पूरा करने पर बधाई",
      certificatesEarned: "प्राप्त सर्टिफिकेट",
      totalCompleted: "कुल पूर्ण किए गए कोर्स",
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
      myCertificates: "ನನ್ನ ಪ್ರಮಾಣಪತ್ರಗಳು",
      noCertificates: "ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಗಳಿಸಿಲ್ಲ.",
      noCertificatesSubtext: "ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ಗಳಿಸಲು ಕೋರ್ಸ್ ಕ್ವಿಜ್‌ಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ!",
      completedOn: "ಪೂರ್ಣಗೊಂಡಿದೆ",
      viewCertificate: "ಪ್ರಮಾಣಪತ್ರ ನೋಡಿ",
      downloadPdf: "PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      coursePlan: "ಕೋರ್ಸ್ ಯೋಜನೆ",
      retakeQuiz: "ಕ್ವಿಜ್ ಮರುಪಡೆ",
      loading: "ನಿಮ್ಮ ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
      earnedCertificate: "ಪ್ರಮಾಣಪತ್ರ ಗಳಿಸಿದ್ದಾರೆ",
      achievementUnlocked: "ಸಾಧನೆ ಅನ್‌ಲಾಕ್ ಆಗಿದೆ!",
      congratulations: "ಪೂರ್ಣಗೊಳಿಸಿದ ಬಗ್ಗೆ ಅಭಿನಂದನೆಗಳು",
      certificatesEarned: "ಗಳಿಸಿದ ಪ್ರಮಾಣಪತ್ರಗಳು",
      totalCompleted: "ಒಟ್ಟು ಪೂರ್ಣಗೊಂಡ ಕೋರ್ಸ್‌ಗಳು",
    },
  };

  const t = text[language] || text.English;
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // Token handling
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [token, navigate]);

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

  // Fetch certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        
        // First, get all purchased courses
        const purchasesResponse = await api.get(`/api/v1/user/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const courses = purchasesResponse.data.courseData || [];
        const certificatesData = [];

        // Fetch certificates for each purchased course
        for (const course of courses) {
          try {
            const certResponse = await api.get(`/api/certificate/course/${course._id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            });
            
            if (certResponse.data.success && certResponse.data.certificate) {
              certificatesData.push({
                certificate: certResponse.data.certificate,
                course: course,
              });
            }
          } catch (error) {
            // Certificate not found for this course - skip it
            console.log(`No certificate for course ${course._id}`);
          }
        }

        setCertificates(certificatesData);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        toast.error("Failed to load certificates");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCertificates();
    }
  }, [token]);

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
    } catch (error) {
      console.log("Error in logging out ", error);
      const errorMsg = error.response?.data?.errors || error.message || "Error in logging out";
      toast.error(errorMsg);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 p-5 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 border-r border-slate-700 transform transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center gap-3 mb-8 mt-10 md:mt-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 p-3 rounded-lg border border-orange-500/20">
          <img
            src={userProfile?.profilePhoto || "/logo.webp"}
            alt="Profile"
            className="rounded-full h-12 w-12 object-cover border-2 border-orange-500/40"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {userProfile?.firstName || "Student"}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {userProfile?.email || ""}
            </p>
          </div>
        </div>

        <nav>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all duration-200">
                <RiHome2Fill className="text-lg" /> {t.home}
              </Link>
            </li>
            <li>
              <Link to="/courses" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all duration-200">
                <FaDiscourse className="text-lg" /> {t.courses}
              </Link>
            </li>
            <li>
              <Link to="/cart" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all duration-200">
                <span className="text-xl">🛒</span> {t.cart} ({cartItems.length})
              </Link>
            </li>
            <li>
              <Link to="/purchases" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all duration-200">
                <FaDownload className="text-lg" /> {t.purchases}
              </Link>
            </li>
            <li>
              <Link
                to="/my-certificates"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/10 border-l-2 border-orange-500 text-orange-300 font-semibold shadow-lg shadow-orange-500/10"
              >
                <FaCertificate className="text-lg" /> {t.certificates}
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all duration-200">
                <IoMdSettings className="text-lg" /> {t.settings}
              </Link>
            </li>
            <li className="pt-3 mt-3 border-t border-slate-700">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                >
                  <IoLogOut className="text-lg" /> {t.logout}
                </button>
              ) : (
                <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-lg text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all duration-200">
                  <IoLogIn className="text-lg" /> {t.login}
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-900 p-2 rounded-lg shadow-lg"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 md:ml-64">
        {/* Header */}
        <div className="mb-8 mt-14 md:mt-0 bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <FaCertificate className="text-amber-400" />
            {t.myCertificates}
          </h2>
          {!loading && certificates.length > 0 && (
            <p className="text-slate-300 mt-2">
              {t.totalCompleted}:{" "}
              <span className="font-semibold text-orange-300">{certificates.length}</span>
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-72 bg-slate-800/50 rounded-2xl border border-slate-700">
            <div className="text-center">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-600 border-t-orange-500 mx-auto mb-4"></div>
              <p className="text-slate-300 text-lg">{t.loading}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && certificates.length === 0 && (
          <div className="flex flex-col items-center justify-center h-80 text-center bg-slate-800/50 border border-slate-700 rounded-2xl px-6">
            <div className="text-7xl mb-4 animate-bounce">🎓</div>
            <h3 className="text-2xl font-bold text-white mb-2">{t.noCertificates}</h3>
            <p className="text-slate-400 mb-6 max-w-xl">{t.noCertificatesSubtext}</p>
            <Link
              to="/courses"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-slate-900 py-3 px-8 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-orange-500/40 hover:shadow-2xl transform hover:-translate-y-1"
            >
              {t.courses}
            </Link>
          </div>
        )}

        {/* Certificates Grid */}
        {!loading && certificates.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {certificates.map(({ certificate, course }, index) => (
              <article
                key={certificate._id || index}
                className="group bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl overflow-hidden border border-slate-700/60 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/15 transition-all duration-300"
              >
                {/* Course Image */}
                <div className="relative overflow-hidden">
                  <img
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    src={course.image?.url || "https://via.placeholder.com/400x300"}
                    alt={course.title}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <div className="absolute top-3 right-3 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <span>✓</span> {t.earnedCertificate}
                  </div>
                </div>

                {/* Certificate Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-300 transition-colors duration-200">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-300 mb-4 min-h-10 line-clamp-2">
                    {course.description && course.description.length > 96
                      ? `${course.description.slice(0, 96)}...`
                      : course.description}
                  </p>

                  {/* Certificate Details */}
                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-400/40 rounded-xl p-3 mb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🏆</span>
                      <span className="text-sm font-semibold text-amber-200 break-all">
                        {certificate.certificateNumber || certificate.certificateId || "CERT"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {t.completedOn}: {formatDate(certificate.issuedAt || certificate.createdAt)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <Link
                      to={`/certificate/${course._id}`}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 py-2.5 px-4 rounded-lg font-bold text-center transition-all duration-200 shadow-lg hover:shadow-amber-500/40 hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      👁️ {t.viewCertificate}
                    </Link>
                    <Link
                      to={`/course-plan/${course._id}`}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 py-2.5 px-4 rounded-lg font-semibold text-center transition-all duration-200 border border-slate-600 hover:border-slate-500"
                    >
                      📘 {t.coursePlan}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyCertificates;
