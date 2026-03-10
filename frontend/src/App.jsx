import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import ForgotPassword from './components/ForgotPassword'
import Courses from './components/Courses'
import Buy from './components/Buy'
import Purchases from './components/Purchases'
import Settings from './components/Settings'
import AdminLogin from './admin/AdminLogin'
import AdminSignup from './admin/AdminSignup'
import AdminDashboard from './admin/Dashboard'
import UpdateCourse from './admin/UpdateCourse'
import CourseCreate from './admin/CourseCreate'
import OurCourses from './admin/OurCourses'
import CourseMaterials from './admin/CourseMaterials'
import AdminCertificates from './admin/AdminCertificates'
import AdminFeedback from './admin/AdminFeedback'
import CourseQuiz from './components/CourseQuiz'
import CoursePlan from './components/CoursePlan'
import Certificate from './components/Certificate'
import MyCertificates from './components/MyCertificates'
import Cart from './components/Cart'
import CheckoutCart from './components/CheckoutCart'
import { CartProvider } from './context/CartContext'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe only if key is provided (optional for development)
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey && stripeKey !== 'pk_test_placeholder' ? loadStripe(stripeKey) : null;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Something went wrong</h1>
          <p style={{ marginBottom: '10px' }}>Error: {this.state.error?.message}</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
            <summary>Error Details</summary>
            {this.state.error?.stack}
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return  (
  <ErrorBoundary>
    <div>
      <CartProvider>
      <div>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/courses" element={<Courses />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <Elements stripe={stripePromise}>
              <CheckoutCart />
            </Elements>
          } />
        <Route path="/buy/:courseId" element={
          <Elements stripe={stripePromise}>
            <Buy />
          </Elements>
        } />
        <Route path="/quiz/:courseId" element={<CourseQuiz />} />
        <Route path="/course-plan/:courseId" element={<CoursePlan />} />
        <Route path="/certificate/:courseId" element={<Certificate />} />
        <Route path="/my-certificates" element={<MyCertificates />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/brochure" element={<Navigate to="/brochure.html" replace />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-course" element={<CourseCreate />} />
        <Route path="/admin/our-courses" element={<OurCourses />} />
        <Route path="/admin/course-materials" element={<CourseMaterials />} />
        <Route path="/admin/certificates" element={<AdminCertificates />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
        <Route path="/admin/update-course/:courseId" element={<UpdateCourse />} />
      </Routes>
      </div>
    </CartProvider>
    </div>
  </ErrorBoundary>
  );
}

export default App;
