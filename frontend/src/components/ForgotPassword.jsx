import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useLanguage } from "../context/LanguageContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Reset Password
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const text = {
    English: {
      emailVerified: "Email verified! Enter your new password.",
      emailNotFound: "Email not found",
      passwordsNoMatch: "Passwords do not match!",
      passwordMin: "Password must be at least 6 characters",
      resetSuccess: "Password reset successfully!",
      resetFailed: "Password reset failed",
      login: "Login",
      signup: "Signup",
      resetYour: "Reset Your",
      password: "Password",
      enterEmailToVerify: "Enter your email to verify your account",
      emailAddress: "Email Address",
      verifying: "Verifying...",
      verifyEmail: "Verify Email",
      rememberPassword: "Remember your password?",
      backToLogin: "Back to Login",
      setNewPasswordFor: "Set your new password for",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      enterNewPassword: "Enter new password",
      confirmNewPassword: "Confirm new password",
      resetting: "Resetting...",
      resetPassword: "Reset Password",
      changeEmail: "Change Email",
      yourEmail: "your@email.com",
    },
    Hindi: {
      emailVerified: "ईमेल सत्यापित! अपना नया पासवर्ड दर्ज करें।",
      emailNotFound: "ईमेल नहीं मिला",
      passwordsNoMatch: "पासवर्ड मेल नहीं खाते!",
      passwordMin: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
      resetSuccess: "पासवर्ड सफलतापूर्वक रीसेट हुआ!",
      resetFailed: "पासवर्ड रीसेट विफल",
      login: "लॉगिन",
      signup: "साइनअप",
      resetYour: "अपना रीसेट करें",
      password: "पासवर्ड",
      enterEmailToVerify: "अपना अकाउंट सत्यापित करने के लिए ईमेल दर्ज करें",
      emailAddress: "ईमेल पता",
      verifying: "सत्यापित हो रहा है...",
      verifyEmail: "ईमेल सत्यापित करें",
      rememberPassword: "पासवर्ड याद है?",
      backToLogin: "लॉगिन पर वापस जाएं",
      setNewPasswordFor: "के लिए नया पासवर्ड सेट करें",
      newPassword: "नया पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      enterNewPassword: "नया पासवर्ड दर्ज करें",
      confirmNewPassword: "नए पासवर्ड की पुष्टि करें",
      resetting: "रीसेट हो रहा है...",
      resetPassword: "पासवर्ड रीसेट करें",
      changeEmail: "ईमेल बदलें",
      yourEmail: "your@email.com",
    },
    Kannada: {
      emailVerified: "ಇಮೇಲ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ! ನಿಮ್ಮ ಹೊಸ ಪಾಸ್ವರ್ಡ್ ನಮೂದಿಸಿ.",
      emailNotFound: "ಇಮೇಲ್ ಕಂಡುಬಂದಿಲ್ಲ",
      passwordsNoMatch: "ಪಾಸ್ವರ್ಡ್‌ಗಳು ಒಂದೇ ಆಗಿಲ್ಲ!",
      passwordMin: "ಪಾಸ್ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು",
      resetSuccess: "ಪಾಸ್ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ರಿಸೆಟ್ ಆಯಿತು!",
      resetFailed: "ಪಾಸ್ವರ್ಡ್ ರಿಸೆಟ್ ವಿಫಲವಾಗಿದೆ",
      login: "ಲಾಗಿನ್",
      signup: "ಸೈನ್ ಅಪ್",
      resetYour: "ನಿಮ್ಮ",
      password: "ಪಾಸ್ವರ್ಡ್ ರಿಸೆಟ್ ಮಾಡಿ",
      enterEmailToVerify: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ಇಮೇಲ್ ನಮೂದಿಸಿ",
      emailAddress: "ಇಮೇಲ್ ವಿಳಾಸ",
      verifying: "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
      verifyEmail: "ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ",
      rememberPassword: "ಪಾಸ್ವರ್ಡ್ ನೆನಪಿದೆಯೆ?",
      backToLogin: "ಲಾಗಿನ್‌ಗೆ ಹಿಂದಿರುಗಿ",
      setNewPasswordFor: "ಗಾಗಿ ಹೊಸ ಪಾಸ್ವರ್ಡ್ ಸೆಟ್ ಮಾಡಿ",
      newPassword: "ಹೊಸ ಪಾಸ್ವರ್ಡ್",
      confirmPassword: "ಪಾಸ್ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
      enterNewPassword: "ಹೊಸ ಪಾಸ್ವರ್ಡ್ ನಮೂದಿಸಿ",
      confirmNewPassword: "ಹೊಸ ಪಾಸ್ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
      resetting: "ರಿಸೆಟ್ ಆಗುತ್ತಿದೆ...",
      resetPassword: "ಪಾಸ್ವರ್ಡ್ ರಿಸೆಟ್ ಮಾಡಿ",
      changeEmail: "ಇಮೇಲ್ ಬದಲಿಸಿ",
      yourEmail: "your@email.com",
    },
  };

  const t = text[language] || text.English;

  const navigate = useNavigate();

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post(
        `/api/v1/user/verify-email`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success(response.data.message || t.emailVerified);
      setStep(2);
    } catch (error) {
      const errorMsg = error.response?.data?.errors || t.emailNotFound;
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(false);
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      toast.error(t.passwordsNoMatch);
      return;
    }

    if (newPassword.length < 6) {
      toast.error(t.passwordMin);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        `/api/v1/user/reset-password`,
        { email, newPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success(response.data.message || t.resetSuccess);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.errors || t.resetFailed;
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
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
              to="/signup"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm md:text-base transition-all duration-200"
            >
              {t.signup}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <section className="hidden lg:block">
          <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/5 border border-orange-500/20 rounded-3xl p-8">
            <p className="text-sm uppercase tracking-widest text-orange-300 mb-4">Account Recovery</p>
            <h1 className="text-4xl font-black leading-tight text-white mb-4">
              {t.resetYour} <span className="text-orange-400">{t.password}</span>
            </h1>
            <p className="text-slate-300 text-lg">Securely verify your account and set a new password.</p>
          </div>
        </section>

        <section className="w-full">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700/60 rounded-2xl shadow-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
              {t.resetYour} <span className="text-orange-400">{t.password}</span>
            </h2>

            {step === 1 ? (
              <>
                <p className="text-center text-slate-300 mb-6">{t.enterEmailToVerify}</p>

                <form onSubmit={handleVerifyEmail} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="text-sm text-slate-300 mb-2 block">
                      {t.emailAddress}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder={t.yourEmail}
                      required
                    />
                  </div>

                  {errorMessage && (
                    <div className="text-red-300 bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-sm text-center">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-orange-500/30 disabled:opacity-60"
                  >
                    {loading ? t.verifying : t.verifyEmail}
                  </button>

                  <div className="text-center mt-2 text-sm text-slate-300">
                    {t.rememberPassword}{" "}
                    <Link to="/login" className="text-orange-400 hover:text-orange-300 transition-colors font-semibold">
                      {t.backToLogin}
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <>
                <p className="text-center text-slate-300 mb-6">
                  {t.setNewPasswordFor} <span className="text-orange-300 font-semibold">{email}</span>
                </p>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label htmlFor="newPassword" className="text-sm text-slate-300 mb-2 block">
                      {t.newPassword}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                        placeholder={t.enterNewPassword}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
                        aria-label="Toggle new password visibility"
                      >
                        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="text-sm text-slate-300 mb-2 block">
                      {t.confirmPassword}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                        placeholder={t.confirmNewPassword}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
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
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-orange-500/30 disabled:opacity-60"
                  >
                    {loading ? t.resetting : t.resetPassword}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setEmail("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 py-3 px-6 rounded-lg transition-all duration-200 border border-slate-600"
                  >
                    {t.changeEmail}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ForgotPassword;
