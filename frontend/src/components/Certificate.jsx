import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useLanguage } from "../context/LanguageContext";

function Certificate() {
  const { courseId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const text = {
    English: {
      loadingCertificate: "Loading your certificate...",
      certificateNotFound: "Certificate not found",
      backToPurchases: "Back to Purchases",
      certTitle: "CERTIFICATE",
      certSubtitle: "OF ACHIEVEMENT",
      certifies: "This certifies that",
      completedCourse: "has successfully completed the comprehensive course on",
      successfullyCompleted: "Successfully Completed",
      fromFutureProof: "from FUTURE PROOF",
      learningInitiative: "A Comprehensive Learning Initiative by Future Proof",
      courseDuration: "COURSE DURATION",
      selfPaced: "Self-Paced",
      completedWithExcellence: "Completed with Excellence",
      completionStatus: "COMPLETION STATUS",
      allRequirementsMet: "All Requirements Met",
      downloadPdf: "Download as PDF",
      backToCourses: "Back to Courses",
      downloadDetails: "Download Details",
      certInfo: "Certificate Information",
    },
    Hindi: {
      loadingCertificate: "आपका सर्टिफिकेट लोड हो रहा है...",
      certificateNotFound: "सर्टिफिकेट नहीं मिला",
      backToPurchases: "खरीदारी पर वापस जाएं",
      certTitle: "प्रमाणपत्र",
      certSubtitle: "उपलब्धि का",
      certifies: "यह प्रमाणित करता है कि",
      completedCourse: "ने निम्न कोर्स सफलतापूर्वक पूरा किया है",
      successfullyCompleted: "सफलतापूर्वक पूर्ण",
      fromFutureProof: "FUTURE PROOF से",
      learningInitiative: "Future Proof की एक व्यापक शिक्षण पहल",
      courseDuration: "कोर्स अवधि",
      selfPaced: "स्व-गति",
      completedWithExcellence: "उत्कृष्टता के साथ पूर्ण",
      completionStatus: "पूर्णता स्थिति",
      allRequirementsMet: "सभी आवश्यकताएं पूरी",
      downloadPdf: "PDF डाउनलोड करें",
      backToCourses: "कोर्स पर वापस जाएं",
      downloadDetails: "विवरण डाउनलोड करें",
      certInfo: "प्रमाणपत्र जानकारी",
    },
    Kannada: {
      loadingCertificate: "ನಿಮ್ಮ ಪ್ರಮಾಣಪತ್ರ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      certificateNotFound: "ಪ್ರಮಾಣಪತ್ರ ಕಂಡುಬಂದಿಲ್ಲ",
      backToPurchases: "ಖರೀದಿಗಳಿಗೆ ಹಿಂದಿರುಗಿ",
      certTitle: "ಪ್ರಮಾಣಪತ್ರ",
      certSubtitle: "ಸಾಧನೆಯ",
      certifies: "ಇದು ಪ್ರಮಾಣೀಕರಿಸುತ್ತದೆ",
      completedCourse: "ಸಮಗ್ರ ಕೋರ್ಸ್ ಅನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದಾನೆ/ಳು",
      successfullyCompleted: "ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ",
      fromFutureProof: "FUTURE PROOF ನಿಂದ",
      learningInitiative: "Future Proof ನ ಸಮಗ್ರ ಕಲಿಕಾ ಉಪಕ್ರಮ",
      courseDuration: "ಕೋರ್ಸ್ ಅವಧಿ",
      selfPaced: "ಸ್ವಯಂ ವೇಗ",
      completedWithExcellence: "ಶ್ರೇಷ್ಠತೆಯೊಂದಿಗೆ ಪೂರ್ಣಗೊಂಡಿದೆ",
      completionStatus: "ಪೂರ್ಣತೆ ಸ್ಥಿತಿ",
      allRequirementsMet: "ಎಲ್ಲಾ ಅವಶ್ಯಕತೆಗಳು ಪೂರ್ತಿಯಾಗಿವೆ",
      downloadPdf: "PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      backToCourses: "ಕೋರ್ಸ್‌ಗಳಿಗೆ ಹಿಂದಿರುಗಿ",
      downloadDetails: "ವಿವರಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      certInfo: "ಪ್ರಮಾಣಪತ್ರ ಮಾಹಿತಿ",
    },
  };

  const t = text[language] || text.English;

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCertificate = async () => {
      try {
        const response = await api.get(
          `/api/certificate/course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setCertificate(response.data.certificate);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching certificate:", error);
        toast.error(
          error.response?.data?.message || "Certificate not found"
        );
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [courseId, token, navigate]);

  const downloadCertificate = () => {
    if (!certificate) return;
    window.print();
    toast.success("Use 'Save as PDF' in the print dialog to download");
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce" style={{animationDuration: '1s'}}>🎓</div>
          <p className="text-2xl text-white font-semibold">{t.loadingCertificate}</p>
          <div className="mt-8 flex gap-1 justify-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="text-8xl mb-6">⚠️</div>
          <p className="text-2xl text-white font-bold mb-6">{t.certificateNotFound}</p>
          <button
            onClick={() => navigate("/purchases")}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:shadow-2xl transform hover:-translate-y-1"
          >
            {t.backToPurchases}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Cinzel:wght@400;600;700&family=Lora:wght@400;600&display=swap');
        
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-lora { font-family: 'Lora', serif; }
        
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .print-bg { background: white !important; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Certificate */}
        <div id="certificateContent" className="relative print-bg bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          {/* Decorative Top Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600"></div>
          
          {/* Main Certificate Container */}
          <div className="relative bg-gradient-to-b from-amber-50 via-slate-50 to-amber-50 p-16 min-h-[800px] flex flex-col justify-between">
            
            {/* Top decorative corner elements */}
            <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-amber-600 opacity-40"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-amber-600 opacity-40"></div>
            
            {/* Header Section */}
            <div className="text-center mb-8 relative z-10">
              {/* Emblem */}
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg flex items-center justify-center border-4 border-amber-200">
                  <div className="text-5xl">🎓</div>
                </div>
              </div>

              {/* Main Title */}
              <h1 className="font-playfair text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-amber-700 tracking-wider mb-2">
                {t.certTitle}
              </h1>
              <p className="font-cinzel text-2xl text-amber-700 font-semibold tracking-[0.3em] mb-4">
                {t.certSubtitle}
              </p>
              
              {/* Decorative line */}
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto"></div>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-8 relative z-10">
              {/* Introductory text */}
              <div>
                <p className="font-lora text-lg text-slate-700 font-light tracking-wide">
                  {t.certifies}
                </p>
              </div>

              {/* Student Name - Premium Style */}
              <div className="py-8">
                <p className="font-playfair text-5xl font-black text-slate-900 mb-4 uppercase tracking-wide">
                  {certificate.userName}
                </p>
                <div className="w-96 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 mx-auto"></div>
              </div>

              {/* Course completion text */}
              <div className="mb-6">
                <p className="font-lora text-lg text-slate-700 font-light mb-4">
                  {t.completedCourse}
                </p>
                <p className="font-cinzel text-4xl font-bold text-amber-700 tracking-wide">
                  {certificate.courseName}
                </p>
              </div>

              {/* Organization & Completion Statement */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg px-8 py-6 my-6">
                <p className="font-playfair text-3xl font-bold text-slate-900 mb-2">
                  {t.successfullyCompleted}
                </p>
                <p className="font-cinzel text-2xl font-semibold text-amber-700 tracking-widest">
                  {t.fromFutureProof}
                </p>
                <p className="font-lora text-sm text-slate-600 mt-3 italic">
                  {t.learningInitiative}
                </p>
              </div>

              {/* Course Details: Duration & Completion Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 px-4">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <p className="font-cinzel text-xs font-semibold text-blue-800 tracking-wider mb-2">{t.courseDuration}</p>
                  <p className="font-lora text-lg font-bold text-slate-900">{t.selfPaced}</p>
                  <p className="font-lora text-xs text-slate-600 mt-1">{t.completedWithExcellence}</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                  <p className="font-cinzel text-xs font-semibold text-green-800 tracking-wider mb-2">{t.completionStatus}</p>
                  <p className="font-lora text-lg font-bold text-green-700">✓ COMPLETED</p>
                  <p className="font-lora text-xs text-slate-600 mt-1">{t.allRequirementsMet}</p>
                </div>
              </div>

              {/* Achievement Stats Box */}
              <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-xl p-8 border-2 border-amber-400 my-8 shadow-lg">
                <div className="grid grid-cols-3 gap-8 text-white">
                  <div className="text-center py-4 border-r-2 border-amber-400 border-opacity-30">
                    <p className="font-cinzel text-sm font-semibold text-amber-300 tracking-wider mb-2">PERFORMANCE</p>
                    <p className="font-playfair text-5xl font-black text-yellow-300">
                      {certificate.percentage}%
                    </p>
                  </div>
                  <div className="text-center py-4 border-r-2 border-amber-400 border-opacity-30">
                    <p className="font-cinzel text-sm font-semibold text-amber-300 tracking-wider mb-2">QUIZ SCORE</p>
                    <p className="font-playfair text-4xl font-bold text-white">
                      {certificate.quizScore}/{certificate.totalQuestions}
                    </p>
                  </div>
                  <div className="text-center py-4">
                    <p className="font-cinzel text-sm font-semibold text-amber-300 tracking-wider mb-2">STATUS</p>
                    <p className="font-playfair text-4xl font-bold text-green-400">✓ PASSED</p>
                  </div>
                </div>
              </div>

              {/* Authentication Section */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t-2 border-amber-300">
                {/* Left - Signature */}
                <div className="text-center">
                  <div className="h-20 mb-4"></div>
                  <div className="h-1 bg-gradient-to-r from-slate-400 to-amber-600"></div>
                  <p className="font-cinzel text-xs font-semibold text-slate-700 mt-2 tracking-widest">AUTHORIZED</p>
                </div>

                {/* Center - Seal */}
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg border-4 border-amber-200 mb-2">
                    <p className="text-3xl">⭐</p>
                  </div>
                  <p className="font-cinzel text-xs font-semibold text-amber-700 tracking-widest">OFFICIAL SEAL</p>
                </div>

                {/* Right - Issued Date */}
                <div className="text-center">
                  <p className="font-lora text-lg text-slate-900 font-semibold mb-2">
                    {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <div className="h-1 bg-gradient-to-r from-amber-600 to-slate-400"></div>
                  <p className="font-cinzel text-xs font-semibold text-slate-700 mt-2 tracking-widest">DATE</p>
                </div>
              </div>

              {/* Certificate Details Footer */}
              <div className="pt-8 mt-8 border-t-2 border-amber-300 text-slate-700 space-y-3">
                <div className="grid grid-cols-2 gap-8 text-sm font-lora">
                  <div>
                    <p className="text-xs font-semibold text-amber-700 tracking-wider mb-1">CERTIFICATE NO.</p>
                    <p className="font-mono text-slate-900">{certificate.certificateNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-700 tracking-wider mb-1">UNIQUE ID</p>
                    <p className="font-mono text-slate-900 text-xs break-all">{certificate.uniqueCertificateId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 text-sm font-lora">
                  <div>
                    <p className="text-xs font-semibold text-amber-700 tracking-wider mb-1">COMPLETION DATE</p>
                    <p className="text-slate-900">{new Date(certificate.completionDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-700 tracking-wider mb-1">VALID UNTIL</p>
                    <p className="text-green-700 font-semibold">{new Date(certificate.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              {/* Statement */}
              <p className="font-lora text-xs text-slate-600 italic pt-6 pb-2">
                This digital certificate represents verified completion and outstanding performance in the course offered by FUTURE PROOF.
              </p>
              <p className="font-cinzel text-xs font-semibold text-amber-700 tracking-widest">
                Certified by FUTURE PROOF Learning Platform
              </p>
            </div>

            {/* Bottom Decorative Elements */}
            <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-amber-600 opacity-40"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-amber-600 opacity-40"></div>
          </div>

          {/* Decorative Bottom Border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center no-print mb-8 flex-wrap">
          <button
            onClick={downloadCertificate}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-500/50 hover:shadow-2xl transform hover:-translate-y-2 active:translate-y-0 hover:scale-105 cursor-pointer"
          >
            📥 {t.downloadPdf}
          </button>
          <button
            onClick={() => navigate("/purchases")}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/50 hover:shadow-2xl transform hover:-translate-y-2 active:translate-y-0 hover:scale-105"
          >
            ← {t.backToCourses}
          </button>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(`Certificate Details\n\nCertificate No: ${certificate.certificateNumber}\nRecipient: ${certificate.userName}\nCourse: ${certificate.courseName}\nPercentage: ${certificate.percentage}%\nScore: ${certificate.quizScore}/${certificate.totalQuestions}\nCompletion Date: ${new Date(certificate.completionDate).toLocaleDateString()}\nValid Until: ${new Date(certificate.validUntil).toLocaleDateString()}\n\nUnique ID: ${certificate.uniqueCertificateId}`)}`;
              link.setAttribute('download', `${certificate.certificateNumber}.txt`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success('Certificate details downloaded!');
            }}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/50 hover:shadow-2xl transform hover:-translate-y-2 active:translate-y-0 hover:scale-105"
          >
            💾 {t.downloadDetails}
          </button>
        </div>

        {/* Certificate Information Panel */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 no-print border-l-4 border-amber-600 backdrop-blur-sm border border-slate-700/50">
          <h3 className="text-3xl font-playfair font-black text-white mb-8 flex items-center gap-3">
            📋 {t.certInfo}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 p-6 rounded-xl border-l-4 border-blue-500 hover:border-blue-400 border border-blue-600/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <p className="font-cinzel text-sm font-semibold text-blue-300 tracking-wider mb-2">RECIPIENT NAME</p>
              <p className="font-lora text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">{certificate.userName}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-500/10 p-6 rounded-xl border-l-4 border-purple-500 hover:border-purple-400 border border-purple-600/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <p className="font-cinzel text-sm font-semibold text-purple-300 tracking-wider mb-2">COURSE TITLE</p>
              <p className="font-lora text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">{certificate.courseName}</p>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-green-500/10 p-6 rounded-xl border-l-4 border-green-500 hover:border-green-400 border border-green-600/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
              <p className="font-cinzel text-sm font-semibold text-green-300 tracking-wider mb-2">ACHIEVEMENT SCORE</p>
              <p className="font-playfair text-5xl font-black text-green-400 animate-pulse">{certificate.percentage}%</p>
            </div>
            <div className="bg-gradient-to-br from-orange-600/20 to-orange-500/10 p-6 rounded-xl border-l-4 border-orange-500 hover:border-orange-400 border border-orange-600/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
              <p className="font-cinzel text-sm font-semibold text-orange-300 tracking-wider mb-2">QUIZ PERFORMANCE</p>
              <p className="font-lora text-2xl font-bold text-white">{certificate.quizScore}/<span className="text-orange-300">{certificate.totalQuestions}</span> Correct</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-500/10 p-6 rounded-xl border-l-4 border-indigo-500 hover:border-indigo-400 border border-indigo-600/30 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
              <p className="font-cinzel text-sm font-semibold text-indigo-300 tracking-wider mb-2">ORGANIZATION</p>
              <p className="font-lora text-2xl font-bold text-indigo-300">FUTURE PROOF</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-500/10 p-6 rounded-xl border-l-4 border-cyan-500 hover:border-cyan-400 border border-cyan-600/30 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <p className="font-cinzel text-sm font-semibold text-cyan-300 tracking-wider mb-2">COURSE DURATION</p>
              <p className="font-lora text-2xl font-bold text-white">Self-Paced</p>
              <p className="font-lora text-xs text-cyan-300 mt-1">Flexible Learning</p>
            </div>
            <div className="bg-gradient-to-br from-rose-600/20 to-rose-500/10 p-6 rounded-xl border-l-4 border-rose-500 hover:border-rose-400 border border-rose-600/30 hover:border-rose-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/20">
              <p className="font-cinzel text-sm font-semibold text-rose-300 tracking-wider mb-2">COMPLETION STATUS</p>
              <p className="font-lora text-xl font-black text-rose-300">✓ COMPLETED</p>
              <p className="font-lora text-xs text-rose-200 mt-1">All Requirements Met</p>
            </div>
            <div className="bg-gradient-to-br from-amber-600/20 to-yellow-500/10 p-6 rounded-xl border-l-4 border-amber-500 hover:border-amber-400 border border-amber-600/30 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 md:col-span-2">
              <p className="font-cinzel text-sm font-semibold text-amber-300 tracking-wider mb-2">CERTIFICATE NUMBER</p>
              <p className="font-mono text-lg text-white bg-slate-800/50 p-2 rounded mt-1 select-all">{certificate.certificateNumber}</p>
              <p className="font-cinzel text-xs text-amber-300 mt-4 font-semibold">UNIQUE IDENTIFIER</p>
              <p className="font-mono text-xs text-slate-300 break-all mt-1 bg-slate-800/50 p-2 rounded select-all">{certificate.uniqueCertificateId}</p>
            </div>
            <div className="bg-gradient-to-br from-red-600/20 to-pink-500/10 p-6 rounded-xl border-l-4 border-red-500 hover:border-red-400 border border-red-600/30 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 md:col-span-2">
              <p className="font-cinzel text-sm font-semibold text-red-300 tracking-wider mb-4">VALIDITY PERIOD</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-red-300 font-semibold mb-1">ISSUED ON</p>
                  <p className="font-lora text-lg text-white">{new Date(certificate.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-red-300 font-semibold mb-1">EXPIRES</p>
                  <p className="font-lora text-lg font-bold text-green-400">{new Date(certificate.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
