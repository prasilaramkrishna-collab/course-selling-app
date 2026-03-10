import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaArrowRight, FaCheckCircle, FaRocket, FaShieldAlt } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useLanguage } from "../context/LanguageContext";

const SlickSlider = Slider.default || Slider;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { language } = useLanguage();

  const text = {
    English: {
      signup: "Signup",
      joinNow: "Join now",
      welcome: "Welcome to",
      loginSubtitle: "Log in to access paid content!",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot Password?",
      login: "Login",
      emailPasswordRequired: "Please enter email and password",
    },
    Hindi: {
      signup: "साइनअप",
      joinNow: "अभी जुड़ें",
      welcome: "स्वागत है",
      loginSubtitle: "पेड कंटेंट एक्सेस करने के लिए लॉगिन करें!",
      email: "ईमेल",
      password: "पासवर्ड",
      forgotPassword: "पासवर्ड भूल गए?",
      login: "लॉगिन",
      emailPasswordRequired: "कृपया ईमेल और पासवर्ड दर्ज करें",
    },
    Kannada: {
      signup: "ಸೈನ್ ಅಪ್",
      joinNow: "ಈಗ ಸೇರಿ",
      welcome: "ಸ್ವಾಗತ",
      loginSubtitle: "ಪೇಡ್ ವಿಷಯವನ್ನು ಪ್ರವೇಶಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ!",
      email: "ಇಮೇಲ್",
      password: "ಪಾಸ್ವರ್ಡ್",
      forgotPassword: "ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ?",
      login: "ಲಾಗಿನ್",
      emailPasswordRequired: "ದಯವಿಟ್ಟು ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್ವರ್ಡ್ ನಮೂದಿಸಿ",
    },
  };

  const t = text[language] || text.English;

  const navigate = useNavigate();

  const loginImageSliderSettings = {
    dots: true,
    infinite: true,
    speed: 650,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    arrows: false,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Attempting login to:", `/api/v1/user/login`);
    
    if (!email || !password) {
      toast.error(t.emailPasswordRequired);
      return;
    }

    try {
      const response = await api.post(
        `/api/v1/user/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login successful: ", response.data);
      toast.success(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data));
      // Small delay to ensure state updates before navigation
      setTimeout(() => {
        navigate("/courses");
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        const errorMsg = error.response.data.errors || "Login failed!!!";
        toast.error(errorMsg);
        setErrorMessage(errorMsg);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Cannot connect to server. Please make sure backend is running on port 4001");
        setErrorMessage("Network error - Cannot reach server");
      } else {
        console.error("Error setting up request:", error.message);
        toast.error("Network error. Please try again.");
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(249,115,22,0.25),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(20,184,166,0.2),transparent_32%),linear-gradient(to_bottom,#020617,#0f172a)]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[3rem_3rem]" />

      <div className="relative z-10">
        <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.webp" alt="Logo" className="w-10 h-10 rounded-xl border border-orange-500/40" />
              <Link to="/" className="text-xl font-black tracking-tight text-white">
                Future <span className="text-orange-400">Proof</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white transition-all"
              >
                {t.signup}
              </Link>
              <Link
                to="/courses"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500/20 border border-teal-400/30 text-teal-200 hover:bg-teal-500/30 transition-all"
              >
                {t.joinNow}
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <section className="order-2 lg:order-1 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-400/30 text-orange-300 text-xs font-semibold mb-5">
                <FaShieldAlt className="text-xs" />
                Secure Learning Access
              </div>
              <h1 className="text-3xl md:text-4xl font-black leading-tight text-white mb-4">
                {t.welcome} <span className="text-orange-400">Future Proof</span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg mb-6">{t.loginSubtitle}</p>

              <div className="rounded-2xl overflow-hidden border border-slate-700/70 mb-6">
                <SlickSlider {...loginImageSliderSettings}>
                  {[
                    {
                      title: "AI Learning Lab",
                      desc: "Personalized paths for faster outcomes.",
                      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
                    },
                    {
                      title: "Project-Based Learning",
                      desc: "Build practical work while you learn.",
                      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
                    },
                    {
                      title: "Collaborative Growth",
                      desc: "Join a community of ambitious learners.",
                      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
                    },
                  ].map((slide, idx) => (
                    <div key={idx} className="relative h-52 sm:h-60">
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-lg">{slide.title}</h3>
                        <p className="text-slate-200 text-sm">{slide.desc}</p>
                      </div>
                    </div>
                  ))}
                </SlickSlider>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/70">
                  <FaCheckCircle className="text-teal-400" />
                  <p className="text-sm text-slate-200">Continue your purchased courses instantly</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/70">
                  <FaRocket className="text-orange-400" />
                  <p className="text-sm text-slate-200">Track progress, quizzes, and certificates in one place</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 text-sm text-slate-400">
              50,000+ learners trust Future Proof for practical upskilling.
            </div>
          </section>

          <section className="order-1 lg:order-2 w-full">
            <div className="rounded-3xl border border-slate-700/70 bg-slate-900/70 backdrop-blur-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.65)] p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{t.login}</h2>
              <p className="text-slate-300 mb-6">{t.loginSubtitle}</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm text-slate-300 mb-2">
                    {t.email}
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/70 focus:border-orange-400"
                    placeholder="name@email.com"
                    required
                  />
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
                      className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/70 focus:border-orange-400 pr-11"
                      placeholder="********"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                  <div className="text-right mt-2">
                    <Link to="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                      {t.forgotPassword}
                    </Link>
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-red-300 bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-sm text-center">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-slate-950 font-extrabold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-500/30"
                >
                  {t.login}
                  <FaArrowRight className="text-xs" />
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Login;
