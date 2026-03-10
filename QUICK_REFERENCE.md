# Quick Reference Card - Razorpay Integration

## 🟢 Server Status
- ✅ Backend running on port **4001**
- ✅ Start frontend: `npm run dev` (in frontend folder)

---

## 🧪 Testing Credentials

### Test Card
```
4111 1111 1111 1111
Expiry: 12/25
CVV: 123
```

### Test Phone & OTP
- Phone: `9999999999` (any 10 digits)
- OTP: Any 6 digits

### Failed Payment Test
```
4000 0000 0000 0002
```

---

## 🛒 Complete Payment Flow

1. **Login** → Account page with profile
2. **Browse Courses** → /courses
3. **Add to Cart** → Add multiple courses
4. **View Cart** → /cart
5. **Checkout** → /checkout
6. **Pay with Razorpay** → Opens modal
7. **Enter Test Card** → 4111 1111 1111 1111
8. **Complete OTP** → Any 6 digits
9. **Payment Success** → Redirects to /purchases
10. **Verify Courses** → Should see purchased courses

---

## 🔑 Important URLs

| Page | URL | Notes |
|------|-----|-------|
| Courses | http://localhost:5174/courses | Add to cart here |
| Cart | http://localhost:5174/cart | Review items, Checkout |
| Checkout | http://localhost:5174/checkout | Razorpay payment |
| Purchases | http://localhost:5174/purchases | View owned courses |
| Backend | http://localhost:4001 | Server running |

---

## 📍 API Endpoints

```bash
# Create Order
POST /api/payment/create-order
Header: Authorization: Bearer {user_token}
Body: { "amount": 5000, "courseIds": ["id1", "id2"] }

# Verify Payment
POST /api/payment/verify-payment
Header: Authorization: Bearer {user_token}
Body: { 
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "sig_xxx",
  "courseIds": ["id1", "id2"]
}

# Check Status
GET /api/payment/status/{orderId}
Header: Authorization: Bearer {user_token}
```

---

## 🎯 What to Test

- [ ] Add courses to cart
- [ ] View cart with prices
- [ ] Proceed to checkout
- [ ] See order summary
- [ ] Click "Pay with Razorpay"
- [ ] Enter test card details
- [ ] See success message
- [ ] Courses appear in My Purchases
- [ ] Cart is cleared
- [ ] Can view course content (if enabled)

---

## ⚡ Payment Flow Summary

```
Frontend creates order 
    ↓
Get order_id from backend
    ↓
Open Razorpay modal with order details
    ↓
User pays with test card
    ↓
Razorpay returns payment details
    ↓
Frontend verifies payment with backend
    ↓
Backend creates Purchase records
    ↓
User navigated to My Purchases
    ↓
Courses unlocked for learning
```

---

## 🔍 Debugging Tips

### Browser Console (F12)
- Check for JavaScript errors
- Look for network errors
- See Razorpay modal load status

### Network Tab (F12 → Network)
- `POST /api/payment/create-order` → Should be **200 OK**
- `POST /api/payment/verify-payment` → Should be **200 OK**
- Razorpay script loads from CDN

### Backend Console
- "Server is running on port 4001" → Good
- No error messages → Good
- Check for payment logs

### Database Verification
```javascript
// Check Purchase records
db.purchases.find({ userId: ObjectId("...") })
// Should show: paymentId, orderId, paymentStatus: "completed"

// Check User update
db.users.find({ _id: ObjectId("...") })
// Should show: purchasedCourses: [course_ids...]
```

---

## 📋 Razorpay Keys

```
Test Key ID:     rzp_test_SMkgOwUcx5d9Re
Test Key Secret: zrmABRXeG20ONtbmmY8v4zmF
Status:          ✅ TEST MODE
Currency:        ₹ INR
```

**IMPORTANT**: Never share the Key Secret!

---

## ✅ Checklist Before Testing

- [ ] Backend running (`npm run dev` in backend folder)
- [ ] Frontend ready (can start with `npm run dev` in frontend folder)
- [ ] MongoDB connected
- [ ] User logged in before checkout
- [ ] Cart has at least 1 course
- [ ] Internet connection (for Razorpay CDN)
- [ ] Browser allows popups/modals

---

## 🚨 Common Issues & Quick Fixes

| Issue | Check | Fix |
|-------|-------|-----|
| Modal won't open | Network tab → Razorpay script | Refresh page |
| Payment fails | Backend console | Check env vars |
| Courses don't appear | Browser console | Try again, refresh |
| Can't proceed to checkout | Are you logged in? | Login first |
| Total is wrong | Cart items | Check prices in database |

---

## 🎓 Learning Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Test Card Details](https://razorpay.com/docs/payments/payments/test-cards/)
- [Payment Flow](https://razorpay.com/docs/payments/payments/)
- [API Reference](https://razorpay.com/api/javascript/)

---

## 📞 Backend API Status

**Type**: RESTful API
**Port**: 4001
**Auth**: JWT Bearer Token
**Environment**: TEST MODE (Razorpay)
**Database**: MongoDB

---

## 🎉 Success Indicators

✅ All these should happen:

1. Razorpay modal opens after clicking "Pay with Razorpay"
2. Modal shows correct order amount
3. Test card payment processes
4. Success toast appears: "Payment successful! Courses unlocked."
5. Automatic redirect to /purchases
6. Newly purchased courses visible in list
7. Can access course materials

---

## 🔄 Testing Workflow

```
LOGIN
  ↓
BROWSE COURSES (/courses)
  ↓
ADD 2-3 COURSES TO CART
  ↓
OPEN CART (/cart)
  ↓
CLICK "PROCEED TO CHECKOUT"
  ↓
REVIEW ORDER (/checkout)
  ↓
CLICK "PAY WITH RAZORPAY"
  ↓
ENTER CARD: 4111 1111 1111 1111
  ↓
ENTER OTP: ANY 6 DIGITS
  ↓
SUCCESS! ✅
  ↓
VERIFY IN MY PURCHASES
```

---

## 💡 Pro Tips

1. **Test multiple times** with different amounts
2. **Try the fail case** card (4000...) to test errors
3. **Check database** after payments to see Purchase records
4. **Monitor network tab** to understand the flow
5. **Review backend logs** to see what's happening

---

## 📊 What Gets Created

### Purchase Record (per course)
```
{
  userId: "logged_in_user_id",
  courseId: "course_id",
  paymentId: "pay_1234567890",
  orderId: "order_1234567890",
  paymentStatus: "completed",
  purchaseDate: "2026-03-03T10:30:00Z"
}
```

### User Gets Updated
```
purchasedCourses: ["course_id_1", "course_id_2"]
```

---

**Everything is ready to go! Start the frontend and test the payment flow.** 🚀
