import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaCertificate } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import { FaCircleUser } from "react-icons/fa6";
import api from "../services/api";
import { useLanguage } from "../context/LanguageContext";

function Cart() {
  const { cartItems, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
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
      shoppingCart: "Shopping Cart",
      cartEmpty: "Your cart is empty",
      continueShopping: "Continue Shopping",
      remove: "Remove",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      items: "items",
      discount: "Discount",
      total: "Total",
      processing: "Processing...",
      proceedCheckout: "Proceed to Checkout",
      clearCart: "Clear Cart",
      loginToPurchase: "Please login to purchase courses",
      cartEmptyToast: "Your cart is empty",
      itemRemoved: "Item removed from cart",
      cartCleared: "Cart cleared",
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
      shoppingCart: "शॉपिंग कार्ट",
      cartEmpty: "आपका कार्ट खाली है",
      continueShopping: "खरीदारी जारी रखें",
      remove: "हटाएं",
      orderSummary: "ऑर्डर सारांश",
      subtotal: "उप-योग",
      items: "आइटम",
      discount: "छूट",
      total: "कुल",
      processing: "प्रोसेस हो रहा है...",
      proceedCheckout: "चेकआउट पर जाएं",
      clearCart: "कार्ट खाली करें",
      loginToPurchase: "कोर्स खरीदने के लिए लॉगिन करें",
      cartEmptyToast: "आपका कार्ट खाली है",
      itemRemoved: "आइटम कार्ट से हटा दिया गया",
      cartCleared: "कार्ट साफ कर दिया गया",
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
      shoppingCart: "ಶಾಪಿಂಗ್ ಕಾರ್ಟ್",
      cartEmpty: "ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ",
      continueShopping: "ಖರೀದಿ ಮುಂದುವರಿಸಿ",
      remove: "ತೆಗೆದುಹಾಕಿ",
      orderSummary: "ಆರ್ಡರ್ ಸಾರಾಂಶ",
      subtotal: "ಉಪಮೊತ್ತ",
      items: "ಐಟಂಗಳು",
      discount: "ರಿಯಾಯಿತಿ",
      total: "ಒಟ್ಟು",
      processing: "ಪ್ರಕ್ರಿಯೆ ನಡೆಯುತ್ತಿದೆ...",
      proceedCheckout: "ಚೆಕ್ಔಟ್‌ಗೆ ಮುಂದುವರಿಸಿ",
      clearCart: "ಕಾರ್ಟ್ ತೆರವುಗೊಳಿಸಿ",
      loginToPurchase: "ಕೋರ್ಸ್‌ಗಳನ್ನು ಖರೀದಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ",
      cartEmptyToast: "ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ",
      itemRemoved: "ಐಟಂ ಕಾರ್ಟ್‌ನಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ",
      cartCleared: "ಕಾರ್ಟ್ ತೆರವುಗೊಳಿಸಲಾಗಿದೆ",
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

  // Check token
  React.useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await api.get(`/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.log("Error in logging out ", error);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/");
    }
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.error(t.loginToPurchase);
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error(t.cartEmptyToast);
      return;
    }

    // Navigate to checkout page with Stripe payment
    navigate("/checkout");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Hamburger menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-100 w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 p-4 rounded-lg">
          <img 
            src={userProfile?.profilePhoto || "/logo.webp"} 
            alt="Profile" 
            className="rounded-full h-12 w-12 object-cover" 
          />
        </div>
        <nav className="space-y-2">
          <ul>
            <li className="mb-4">
              <Link to="/" className="flex items-center px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-yellow-500/10 transition-all duration-200 group">
                <RiHome2Fill className="mr-2" /> {t.home}
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-yellow-500/10 transition-all duration-200 group">
                <FaDiscourse className="mr-2" /> {t.courses}
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/cart" className="flex items-center px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/10 border-2 border-orange-500 text-orange-500 font-semibold transition-all duration-200">
                🛒 {t.cart} ({cartItems.length})
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/purchases" className="flex items-center px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-yellow-500/10 transition-all duration-200 group">
                <FaDownload className="mr-2" /> {t.purchases}
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/my-certificates" className="flex items-center px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-yellow-500/10 transition-all duration-200 group">
                <FaCertificate className="mr-2" /> {t.certificates}
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/settings" className="flex items-center px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-yellow-500/10 transition-all duration-200 group">
                <IoMdSettings className="mr-2" /> {t.settings}
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <Link to="/" className="flex items-center px-4 py-3 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group" onClick={handleLogout}>
                  <IoLogOut className="mr-2" /> {t.logout}
                </Link>
              ) : (
                <Link to="/login" className="flex items-center px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-yellow-500/10 transition-all duration-200 group">
                  <IoLogIn className="mr-2" /> {t.login}
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-5 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="ml-0 md:ml-64 w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
        <header className="flex justify-between items-center mb-10">
        {/* Hamburger menu button for mobile */}
        <button
          className="md:hidden text-3xl text-orange-500 hover:text-orange-400 transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <HiX /> : <HiMenu />}
        </button>

        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
          🛒 {t.shoppingCart}
        </h1>
        <button
          onClick={() => navigate("/settings")}
          className="cursor-pointer hover:scale-110 transition-transform duration-200"
          aria-label="User settings"
        >
            <FaCircleUser className="text-4xl text-blue-600" />
          </button>
        </header>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <div className="text-8xl mb-6 animate-bounce">🛍️</div>
            <p className="text-xl text-slate-400 mb-6">{t.cartEmpty}</p>
            <Link
              to="/courses"
              className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-slate-900 font-bold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-500/50 hover:shadow-2xl transform hover:-translate-y-1"
            >
              {t.continueShopping}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4" role="list">
                {cartItems.map((course) => (
                  <div
                    key={course._id}
                    role="listitem"
                    className="group bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-700/50 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row gap-4 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
                  >
                    <div className="relative overflow-hidden rounded-lg sm:w-28 sm:h-28 w-full h-40 flex-shrink-0">
                      <img
                        src={course?.image?.url || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-200">
                        {course.title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                        {course.description.slice(0, 100)}...
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                          ₹{course.price}
                        </span>
                        <button
                          onClick={() => {
                            removeFromCart(course._id);
                            toast.success(t.itemRemoved);
                          }}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-red-500/30 transform hover:scale-105 active:scale-95"
                        >
                          × {t.remove}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border border-slate-700/50 rounded-2xl p-6 md:p-8 sticky top-8 shadow-2xl shadow-orange-500/10 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  💳
                  {t.orderSummary}
                </h2>
                <div className="space-y-4 mb-6 pb-6 border-b border-slate-700/50">
                  <div className="flex justify-between text-slate-400">
                    <span className="text-sm">{t.subtotal} ({cartItems.length} {t.items})</span>
                    <span className="font-semibold text-slate-300">₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span className="text-sm">{t.discount}</span>
                    <span className="text-emerald-400 font-semibold">-₹0</span>
                  </div>
                </div>
                <div className="flex justify-between text-2xl font-bold mb-6 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-4 rounded-xl border border-orange-500/30">
                  <span className="text-white">{t.total}</span>
                  <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">₹{getTotalPrice()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:from-slate-600 disabled:to-slate-600 text-slate-900 font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-500/50 hover:shadow-2xl disabled:shadow-none transform hover:-translate-y-1 disabled:translate-y-0 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  {loading ? t.processing : t.proceedCheckout}
                </button>
                <button
                  onClick={() => {
                    clearCart();
                    toast.success(t.cartCleared);
                  }}
                  className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold py-3 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                >
                  {t.clearCart}
                </button>
                <Link
                  to="/courses"
                  className="block text-center mt-4 text-orange-400 hover:text-orange-300 font-bold transition-colors duration-200"
                >
                  {t.continueShopping}
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
