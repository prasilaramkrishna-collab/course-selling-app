import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaRocket, FaBrain, FaUsers, FaStar, FaChartLine, FaAward, FaClock, FaCheckCircle, FaCertificate } from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

// Fix for Vite + react-slick compatibility
const SlickSlider = Slider.default || Slider;
function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { language } = useLanguage();

  const text = {
    English: {
      loadingCourses: "Loading courses...",
      loginToEnroll: "Please login to enroll",
      alreadyInCart: "Course already in cart",
      logout: "Logout",
      login: "Login",
      signup: "Signup",
      tagline: "Sharpen your skills with courses crafted by experts.",
      exploreCourses: "Explore courses",
      joinCommunity: "Join Community",
      enrollNow: "Enroll Now",
      noCourses: "No courses available yet. Add courses from the admin dashboard!",
    },
    Hindi: {
      loadingCourses: "कोर्स लोड हो रहे हैं...",
      loginToEnroll: "एनरोल करने के लिए लॉगिन करें",
      alreadyInCart: "कोर्स पहले से कार्ट में है",
      logout: "लॉगआउट",
      login: "लॉगिन",
      signup: "साइनअप",
      tagline: "विशेषज्ञों द्वारा तैयार कोर्स के साथ अपने कौशल को बेहतर बनाएं।",
      exploreCourses: "कोर्स देखें",
      joinCommunity: "कम्युनिटी जॉइन करें",
      enrollNow: "अभी एनरोल करें",
      noCourses: "अभी कोई कोर्स उपलब्ध नहीं है। एडमिन डैशबोर्ड से कोर्स जोड़ें!",
    },
    Kannada: {
      loadingCourses: "ಕೋರ್ಸ್‌ಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...",
      loginToEnroll: "ನೋಂದಣಿ ಮಾಡಲು ಲಾಗಿನ್ ಮಾಡಿ",
      alreadyInCart: "ಕೋರ್ಸ್ ಈಗಾಗಲೇ ಕಾರ್ಟ್‌ನಲ್ಲಿ ಇದೆ",
      logout: "ಲಾಗ್ ಔಟ್",
      login: "ಲಾಗಿನ್",
      signup: "ಸೈನ್ ಅಪ್",
      tagline: "ತಜ್ಞರು ರೂಪಿಸಿದ ಕೋರ್ಸ್‌ಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಕೌಶಲ್ಯವನ್ನು ಹೆಚ್ಚಿಸಿಕೊಳ್ಳಿ.",
      exploreCourses: "ಕೋರ್ಸ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
      joinCommunity: "ಕಮ್ಯುನಿಟಿಗೆ ಸೇರಿ",
      enrollNow: "ಈಗಲೇ ನೋಂದಣಿ ಮಾಡಿ",
      noCourses: "ಇನ್ನೂ ಯಾವುದೇ ಕೋರ್ಸ್ ಲಭ್ಯವಿಲ್ಲ. ಆಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಿಂದ ಕೋರ್ಸ್ ಸೇರಿಸಿ!",
    },
  };

  const t = text[language] || text.English;

  // token
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/v1/course/courses`, {
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses || []);
      } catch (error) {
        console.log("error in fetchCourses ", error);
        toast.error("Failed to load courses. Please refresh the page.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle Enroll Now - Razorpay checkout
  const handleEnrollNow = (course) => {
    if (!isLoggedIn) {
      toast.error(t.loginToEnroll);
      navigate("/login");
      return;
    }

    // Add course to cart and navigate to checkout
    if (addToCart(course)) {
      navigate("/checkout");
    } else {
      toast.error(t.alreadyInCart);
    }
  };

  // Smooth scroll to courses section
  const scrollToCourses = () => {
    const coursesSection = document.getElementById('courses-section');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // logout
  const handleLogout = async () => {
    try {
      const response = await api.get(`/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      // Reload to show login state
      window.location.reload();
    } catch (error) {
      console.log("Error in logging out ", error);
      const errorMsg = error.response?.data?.errors || error.message || "Error in logging out";
      toast.error(errorMsg);
      // Even if there's an error, clear local storage and reload
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      window.location.reload();
    }
  };

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Course slider settings
  var courseSliderSettings = {
    dots: true,
    infinite: courses && courses.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  // Loading state with improved accessibility
  if (loading) {
    return (
      <div 
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center"
        role="status"
        aria-live="polite"
        aria-label={t.loadingCourses}
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-orange-500/20 rounded-full">
            <div className="text-4xl animate-bounce">⏳</div>
          </div>
          <p className="text-lg text-gray-300">{t.loadingCourses}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white overflow-hidden relative">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header Navigation */}
        <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="relative">
                  <img
                    src="/logo.webp"
                    alt="Future Proof Logo"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover transition-transform hover:scale-110 hover:rotate-6 duration-300"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-500/20 to-purple-500/20 blur-md -z-10"></div>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent hidden sm:block">
                  Future Proof
                </h1>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-2 sm:gap-4">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="px-3 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-lg border border-slate-700 text-white hover:bg-slate-800 hover:border-orange-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="Logout from account"
                  >
                    {t.logout}
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-3 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-lg border border-slate-700 text-white hover:bg-slate-800 hover:border-orange-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {t.login}
                    </Link>
                    <Link
                      to="/signup"
                      className="px-3 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {t.signup}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 overflow-hidden">
          {/* Animated Circuit Lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-orange-500/50 to-transparent animate-pulse"></div>
            <div className="absolute top-20 right-1/4 w-px h-40 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent animate-pulse delay-300"></div>
            <div className="absolute bottom-0 left-1/3 w-px h-48 bg-gradient-to-t from-transparent via-blue-500/50 to-transparent animate-pulse delay-700"></div>
          </div>

          <div className="max-w-6xl mx-auto text-center space-y-8 sm:space-y-10 relative">
            {/* AI Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 backdrop-blur-sm animate-fadeIn">
              <HiSparkles className="text-orange-500 animate-spin-slow" />
              <span className="text-sm font-medium text-gray-300">AI-Powered Learning Platform</span>
              <HiLightningBolt className="text-purple-500" />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight animate-fadeIn">
              <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Transform Your Future
              </span>
              <span className="block mt-2 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
                With Expert Courses
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fadeIn delay-200">
              {t.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fadeIn delay-300">
              <button
                onClick={scrollToCourses}
                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <FaRocket className="group-hover:rotate-12 transition-transform" />
                  <span>{t.exploreCourses}</span>
                </span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
              </button>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <FaUsers />
                <span>{t.joinCommunity}</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto animate-fadeIn delay-500">
              {[
                { icon: FaUsers, value: '50,000+', label: 'Students' },
                { icon: FaBrain, value: courses.length + '+', label: 'Courses' },
                { icon: FaStar, value: '4.9/5', label: 'Rating' },
                { icon: FaAward, value: '95%', label: 'Success' }
              ].map((stat, idx) => (
                <div key={idx} className="group p-4 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 hover:border-orange-500/30 hover:bg-slate-900/80 transition-all duration-300">
                  <stat.icon className="text-3xl text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section id="courses-section" className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-4 sm:pt-16 sm:pb-6 scroll-mt-20">
          <div className="max-w-7xl mx-auto w-full">
            {/* Section Header */}
            <div className="text-center mb-16 sm:mb-20">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 backdrop-blur-sm mb-4">
                <FaStar className="text-orange-500" />
                <span className="text-sm font-medium text-gray-300">Featured Courses</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Master New Skills
                </span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                Explore our carefully curated selection of expert-led courses designed to transform your career
              </p>
            </div>

            {courses && courses.length > 0 ? (
              <div className="slider-container courses-slider">
                <SlickSlider {...courseSliderSettings}>
                  {courses.map((course, idx) => {
                    let imageUrl = '/placeholder.svg';
                    if (course.image) {
                      if (typeof course.image === 'object' && course.image.url) {
                        imageUrl = course.image.url;
                      }
                    }
                    
                    return (
                      <div key={course._id} className="px-3">
                        <article
                          className="group relative rounded-2xl overflow-hidden bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 hover:border-orange-500/30 transition-all duration-500 hover:scale-105 flex flex-col h-full"
                        >
                          {/* Glow Effect on Hover */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-purple-500/10 group-hover:to-orange-500/10 transition-all duration-500 pointer-events-none"></div>
                          
                          {/* Course Image */}
                          <div className="relative h-48 overflow-hidden bg-slate-800/50">
                            <img
                              src={imageUrl}
                              alt={course.title || 'Course'}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder.svg';
                              }}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                            
                            {/* Trending Badge */}
                            {idx < 3 && (
                              <div className="absolute top-3 right-3 flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-bold shadow-lg">
                                <HiSparkles className="text-sm" />
                                <span>Trending</span>
                              </div>
                            )}
                          </div>

                          {/* Course Content */}
                          <div className="p-5 flex flex-col flex-grow relative z-10">
                            <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-yellow-400 group-hover:bg-clip-text transition-all duration-300">
                              {course.title}
                            </h3>

                            {/* Stats */}
                            <div className="flex items-center space-x-4 mb-4 text-xs text-gray-400">
                              <div className="flex items-center space-x-1">
                                <FaUsers className="text-orange-500" />
                                <span>{Math.floor(Math.random() * 5000) + 1000}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FaStar className="text-yellow-500" />
                                <span>4.{Math.floor(Math.random() * 3) + 7}</span>
                              </div>
                            </div>

                            {/* Price and Action */}
                            <div className="mt-auto space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-gray-400 line-through">
                                    ₹{Math.floor(course.price * 1.5)}
                                  </p>
                                  <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                                    ₹{course.price}
                                  </p>
                                </div>
                                <div className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                                  {Math.floor(((course.price * 1.5 - course.price) / (course.price * 1.5)) * 100)}% OFF
                                </div>
                              </div>
                              
                              <button
                                onClick={() => handleEnrollNow(course)}
                                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-center space-x-2 group"
                                aria-label={`Enroll in ${course.title}`}
                              >
                                <span>{t.enrollNow}</span>
                                <FaRocket className="text-sm group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>

                          {/* Corner Accent */}
                          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </article>
                      </div>
                    );
                  })}
                </SlickSlider>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-slate-800/50 rounded-full">
                  <FaBrain className="text-4xl text-gray-600" />
                </div>
                <p className="text-gray-400 text-lg">{t.noCourses}</p>
              </div>
            )}

            {/* View All Courses Link */}
            {courses && courses.length > 0 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      toast.error(t.loginToEnroll);
                      navigate("/login");
                    } else {
                      navigate("/courses");
                    }
                  }}
                  className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 text-white font-bold hover:border-orange-500/30 hover:bg-slate-900/80 transition-all duration-300"
                >
                  <span>View All Courses</span>
                  <HiLightningBolt className="text-orange-500" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-4 pb-12 sm:pt-6 sm:pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 backdrop-blur-sm mb-4">
                <HiSparkles className="text-orange-500" />
                <span className="text-sm font-medium text-gray-300">Why Choose Us</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Your Learning Advantages
                </span>
              </h2>
            </div>

            {/* Slider Container */}
            <div className="slider-container relative">
              <SlickSlider {...settings}>
                {[
                  { 
                    icon: FaRocket, 
                    title: 'Fast-Track Your Career', 
                    desc: 'Learn in-demand skills that employers are actively seeking. Get hired faster with practical, industry-relevant knowledge.',
                    color: 'from-orange-500 to-red-500',
                    bgColor: 'bg-orange-500/10',
                    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&h=250&fit=crop'
                  },
                  { 
                    icon: FaBrain, 
                    title: 'Expert-Led Courses', 
                    desc: 'Learn from industry professionals with years of real-world experience. Get insights you won\'t find in textbooks.',
                    color: 'from-purple-500 to-pink-500',
                    bgColor: 'bg-purple-500/10',
                    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=400&h=250&fit=crop'
                  },
                  { 
                    icon: FaCertificate, 
                    title: 'Earn Certificates', 
                    desc: 'Receive industry-recognized certificates upon completion. Boost your resume and stand out to employers.',
                    color: 'from-blue-500 to-cyan-500',
                    bgColor: 'bg-blue-500/10',
                    image: 'https://images.unsplash.com/photo-1589395937047-4c78de7d4751?q=80&w=400&h=250&fit=crop'
                  },
                  { 
                    icon: FaChartLine, 
                    title: 'Track Your Progress', 
                    desc: 'Monitor your learning journey with detailed analytics. Stay motivated with clear milestones and achievements.',
                    color: 'from-green-500 to-emerald-500',
                    bgColor: 'bg-green-500/10',
                    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&h=250&fit=crop'
                  },
                  { 
                    icon: FaClock, 
                    title: 'Learn At Your Pace', 
                    desc: 'Lifetime access to all course materials. Study whenever, wherever - your schedule, your rules.',
                    color: 'from-yellow-500 to-orange-500',
                    bgColor: 'bg-yellow-500/10',
                    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=400&h=250&fit=crop'
                  },
                  { 
                    icon: FaUsers, 
                    title: 'Join 50K+ Learners', 
                    desc: 'Be part of a thriving community of learners. Network, collaborate, and grow together.',
                    color: 'from-pink-500 to-purple-500',
                    bgColor: 'bg-pink-500/10',
                    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&h=250&fit=crop'
                  },
                  { 
                    icon: FaAward, 
                    title: '95% Success Rate', 
                    desc: 'Our students achieve their goals. Industry-leading completion rates and career outcomes.',
                    color: 'from-indigo-500 to-blue-500',
                    bgColor: 'bg-indigo-500/10',
                    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&h=250&fit=crop'
                  },
                  { 
                    icon: HiLightningBolt, 
                    title: 'Instant Access', 
                    desc: 'Start learning immediately after enrollment. No waiting, no delays - dive right in.',
                    color: 'from-cyan-500 to-teal-500',
                    bgColor: 'bg-cyan-500/10',
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&h=250&fit=crop'
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="px-3 py-4">
                    <div className="group relative rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 hover:border-slate-700 transition-all duration-500 hover:scale-105 overflow-hidden flex flex-col">
                      {/* Gradient Top Border */}
                      <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r ${feature.color} z-10`}></div>
                      
                      {/* Feature Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent`}></div>
                        
                        {/* Icon Overlay on Image */}
                        <div className={`absolute bottom-4 left-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                          <feature.icon className={`text-3xl bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed flex-grow">{feature.desc}</p>
                      </div>
                      
                      {/* Decorative Corner */}
                      <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${feature.color} opacity-5 rounded-tl-full transition-opacity duration-500 group-hover:opacity-10`}></div>
                    </div>
                  </div>
                ))}
              </SlickSlider>
            </div>

            {/* Additional Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                { icon: FaChartLine, title: 'Track Progress', desc: 'Monitor your learning journey', color: 'from-blue-500 to-cyan-500' },
                { icon: FaClock, title: 'Lifetime Access', desc: 'Learn at your own pace', color: 'from-purple-500 to-pink-500' },
                { icon: FaCheckCircle, title: 'Certified', desc: 'Industry-recognized certificates', color: 'from-orange-500 to-yellow-500' }
              ].map((feature, idx) => (
                <div key={idx} className="group relative p-6 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 hover:border-slate-700 transition-all duration-300 hover:scale-105">
                  <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r ${feature.color}`}></div>
                  <feature.icon className={`text-4xl mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative mt-20 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800/50 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
              {/* Brand Section */}
              <div className="text-center sm:text-left lg:col-span-1">
                <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4">
                  <div className="relative">
                    <img src="/logo.webp" alt="Future Proof" className="w-10 h-10 rounded-lg" />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-500/30 to-purple-500/30 blur-md -z-10"></div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    Future Proof
                  </h2>
                </div>
                <p className="text-gray-400 text-sm mb-5 max-w-sm">
                  Empowering learners worldwide with quality education and industry-recognized certifications.
                </p>
                
                {/* Social Links */}
                <nav aria-label="Social media links">
                  <div className="flex justify-center sm:justify-start space-x-4">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-slate-800/50 text-gray-400 hover:text-blue-400 hover:bg-slate-800 transition-all duration-300"
                      aria-label="Follow us on Facebook"
                    >
                      <FaFacebook className="text-xl" />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-slate-800/50 text-gray-400 hover:text-pink-500 hover:bg-slate-800 transition-all duration-300"
                      aria-label="Follow us on Instagram"
                    >
                      <FaInstagram className="text-xl" />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-slate-800/50 text-gray-400 hover:text-blue-300 hover:bg-slate-800 transition-all duration-300"
                      aria-label="Follow us on Twitter"
                    >
                      <FaTwitter className="text-xl" />
                    </a>
                  </div>
                </nav>
              </div>

              {/* Quick Links */}
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center sm:justify-start space-x-2">
                  <FaRocket className="text-orange-500" />
                  <span>Quick Links</span>
                </h3>
                <ul className="space-y-2" role="list">
                  <li>
                    <Link to="/courses" className="text-gray-400 hover:text-orange-400 text-sm inline-block hover:translate-x-1 transition-all duration-300">
                      All Courses
                    </Link>
                  </li>
                  <li>
                    <Link to="/purchases" className="text-gray-400 hover:text-orange-400 text-sm inline-block hover:translate-x-1 transition-all duration-300">
                      My Learning
                    </Link>
                  </li>
                  <li>
                    <Link to="/certificates" className="text-gray-400 hover:text-orange-400 text-sm inline-block hover:translate-x-1 transition-all duration-300">
                      Certificates
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Community Links */}
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center sm:justify-start space-x-2">
                  <FaUsers className="text-orange-500" />
                  <span>Community</span>
                </h3>
                <ul className="space-y-2" role="list">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-orange-400 text-sm inline-block hover:translate-x-1 transition-all duration-300">
                      WhatsApp Community
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-orange-400 text-sm inline-block hover:translate-x-1 transition-all duration-300">
                      Discord Server
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-orange-400 text-sm inline-block hover:translate-x-1 transition-all duration-300">
                      LinkedIn Group
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal Links */}
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center sm:justify-start space-x-2">
                  <FaCheckCircle className="text-orange-500" />
                  <span>Legal</span>
                </h3>
                <ul className="space-y-2" role="list">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-orange-400 text-sm inline-block hover:translate-x-1 transition-all duration-300">
                      Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-orange-400 text-sm inline-block hover:translate-x-1 transition-all duration-300">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-orange-400 text-sm inline-block hover:translate-x-1 transition-all duration-300">
                      Refund & Cancellation
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-slate-800/50 mt-12 pt-8 text-center">
              <p className="text-gray-500 text-sm">
                © 2026 Future Proof Learning. All rights reserved. Made with <span className="text-red-500">♥</span> for learners worldwide.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
