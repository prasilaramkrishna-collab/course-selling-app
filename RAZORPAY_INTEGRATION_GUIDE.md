# Razorpay Payment Integration Guide

## Overview
This guide covers the complete implementation of Razorpay payment gateway in TEST MODE for the course-selling-app.

## Environment Variables (Already Set Up)
```env
RAZORPAY_KEY_ID=rzp_test_SMkgOwUcx5d9Re
RAZORPAY_KEY_SECRET=zrmABRXeG20ONtbmmY8v4zmF
```

---

## Backend Setup

### 1. Payment Controller
**File:** `backend/controllers/payment.controller.js`

This controller handles:
- **createOrder**: Creates a Razorpay order with amount in paise
- **verifyPayment**: Verifies payment signature using HMAC SHA256
- **getPaymentStatus**: Fetches payment status from Razorpay

Key features:
- Converts amount to paise automatically (₹1 = 100 paise)
- Creates purchase records after payment verification
- Adds courses to user's purchasedCourses array

### 2. Payment Routes
**File:** `backend/routes/payment.route.js`

Routes:
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify-payment` - Verify payment signature
- `GET /api/payment/status/:orderId` - Get payment status

All routes are protected with `userMiddleware` to ensure user authentication.

### 3. Backend Setup Steps
```bash
# Navigate to backend directory
cd backend

# Install razorpay (already installed)
npm install razorpay

# Make sure your .env has Razorpay credentials
echo "RAZORPAY_KEY_ID=rzp_test_SMkgOwUcx5d9Re" >> .env
echo "RAZORPAY_KEY_SECRET=zrmABRXeG20ONtbmmY8v4zmF" >> .env

# Start backend server
npm run dev
```

---

## Frontend Setup

### 1. Checkout Component
**File:** `frontend/src/components/CheckoutCart.jsx`

This component handles:
- Loading Razorpay script dynamically
- Creating orders through backend API
- Opening Razorpay payment modal
- Verifying payment signature
- Navigating to purchases page on success

Features:
- Pre-filled with user's name and email
- Shows order summary with course details
- Error handling with toast notifications
- Loading states during payment processing

### 2. Razorpay Script Integration
The component automatically loads the Razorpay checkout script:
```javascript
https://checkout.razorpay.com/v1/checkout.js
```

### 3. Checkout Flow from Cart
The Cart.jsx component has a "Proceed to Checkout" button that:
1. Checks if user is logged in
2. Validates cart is not empty
3. Navigates to `/checkout` page

---

## API Flow Diagram

```
Frontend (Cart)
    ↓
[Click "Proceed to Checkout"]
    ↓
Frontend (CheckoutCart)
    ↓
[Click "Pay with Razorpay"]
    ↓
CREATE ORDER REQUEST
POST /api/payment/create-order
{
  amount: 5000,          // Total price in rupees
  courseIds: ["id1", "id2"]
}
    ↓
Backend creates Razorpay order
    ↓
RESPONSE:
{
  success: true,
  order_id: "order_xxxxx",
  amount: 500000,        // In paise
  currency: "INR",
  key_id: "rzp_test_xxxx"
}
    ↓
[Razorpay Modal Opens]
User enters payment details
    ↓
[Payment Success]
    ↓
VERIFY PAYMENT REQUEST
POST /api/payment/verify-payment
{
  razorpay_order_id: "order_xxxxx",
  razorpay_payment_id: "pay_xxxxx",
  razorpay_signature: "xxxx",
  courseIds: ["id1", "id2"]
}
    ↓
Backend verifies signature using HMAC SHA256
    ↓
Creates purchase records
Adds courses to user's purchasedCourses
    ↓
RESPONSE:
{
  success: true,
  message: "Payment verified and courses purchased successfully",
  purchases: [...]
}
    ↓
Frontend shows success toast
Clears cart
Navigates to /purchases
```

---

## Testing with Test Mode

### Test Cards (Razorpay Provided)
Use these test card details in TEST MODE:

**Success Cases:**
- Card: `4111111111111111`
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)
- Name: Any name

**Failed Payment:**
- Card: `4000000000000002`
- Expiry: Any future date
- CVV: Any 3 digits

### Test Phone Number
Any 10-digit number (e.g., `9999999999`)

### Test OTP
Enter any 6-digit OTP when prompted

### Testing Steps
1. Add courses to cart
2. Click "Proceed to Checkout"
3. Review order summary
4. Click "Pay with Razorpay"
5. Razorpay modal opens
6. Enter test card details
7. Complete payment flow
8. Verify success message appears
9. Check that courses appear in Purchases page

---

## Database Schema

### Purchase Model
When payment is verified, a Purchase record is created:

```javascript
{
  userId: ObjectId,
  courseId: ObjectId,
  paymentId: "pay_xxxxx",      // Razorpay payment ID
  orderId: "order_xxxxx",        // Razorpay order ID
  paymentStatus: "completed",
  purchaseDate: Date
}
```

### User Model Update
User's `purchasedCourses` array is updated with the course ID after successful payment.

---

## Error Handling

### Common Errors and Solutions

**1. "Razorpay script not loaded"**
- Solution: Refresh the page and try again
- Cause: Razorpay CDN script failed to load

**2. "Payment verification failed - Invalid signature"**
- Cause: Signature mismatch (tampering detected)
- The order is created but payment is not verified

**3. "User not authenticated"**
- Solution: Login and try again
- Cause: User token missing or expired

**4. "No courses selected"**
- Solution: Add courses to cart first
- Cause: Empty courseIds array

### Debugging
Check browser console for detailed error logs:
```javascript
console.error() calls provide specific error details
```

Backend logs will show:
- Order creation attempts
- Signature verification status
- Purchase record creation

---

## Important Notes

### Security
1. **Never expose RAZORPAY_KEY_SECRET in frontend**
   - All signature verification happens on backend
   - Frontend only sends payment data for verification

2. **Signature Verification**
   ```javascript
   hmac = crypto.createHmac('sha256', KEY_SECRET)
   hmac.update(`${order_id}|${payment_id}`)
   signature = hmac.digest('hex')
   ```

3. **User Middleware Protection**
   - All payment routes require valid user authentication
   - Prevents unauthorized API access

### Razorpay Test Mode Limits
- No actual money is charged
- Test payments appear in Razorpay dashboard under "Test" mode
- Switch to LIVE mode by using live API keys and updating `.env`

### Amount Handling
- Frontend sends amount in rupees (e.g., 5000)
- Backend converts to paise (5000 * 100 = 500000)
- Razorpay works with paise internally
- Always verify amounts before processing

---

## Switching to Live Mode

When ready for production:

1. Get live API keys from Razorpay dashboard
2. Update `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx
   ```
3. Set `NODE_ENV=production` in `.env`
4. Restart backend server
5. Test with real payment cards

---

## File Structure
```
backend/
├── controllers/
│   └── payment.controller.js      (NEW)
├── routes/
│   └── payment.route.js           (NEW)
├── index.js                       (UPDATED - added payment route)
└── .env                           (ALREADY HAS KEYS)

frontend/
└── src/components/
    └── CheckoutCart.jsx           (UPDATED - uses Razorpay)
```

---

## API Endpoints Summary

### POST /api/payment/create-order
**Headers:** Authorization: Bearer {token}
**Body:**
```json
{
  "amount": 5000,
  "courseIds": ["course_id_1", "course_id_2"]
}
```
**Response:**
```json
{
  "success": true,
  "order_id": "order_xxxxx",
  "amount": 500000,
  "currency": "INR",
  "key_id": "rzp_test_xxxxx"
}
```

### POST /api/payment/verify-payment
**Headers:** Authorization: Bearer {token}
**Body:**
```json
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "xxxxx",
  "courseIds": ["course_id_1", "course_id_2"]
}
```
**Response:**
```json
{
  "success": true,
  "message": "Payment verified and courses purchased successfully",
  "purchases": [...]
}
```

### GET /api/payment/status/:orderId
**Headers:** Authorization: Bearer {token}
**Response:**
```json
{
  "success": true,
  "order": { /* Razorpay order object */ }
}
```

---

## Troubleshooting Checklist

- [ ] Razorpay keys are correct in `.env`
- [ ] Backend server is running on port 4001
- [ ] Frontend is running on port 5174
- [ ] User is logged in before checkout
- [ ] Cart has courses before checkout
- [ ] Network request to `/api/payment/create-order` succeeds
- [ ] Razorpay modal opens after order creation
- [ ] Test payment card is valid (4111111111111111)
- [ ] Browser console shows no errors
- [ ] Network tab shows successful payment verification

---

## References
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-cards/)
- [Razorpay Security](https://razorpay.com/docs/security/)
- [HMAC Verification](https://razorpay.com/docs/payments/payments/verify-payment/)
