import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import api from "../services/api";
import { useLanguage } from "../context/LanguageContext";
function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const { language } = useLanguage();

  const text = {
    English: {
      courseUnavailable: "Course details are unavailable",
      courseNotFound: "Course not found",
      failedLoadCourse: "Failed to load course details",
      paymentError: "Error in making payment",
      paymentSuccess: "Payment Successful",
      loadingCourseDetails: "Loading course details...",
      purchases: "Purchases",
      orderDetails: "Order Details",
      totalPrice: "Total Price",
      courseName: "Course name",
      processPayment: "Process your Payment!",
      stripeNotConfigured: "Stripe payment is not configured.",
      stripeSetup: "To enable payments, add your Stripe publishable key to the frontend .env file:",
      backToCourses: "Back to Courses",
      creditCard: "Credit/Debit Card",
      processing: "Processing...",
      pay: "Pay",
      otherPaymentMethod: "Other Payments Method",
      na: "N/A",
    },
    Hindi: {
      courseUnavailable: "कोर्स विवरण उपलब्ध नहीं है",
      courseNotFound: "कोर्स नहीं मिला",
      failedLoadCourse: "कोर्स विवरण लोड करने में विफल",
      paymentError: "भुगतान करने में त्रुटि",
      paymentSuccess: "भुगतान सफल",
      loadingCourseDetails: "कोर्स विवरण लोड हो रहा है...",
      purchases: "खरीदारी",
      orderDetails: "ऑर्डर विवरण",
      totalPrice: "कुल कीमत",
      courseName: "कोर्स नाम",
      processPayment: "अपना भुगतान प्रोसेस करें!",
      stripeNotConfigured: "Stripe भुगतान कॉन्फ़िगर नहीं है।",
      stripeSetup: "भुगतान सक्षम करने के लिए, frontend .env फ़ाइल में Stripe publishable key जोड़ें:",
      backToCourses: "कोर्स पर वापस जाएं",
      creditCard: "क्रेडिट/डेबिट कार्ड",
      processing: "प्रोसेस हो रहा है...",
      pay: "भुगतान करें",
      otherPaymentMethod: "अन्य भुगतान तरीके",
      na: "उपलब्ध नहीं",
    },
    Kannada: {
      courseUnavailable: "ಕೋರ್ಸ್ ವಿವರಗಳು ಲಭ್ಯವಿಲ್ಲ",
      courseNotFound: "ಕೋರ್ಸ್ ಕಂಡುಬಂದಿಲ್ಲ",
      failedLoadCourse: "ಕೋರ್ಸ್ ವಿವರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ",
      paymentError: "ಪಾವತಿಯಲ್ಲಿ ದೋಷ",
      paymentSuccess: "ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ",
      loadingCourseDetails: "ಕೋರ್ಸ್ ವಿವರಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...",
      purchases: "ಖರೀದಿಗಳು",
      orderDetails: "ಆರ್ಡರ್ ವಿವರಗಳು",
      totalPrice: "ಒಟ್ಟು ಬೆಲೆ",
      courseName: "ಕೋರ್ಸ್ ಹೆಸರು",
      processPayment: "ನಿಮ್ಮ ಪಾವತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿ!",
      stripeNotConfigured: "Stripe ಪಾವತಿ ಸಂರಚಿಸಲಾಗಿಲ್ಲ.",
      stripeSetup: "ಪಾವತಿ ಸಕ್ರಿಯಗೊಳಿಸಲು frontend .env ಫೈಲ್‌ಗೆ Stripe publishable key ಸೇರಿಸಿ:",
      backToCourses: "ಕೋರ್ಸ್‌ಗಳಿಗೆ ಹಿಂದಿರುಗಿ",
      creditCard: "ಕ್ರೆಡಿಟ್/ಡೆಬಿಟ್ ಕಾರ್ಡ್",
      processing: "ಪ್ರಕ್ರಿಯೆ ನಡೆಯುತ್ತಿದೆ...",
      pay: "ಪಾವತಿಸಿ",
      otherPaymentMethod: "ಇತರೆ ಪಾವತಿ ವಿಧಾನಗಳು",
      na: "ಲಭ್ಯವಿಲ್ಲ",
    },
  };

  const t = text[language] || text.English;

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;  //using optional chaining to avoid crashing incase token is not there!!!

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBuyCourseData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/v1/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log(response.data);
        const fetchedCourse = response?.data?.course;
        if (!fetchedCourse) {
          setError(t.courseUnavailable);
          return;
        }
        setCourse(fetchedCourse);
        setClientSecret(response?.data?.clientSecret || "");
      } catch (error) {
        if (error?.response?.status === 404) {
          setError(t.courseNotFound);
        } else {
          const errorMsg = error?.response?.data?.errors || t.failedLoadCourse;
          setError(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBuyCourseData();
  }, [courseId, token, navigate]);

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Element not found");
      return;
    }

    setLoading(true);
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("Cardelement not found");
      setLoading(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("Stripe PaymentMethod Error: ", error);
      setLoading(false);
      setCardError(error.message);
    } else {
      console.log("[PaymentMethod Created]", paymentMethod);
    }
    if (!clientSecret) {
      console.log("No client secret found");
      setLoading(false);
      return;
    }
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.user?.firstName,
            email: user?.user?.email,
          },
        },
      });
    if (confirmError) {
      setCardError(confirmError.message);
      setLoading(false);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment succeeded: ", paymentIntent);
      const paymentInfo = {
        email: user?.user?.email,
        userId: user.user._id,
        courseId: courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      };
      console.log("Payment info: ", paymentInfo);
      await api
        .post(`/api/v1/user/order`, paymentInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          toast.error(t.paymentError);
        });
      toast.success(t.paymentSuccess);
      navigate("/purchases");
    }
    setLoading(false);
  };
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-semibold">{t.loadingCourseDetails}</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              {t.purchases}
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto px-4">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">{t.orderDetails}</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-sm">{t.totalPrice}</h2>
              <p className="text-red-500 font-bold">₹{course?.price ?? 0}</p>
            </div>
            <div className="flex items-center text-center space-x-2">
              <h1 className="text-gray-600 text-sm">{t.courseName}</h1>
              <p className="text-red-500 font-bold">{course?.title ?? t.na}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                {t.processPayment}
              </h2>
              {!stripe ? (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-sm mb-2">
                    ⚠️ {t.stripeNotConfigured}
                  </p>
                  <p className="text-gray-600 text-xs mb-3">
                    {t.stripeSetup}
                  </p>
                  <code className="text-xs bg-gray-100 p-2 block rounded">
                    VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
                  </code>
                  <Link
                    to="/courses"
                    className="mt-3 inline-block bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
                  >
                    {t.backToCourses}
                  </Link>
                </div>
              ) : (
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm mb-2"
                    htmlFor="card-number"
                  >
                    {t.creditCard}
                  </label>
                  <form onSubmit={handlePurchase}>
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#424770",
                            "::placeholder": {
                              color: "#aab7c4",
                            },
                          },
                          invalid: {
                            color: "#9e2146",
                          },
                        },
                      }}
                    />

                    <button
                      type="submit"
                      disabled={!stripe || loading}
                      className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200 disabled:bg-gray-400"
                    >
                      {loading ? t.processing : t.pay}
                    </button>
                  </form>
                  {cardError && (
                    <p className="text-red-500 font-semibold text-xs">
                      {cardError}
                    </p>
                  )}
                </div>
              )}

              {stripe && (
                <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                  <span className="mr-2">🅿️</span> {t.otherPaymentMethod}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Buy;
