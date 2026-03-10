import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { useLanguage } from "../context/LanguageContext";

function CheckoutCart() {
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();
  const { language } = useLanguage();

  const text = {
    English: {
      loginToContinue: "Please login to continue",
      cartEmpty: "Your cart is empty",
      invalidTotal: "Invalid cart total. Please refresh and try again.",
      failedCreateOrder: "Failed to create order",
      failedCreateOrderFallback: "Failed to create order",
      razorpayNotLoaded: "Razorpay script not loaded. Please refresh the page.",
      purchaseDesc: "Purchase",
      paymentSuccess: "Payment successful! Courses unlocked.",
      paymentVerifyFailed: "Payment verification failed",
      paymentVerifyError: "Error verifying payment",
      checkout: "Checkout",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      tax: "Tax (0%)",
      total: "Total",
      processing: "Processing...",
      payRazorpay: "Pay with Razorpay",
      backToCart: "Back to Cart",
    },
    Hindi: {
      loginToContinue: "आगे बढ़ने के लिए लॉगिन करें",
      cartEmpty: "आपका कार्ट खाली है",
      invalidTotal: "कार्ट कुल अमान्य है। कृपया रीफ्रेश करके फिर प्रयास करें।",
      failedCreateOrder: "ऑर्डर बनाने में विफल",
      failedCreateOrderFallback: "ऑर्डर बनाने में विफल",
      razorpayNotLoaded: "Razorpay स्क्रिप्ट लोड नहीं हुई। कृपया पेज रीफ्रेश करें।",
      purchaseDesc: "खरीद",
      paymentSuccess: "भुगतान सफल! कोर्स अनलॉक हो गए।",
      paymentVerifyFailed: "भुगतान सत्यापन विफल",
      paymentVerifyError: "भुगतान सत्यापित करने में त्रुटि",
      checkout: "चेकआउट",
      orderSummary: "ऑर्डर सारांश",
      subtotal: "उप-योग",
      tax: "कर (0%)",
      total: "कुल",
      processing: "प्रोसेस हो रहा है...",
      payRazorpay: "Razorpay से भुगतान करें",
      backToCart: "कार्ट पर वापस जाएं",
    },
    Kannada: {
      loginToContinue: "ಮುಂದುವರಿಯಲು ಲಾಗಿನ್ ಮಾಡಿ",
      cartEmpty: "ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ",
      invalidTotal: "ಕಾರ್ಟ್ ಒಟ್ಟು ಅಮಾನ್ಯವಾಗಿದೆ. ದಯವಿಟ್ಟು ರಿಫ್ರೆಶ್ ಮಾಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      failedCreateOrder: "ಆರ್ಡರ್ ರಚಿಸಲು ವಿಫಲವಾಗಿದೆ",
      failedCreateOrderFallback: "ಆರ್ಡರ್ ರಚಿಸಲು ವಿಫಲವಾಗಿದೆ",
      razorpayNotLoaded: "Razorpay ಸ್ಕ್ರಿಪ್ಟ್ ಲೋಡ್ ಆಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಪುಟವನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ.",
      purchaseDesc: "ಖರೀದಿ",
      paymentSuccess: "ಪಾವತಿ ಯಶಸ್ವಿಯಾಯಿತು! ಕೋರ್ಸ್‌ಗಳು ಅನ್ಲಾಕ್ ಆಗಿವೆ.",
      paymentVerifyFailed: "ಪಾವತಿ ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ",
      paymentVerifyError: "ಪಾವತಿ ಪರಿಶೀಲನೆ ದೋಷ",
      checkout: "ಚೆಕ್ಔಟ್",
      orderSummary: "ಆರ್ಡರ್ ಸಾರಾಂಶ",
      subtotal: "ಉಪಮೊತ್ತ",
      tax: "ತೆರಿಗೆ (0%)",
      total: "ಒಟ್ಟು",
      processing: "ಪ್ರಕ್ರಿಯೆ ನಡೆಯುತ್ತಿದೆ...",
      payRazorpay: "Razorpay ಮೂಲಕ ಪಾವತಿಸಿ",
      backToCart: "ಕಾರ್ಟ್‌ಗೆ ಹಿಂದಿರುಗಿ",
    },
  };

  const t = text[language] || text.English;

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Verify user login and cart
  useEffect(() => {
    if (!token) {
      toast.error(t.loginToContinue);
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error(t.cartEmpty);
      navigate("/cart");
      return;
    }
  }, [token, cartItems, navigate]);

  // Create Razorpay order
  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const totalAmount = Number(getTotalPrice());

      if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
        toast.error(t.invalidTotal);
        return;
      }

      const response = await api.post(
        `/api/payment/create-order`,
        {
          amount: Number(totalAmount.toFixed(2)),
          courseIds: cartItems.map((c) => c._id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setOrderId(response.data.order_id);
        handlePayment(response.data);
      } else {
        toast.error(response.data.message || t.failedCreateOrder);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      const backendMessage = error.response?.data?.error || error.response?.data?.message;
      toast.error(backendMessage || t.failedCreateOrderFallback);
    } finally {
      setLoading(false);
    }
  };

  // Handle Razorpay payment
  const handlePayment = (orderData) => {
    if (!window.Razorpay) {
      toast.error(t.razorpayNotLoaded);
      return;
    }

    const options = {
      key: orderData.key_id,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Course Selling App",
      description: `${t.purchaseDesc} ${cartItems.length} course(s)`,
      order_id: orderData.order_id,
      handler: async (response) => {
        await handlePaymentSuccess(response);
      },
      prefill: {
        name: user?.user?.name || "Guest",
        email: user?.user?.email || "",
      },
      notes: {
        courseIds: cartItems.map((c) => c._id).join(","),
      },
      theme: {
        color: "#f97316",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Verify payment with backend
  const handlePaymentSuccess = async (paymentData) => {
    try {
      setLoading(true);
      const courseIds = cartItems.map((c) => c._id);

      const response = await api.post(
        `/api/payment/verify-payment`,
        {
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
          courseIds: courseIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(t.paymentSuccess);
        clearCart();
        navigate("/purchases", { state: { justPurchased: true } });
      } else {
        toast.error(response.data.message || t.paymentVerifyFailed);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error(
        error.response?.data?.message || t.paymentVerifyError
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 bg-slate-800/60 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t.checkout}</h1>
          <p className="text-slate-300">Secure payment powered by Razorpay</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-5">{t.orderSummary}</h2>

            <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
              {cartItems.map((course) => (
                <div
                  key={course._id}
                  className="group flex items-center justify-between gap-4 bg-slate-800/70 border border-slate-600/40 rounded-xl p-4 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm md:text-base font-semibold text-slate-100 truncate group-hover:text-amber-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">1 item</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base md:text-lg font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                      ₹{course.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border border-slate-700/60 rounded-2xl p-6 sticky top-6 shadow-2xl shadow-orange-500/10">
              <h3 className="text-lg font-bold text-white mb-4">Payment Summary</h3>

              <div className="space-y-3 text-sm mb-5 pb-5 border-b border-slate-700">
                <div className="flex justify-between text-slate-300">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold">₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{t.tax}</span>
                  <span className="font-semibold">₹0</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xl font-bold mb-6 bg-gradient-to-r from-orange-500/20 to-yellow-500/10 p-3 rounded-xl border border-orange-500/30">
                <span className="text-white">{t.total}</span>
                <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">₹{getTotalPrice()}</span>
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={loading || cartItems.length === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:from-slate-600 disabled:to-slate-600 text-slate-900 font-bold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-500/40 hover:shadow-xl transform hover:-translate-y-1 disabled:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {loading ? t.processing : `💳 ${t.payRazorpay}`}
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold py-3 rounded-xl transition-all duration-200 border border-slate-600 hover:border-slate-500"
              >
                ← {t.backToCart}
              </button>

              <p className="text-xs text-slate-400 mt-4 text-center">
                Encrypted checkout • Instant course unlock
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCart;
