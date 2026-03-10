import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaCertificate, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut, IoLogIn } from "react-icons/io5";
import toast from "react-hot-toast";
import api from "../services/api";

/**
 * Shared Navbar Component for User Pages
 * Features: Responsive, Accessible, Dark Mode with Modern Design
 */
function Navbar({ isLoggedIn, setIsLoggedIn, isSidebarOpen, setIsSidebarOpen, userProfile, cartCount, currentPage }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get(`/api/v1/user/logout`, { withCredentials: true });
      toast.success("Logged out successfully");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      window.location.href = "/";
    }
  };

  const navItems = [
    { path: "/", label: "Home", icon: <RiHome2Fill /> },
    { path: "/courses", label: "Courses", icon: <FaDiscourse /> },
    { path: "/purchases", label: "Purchases", icon: <FaDownload /> },
    { path: "/my-certificates", label: "Certificates", icon: <FaCertificate /> },
    { path: "/settings", label: "Settings", icon: <IoMdSettings /> },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Modern Sidebar Navigation */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 border-r border-slate-700 p-6 transform transition-all duration-300 z-40 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="User navigation"
      >
        {/* Logo Section */}
        <div className="mb-8 pt-2">
          <Link to="/" className="flex items-center gap-3 group mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center font-bold text-white text-xl group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all duration-300">
              FP
            </div>
            <span className="font-bold text-xl text-white group-hover:text-orange-400 transition-colors">
              Future Proof
            </span>
          </Link>
        </div>

        {/* User Profile Section */}
        {isLoggedIn && userProfile && (
          <div className="mb-8 pb-6 border-b border-slate-700">
            <div className="flex items-center gap-4">
              <img
                src={userProfile.profilePhoto || "/logo.webp"}
                alt={`${userProfile.firstName} profile`}
                className="rounded-lg h-12 w-12 object-cover border-2 border-orange-500/40 hover:border-orange-500 transition-colors"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate hover:text-orange-400 transition-colors cursor-pointer">
                  {userProfile.firstName}
                </p>
                <p className="text-xs text-gray-400 truncate">{userProfile.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-2 mb-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium group ${
                currentPage === item.path
                  ? "bg-gradient-to-r from-orange-500/20 to-yellow-500/10 text-orange-400 border-l-2 border-orange-500 shadow-lg shadow-orange-500/10"
                  : "text-gray-300 hover:text-white hover:bg-slate-700/50 hover:translate-x-1"
              }`}
              aria-current={currentPage === item.path ? "page" : undefined}
            >
              <span className="text-lg flex-shrink-0 transition-transform group-hover:scale-110 duration-300">
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Cart Badge Section */}
        <div className="mb-8 pb-6 border-b border-slate-700">
          <Link
            to="/cart"
            className="relative flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 font-medium group"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="text-2xl flex-shrink-0 transition-transform group-hover:scale-110 duration-300">
              🛒
            </span>
            <span className="truncate">Cart</span>
            {cartCount > 0 && (
              <span className="ml-auto bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Logout Section */}
        <div className="pt-4 border-t border-slate-700">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 font-semibold text-sm group"
              aria-label="Logout from account"
            >
              <IoLogOut className="text-lg transition-transform group-hover:scale-110 duration-300" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all duration-200 font-semibold text-sm group"
            >
              <IoLogIn className="text-lg transition-transform group-hover:scale-110 duration-300" />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Footer Branding */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 to-transparent border-t border-slate-700">
          <p className="text-xs text-gray-500 text-center">
            © 2026 Future Proof Learning
          </p>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
