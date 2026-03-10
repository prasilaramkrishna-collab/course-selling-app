import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Purchase } from '../models/purchase.model.js';
import { User } from '../models/user.model.js';
import { Course } from '../models/course.model.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Razorpay instance
// Lazy initialize Razorpay instance
let razorpay = null;

const initRazorpay = () => {
  if (!razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not configured. Check .env file.');
    }
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const razorpayInstance = initRazorpay();
    const { amount, courseIds } = req.body;
    const userId = req.userId;
    const normalizedCourseIds = Array.isArray(courseIds)
      ? courseIds.filter(Boolean).map((id) => String(id))
      : [];

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount' 
      });
    }

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }

    if (normalizedCourseIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No courses selected' 
      });
    }

    // Convert to paise (1 rupee = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);
    if (!Number.isInteger(amountInPaise) || amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a valid positive number',
      });
    }

    const shortUserId = String(userId).slice(-8);
    const shortTs = String(Date.now()).slice(-8);

    // Create Razorpay order
    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${shortUserId}_${shortTs}`,
      notes: {
        userId: userId,
        itemCount: String(normalizedCourseIds.length),
      },
    };

    const order = await razorpayInstance.orders.create(orderOptions);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', {
      message: error?.message,
      description: error?.error?.description,
      code: error?.error?.code,
    });
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error?.error?.description || error.message,
    });
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseIds,
    } = req.body;
    const userId = req.userId;
    const normalizedCourseIds = Array.isArray(courseIds)
      ? courseIds.filter(Boolean).map((id) => String(id))
      : [];

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details',
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (normalizedCourseIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No purchased courses found for verification',
      });
    }

    const validCourses = await Course.find({ _id: { $in: normalizedCourseIds } }).select('_id');
    if (validCourses.length !== normalizedCourseIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more courses are invalid',
      });
    }

    // Verify signature using HMAC SHA256
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - Invalid signature',
      });
    }

    // Signature is valid - Create purchase records for each course
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create purchase records
    const purchases = [];
    for (const courseId of normalizedCourseIds) {
      // Check if user already owns the course
      const existingPurchase = await Purchase.findOne({
        userId: userId,
        courseId: courseId,
      });

      if (!existingPurchase) {
        const purchase = new Purchase({
          userId: userId,
          courseId: courseId,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          paymentStatus: 'completed',
          purchaseDate: new Date(),
        });

        await purchase.save();
        purchases.push(purchase);

        // Add course to user's purchasedCourses array if using that field
        if (!user.purchasedCourses) {
          user.purchasedCourses = [];
        }
        const alreadyInUserCourses = user.purchasedCourses.some(
          (id) => String(id) === String(courseId)
        );
        if (!alreadyInUserCourses) {
          user.purchasedCourses.push(courseId);
        }
      }
    }

    // Save user with updated purchases
    await user.save();

    const unlockedCourses = await Course.find({ _id: { $in: normalizedCourseIds } }).lean();
    
    // Ensure materials is always an array
    const enrichedUnlockedCourses = unlockedCourses.map(course => ({
      ...course,
      materials: Array.isArray(course.materials) ? course.materials : []
    }));

    return res.status(200).json({
      success: true,
      message: 'Payment verified and courses purchased successfully',
      purchases: purchases,
      unlockedCourses: enrichedUnlockedCourses,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message,
    });
  }
};

// GET PAYMENT STATUS
export const getPaymentStatus = async (req, res) => {
  try {
    const razorpayInstance = initRazorpay();
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required',
      });
    }

    // Fetch order details from Razorpay
    const order = await razorpayInstance.orders.fetch(orderId);

    return res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment status',
      error: error.message,
    });
  }
};
