# Razorpay Integration - Quick Testing Guide

## What Was Integrated

### Backend Changes:
1. **New Controller**: `backend/controllers/payment.controller.js`
   - `createOrder()` - Creates Razorpay order
   - `verifyPayment()` - Verifies payment signature
   - `getPaymentStatus()` - Fetches order status

2. **New Routes**: `backend/routes/payment.route.js`
   - POST `/api/payment/create-order`
   - POST `/api/payment/verify-payment`
   - GET `/api/payment/status/:orderId`

3. **Updated Models**:
   - `user.model.js` - Added `purchasedCourses` array
   - `purchase.model.js` - Added `paymentId`, `orderId`, `paymentStatus`, `purchaseDate`

4. **Updated Server**: `backend/index.js`
   - Added payment route import and middleware

### Frontend Changes:
1. **Updated Component**: `frontend/src/components/CheckoutCart.jsx`
   - Complete rewrite for Razorpay integration
   - Dynamically loads Razorpay script
   - Handles payment flow and verification

---

## Step-by-Step Testing

### Prerequisites
1. Backend running: `npm run dev` (port 4001)
2. Frontend running: `npm run dev` (port 5174)
3. MongoDB connected
4. User logged in

### Test Flow

#### 1. Navigate to Courses
- Go to http://localhost:5174/courses
- Browse available courses

#### 2. Add to Cart
- Click "Add to Cart" on any courses
- Add multiple courses (optional)

#### 3. Open Cart
- Click "🛒 Cart" in sidebar or top menu
- Review items and prices
- Click "Proceed to Checkout"

#### 4. Checkout
- Should navigate to `/checkout`
- See "Checkout" page with:
  - Course list
  - Subtotal
  - Total amount
  - "Pay with Razorpay" button

#### 5. Initiate Payment
- Click "Pay with Razorpay" button
- Backend creates order
- Razorpay modal opens

#### 6. Test Payment
Use this test card (Razorpay Provided):
```
Card Number:  4111 1111 1111 1111
Expiry:       12/25 (or any future date)
CVV:          123 (any 3 digits)
Name:         Any name
Email:        Pre-filled
Phone:        9999999999 (any 10 digits)
OTP:          Any 6 digits
```

**For Failed Payment Test:**
```
Card Number:  4000 0000 0000 0002
(Use same expiry, CVV, name)
```

#### 7. Complete Payment
- Follow Razorpay flow
- Modal will show payment confirmation
- Wait for success callback

#### 8. Verify Success
- Should see: "Payment successful! Courses unlocked."
- Automatically redirected to `/purchases`
- Courses should appear in Purchases page
- Cart should be cleared

---

## Expected Behavior

### Successful Payment Flow
```
User clicks "Pay with Razorpay"
    ↓
Backend creates order via /api/payment/create-order
    ↓
Razorpay modal opens with order details
    ↓
User enters test card details
    ↓
Razorpay processes payment
    ↓
Payment success callback triggered
    ↓
Frontend calls /api/payment/verify-payment
    ↓
Backend verifies signature
    ↓
Purchase records created
    ↓
Courses added to user's purchasedCourses
    ↓
Toast: "Payment successful! Courses unlocked."
    ↓
Redirect to /purchases
```

### What Gets Created in DB After Payment:
1. **Purchase Record**:
   - userId: Current user
   - courseId: Each purchased course
   - paymentId: Razorpay payment ID
   - orderId: Razorpay order ID
   - paymentStatus: "completed"
   - purchaseDate: Current date

2. **User Update**:
   - purchasedCourses array updated with new course IDs

---

## API Request/Response Examples

### 1. Create Order
**Request:**
```bash
curl -X POST http://localhost:4001/api/payment/create-order \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "courseIds": ["course_id_1", "course_id_2"]
  }'
```

**Response:**
```json
{
  "success": true,
  "order_id": "order_1234567890",
  "amount": 500000,
  "currency": "INR",
  "key_id": "rzp_test_SMkgOwUcx5d9Re"
}
```

### 2. Verify Payment
**Request:**
```bash
curl -X POST http://localhost:4001/api/payment/verify-payment \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_1234567890",
    "razorpay_payment_id": "pay_1234567890",
    "razorpay_signature": "signature_hash",
    "courseIds": ["course_id_1", "course_id_2"]
  }'
```

**Success Response:**
```json
{
  "success": true,
  "message": "Payment verified and courses purchased successfully",
  "purchases": [
    {
      "_id": "purchase_id_1",
      "userId": "user_id",
      "courseId": "course_id_1",
      "paymentId": "pay_1234567890",
      "orderId": "order_1234567890",
      "paymentStatus": "completed",
      "purchaseDate": "2026-03-03T10:30:00.000Z"
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Payment verification failed - Invalid signature"
}
```

---

## Debugging Tips

### Browser Console
Check F12 console for:
- `createOrder` API call status
- Razorpay script load status
- `verifyPayment` API response
- Any JavaScript errors

### Network Tab
Check network requests:
- `POST /api/payment/create-order` (should be 200)
- `POST /api/payment/verify-payment` (should be 200)
- Razorpay CDN script loads

### Backend Console
Look for:
- "Error creating Razorpay order"
- "Error verifying payment"
- Signature verification logs

### Database
Verify Purchase records:
```javascript
// In MongoDB
db.purchases.find({ userId: ObjectId("...") })
```

Should show:
- Multiple Purchase records (one per course)
- Correct paymentId and orderId
- paymentStatus: "completed"

---

## Common Issues & Solutions

### Issue: "Razorpay script not loaded"
- **Solution**: Refresh page and try again
- **Check**: Network tab → verify script CDN loads
- **Root Cause**: Network issue or CDN blocked

### Issue: "Payment verification failed - Invalid signature"
- **Solution**: Try payment again
- **Check**: Backend console for signature logs
- **Root Cause**: Signature mismatch (security check failed)

### Issue: Courses not appearing in Purchases
- **Solution**: Login again, refresh page
- **Check**: Database has Purchase records
- **Root Cause**: User session issue or DB save failed

### Issue: Payment shows success but no courses added
- **Solution**: Check browser console for API errors
- **Check**: Backend logs for verification errors
- **Root Cause**: Verification failed silently

### Issue: Shows in cart but not in Purchases
- **Solution**: Complete full payment flow
- **Check**: Network tab → verify-payment response
- **Root Cause**: Payment wasn't verified

---

## Razorpay Dashboard Checks

1. Visit: https://dashboard.razorpay.com/
2. Ensure **TEST MODE** is on (toggle in top right)
3. Check test payments:
   - Payments → Test mode
   - Should show your test transactions
   - Status should be "Captured"

---

## Production Checklist

Before switching to live mode:
- [ ] Test complete flow multiple times
- [ ] Verify all error messages are clear
- [ ] Check database for correct records
- [ ] Get live API keys from Razorpay
- [ ] Update `.env` with live keys
- [ ] Test with small amounts first
- [ ] Set up proper logging
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Document payment process for users
- [ ] Set up refund policy

---

## Quick Reference

| Key | Value |
|-----|-------|
| Test Key ID | rzp_test_SMkgOwUcx5d9Re |
| Test Key Secret | zrmABRXeG20ONtbmmY8v4zmF |
| Test Card | 4111 1111 1111 1111 |
| Razorpay CDN | https://checkout.razorpay.com/v1/checkout.js |
| Backend Port | 4001 |
| Frontend Port | 5174 |
| Create Order Route | POST /api/payment/create-order |
| Verify Payment Route | POST /api/payment/verify-payment |
| Amount Format | Rupees (₹) → converted to Paise in backend |

---

## Support Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Test Cards](https://razorpay.com/docs/payments/payments/test-cards/)
- [Payment Verification](https://razorpay.com/docs/payments/payments/verify-payment/)
- [API Reference](https://razorpay.com/api/javascript/)
