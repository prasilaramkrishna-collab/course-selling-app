# 📧 Certificate Email Feature - Quick Setup

## ✅ What's Already Done

### Backend
- ✅ Email sending function added to `certificate.controller.js`
- ✅ Email route configured in `certificate.route.js`
- ✅ Nodemailer integration ready

### Frontend  
- ✅ "Send to Email" button added to Certificate page
- ✅ PDF generation function with html2pdf.js
- ✅ Email sending logic implemented
- ✅ Full localization (English, Hindi, Kannada)
- ✅ Loading states and error handling

---

## 🚀 Installation Checklist

### Step 1: Install Frontend Dependencies

```bash
cd frontend
npm install html2pdf.js
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install nodemailer
```

### Step 3: Configure Environment Variables

Create or update `.env` in the **backend** folder:

```env
# Email Configuration (Choose one):

# Option 1: Gmail (Recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Option 2: Outlook/Hotmail
# EMAIL_SERVICE=outlook
# EMAIL_USER=your-email@outlook.com
# EMAIL_PASSWORD=your-password

# Option 3: Custom SMTP
# EMAIL_SERVICE=custom
# EMAIL_HOST=smtp.example.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@example.com
# EMAIL_PASSWORD=your-password
```

### Step 4: Generate Gmail App Password (If Using Gmail)

1. Go to https://myaccount.google.com/
2. Click "Security" in left menu
3. Enable "2-Step Verification" if not already enabled
4. Go to https://myaccount.google.com/apppasswords
5. Select "Mail" and "Windows Computer"
6. Copy the 16-character password
7. Paste it as `EMAIL_PASSWORD` in your `.env`

### Step 5: Restart Backend Server

```bash
cd backend
npm run dev
```

---

## 🧪 Testing

1. Create a test user account
2. Purchase and complete a course (score ≥70%)
3. View the certificate
4. Click **"📧 Send to Email"** button
5. Check your email inbox (or spam folder)

---

## 📋 Features Included

### User-Friendly
- ✅ One-click email sending
- ✅ Loading state while sending
- ✅ Success/error notifications
- ✅ Professional HTML email template
- ✅ PDF certificate attachment

### Multi-Language Support
- ✅ English
- ✅ Hindi (हिंदी)
- ✅ Kannada (ಕನ್ನಡ)

### Email Content
- Personalized greeting
- Certificate number
- Course name
- Achievement percentage
- Completion date
- Valid until date
- PDF attachment with certificate

---

## 🎯 How Users Use It

1. **View Certificate** → Users go to their certificate page
2. **Click "Send to Email"** → Button appears in action buttons
3. **PDF Generated** → Frontend converts certificate to PDF
4. **Email Sent** → Backend sends email with PDF attachment
5. **User Receives Email** → Contains professional formatted email + PDF

---

## 🔧 Troubleshooting

### "Failed to send certificate"
- Check `.env` configuration
- Verify email credentials
- Check backend logs for details

### "html2pdf.js not installed"
- Run: `npm install html2pdf.js` in frontend folder

### Users not receiving email
- Check spam/junk folder
- Verify email is not blocked
- Check backend console for errors
- Test email configuration separately

### Gmail not accepting password
- Ensure you're using **App Password**, not regular password
- 2-Step Verification must be enabled

---

## 📂 Modified Files

```
frontend/
  └─ src/components/Certificate.jsx
     ├─ Added: sendCertificateEmail() function
     ├─ Added: Email localization strings
     ├─ Added: "Send to Email" button
     └─ Added: sendingEmail state

backend/
  ├─ controllers/certificate.controller.js
  │  ├─ Added: sendCertificateEmail() endpoint
  │  ├─ Added: Email template
  │  └─ Added: Nodemailer configuration
  └─ routes/certificate.route.js
     └─ Added: POST /email/:courseId route
```

---

## 📊 Email Flow Diagram

```
User clicks "Send to Email"
        ↓
Frontend generates PDF from certificate HTML
        ↓
Converts PDF to base64
        ↓
Sends POST request to backend with PDF data
        ↓
Backend receives base64 PDF
        ↓
Fetches user email from database
        ↓
Converts base64 back to PDF buffer
        ↓
Creates professional HTML email
        ↓
Sends email with PDF attachment via SMTP
        ↓
User receives email in inbox
```

---

## 🎓 Certificate Email Template

Users receive an email with:
- **Header**: Certificate Received acknowledgment
- **Body**: Congratulations message with certificate details
- **Details Box**: 
  - Certificate Number
  - Course name
  - Achievement percentage
  - Completion date
  - Valid until date
- **Footer**: Support contact information
- **Attachment**: PDF certificate file

---

## 🔐 Security Notes

- Email credentials stored in `.env` (not version controlled)
- Only authenticated users can send certificates
- PDF data transmitted securely over HTTPS
- Base64 encoding ensures safe data transmission

---

## 📱 Multi-Language Support

### English
- "Send to Email"
- "Sending email..."
- "Certificate sent successfully to your email!"
- "Failed to send certificate via email"

### Hindi
- "ईमेल पर भेजें"
- "ईमेल भेजा जा रहा है..."
- "सर्टिफिकेट सफलतापूर्वक आपके ईमेल पर भेज दिया गया!"
- "सर्टिफिकेट ईमेल के माध्यम से भेजने में विफल"

### Kannada
- "ಇಮೇಲ್‌ಗೆ ಕಳುಹಿಸಿ"
- "ಇಮೇಲ್ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ..."
- "ಪ್ರಮಾಣಪತ್ರ ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!"
- "ಪ್ರಮಾಣಪತ್ರವನ್ನು ಇಮೇಲ್ ಮೂಲಕ ಕಳುಹಿಸಲು ವಿಫಲವಾಗಿದೆ"

---

## ✨ Next Steps

1. **Install dependencies** (html2pdf.js, nodemailer)
2. **Configure .env** (email settings)
3. **Restart backend**
4. **Test the feature**

---

**Status**: ✅ Ready to Deploy  
**Setup Time**: ~10 minutes  
**Difficulty**: Easy
