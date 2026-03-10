# Certificate Email Feature Setup Guide

This guide explains how to set up the certificate email functionality for your course-selling app.

## Overview

The certificate email feature allows users to send their certificate PDF directly to their registered email address. This includes:

- **Frontend**: PDF generation from the certificate view using html2pdf.js
- **Backend**: Email sending using Nodemailer with Gmail or other SMTP services

---

## Installation Steps

### 1. Frontend - Install html2pdf.js

The frontend uses `html2pdf.js` to generate PDF from the certificate HTML. It's imported dynamically, so install it first:

```bash
cd frontend
npm install html2pdf.js
```

### 2. Backend - Install Nodemailer

The backend uses `nodemailer` to send emails. Install it in the backend:

```bash
cd backend
npm install nodemailer
```

---

## Environment Configuration

### Backend (.env file)

Add the following environment variables to your backend `.env` file:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### How to Get Gmail App Password

If using Gmail:

1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer" (or your device)
4. Google will generate a 16-character password
5. Use this 16-character password as `EMAIL_PASSWORD` in your .env

**Note**: Using a regular Gmail password won't work if 2FA is enabled. You must use an app-specific password.

### Alternative Email Services

If not using Gmail, update the `EMAIL_SERVICE` in your `.env`:

```env
# For Outlook/Hotmail:
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password

# For Yahoo:
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-password

# For Custom SMTP Server:
EMAIL_SERVICE=custom
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

---

## Features Implemented

### Backend Changes

**File**: `backend/controllers/certificate.controller.js`

- Added `sendCertificateEmail` function that:
  - Takes a course ID and PDF data from the frontend
  - Fetches user and certificate information
  - Converts base64 PDF to a buffer
  - Sends email with certificate PDF attachment
  - Includes formatted HTML email template

**File**: `backend/routes/certificate.route.js`

- Added new POST route: `/api/certificate/email/:courseId`
- Protected with user middleware for authentication

### Frontend Changes

**File**: `frontend/src/components/Certificate.jsx`

- Added "Send to Email" button in the action buttons section
- Implemented `sendCertificateEmail` function that:
  - Generates PDF from the certificate HTML view
  - Converts PDF to base64
  - Sends request to backend endpoint
  - Shows loading state while sending
  - Displays success/error toast messages
- Added localization strings for English, Hindi, and Kannada:
  - `sendEmail`: "Send to Email"
  - `sendingEmail`: "Sending email..."
  - `emailSent`: "Certificate sent successfully to your email!"
  - `emailError`: "Failed to send certificate via email"

---

## How It Works

### Step-by-Step Flow

1. **User clicks "Send to Email" button** on the Certificate page
2. **Frontend generates PDF**:
   - Uses html2pdf.js to convert certificate HTML to PDF
   - Converts PDF blob to base64 string
3. **Frontend sends to backend**:
   - POST request to `/api/certificate/email/:courseId`
   - Includes base64 PDF data in request body
4. **Backend processes email**:
   - Fetches user email from database
   - Converts base64 PDF back to buffer
   - Creates HTML email template
   - Sends email via Nodemailer with PDF attachment
5. **User receives email**:
   - Professional HTML formatted email
   - Certificate PDF attached as downloadable file

---

## API Endpoint

### POST `/api/certificate/email/:courseId`

**Request**:
```json
{
  "pdfData": "data:application/pdf;base64,JVBERi0xLjQK..."
}
```

**Response - Success**:
```json
{
  "success": true,
  "message": "Certificate sent successfully to your email"
}
```

**Response - Error**:
```json
{
  "success": false,
  "message": "Failed to send certificate. Please try again later.",
  "error": "Error details..."
}
```

---

## Troubleshooting

### Error: "Failed to send certificate"

1. **Check email credentials in .env**:
   - Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are correct
   - If using Gmail, confirm you're using an app-specific password, not your regular password

2. **Check network connectivity**:
   - Ensure backend can reach SMTP servers

3. **Check logs**:
   - Monitor backend console for detailed error messages

### Error: "html2pdf.js not installed"

Run in frontend directory:
```bash
npm install html2pdf.js
```

### Users not receiving emails

1. Check spam/junk folder
2. Verify email address in user profile is correct
3. Check backend logs for email sending errors
4. Ensure EMAIL_SERVICE configuration matches your email provider

---

## Testing

### Manual Testing

1. Log in to a user account
2. Complete a course and pass the quiz (≥70%)
3. Go to your certificate page
4. Click "Send to Email"
5. Check your email inbox (including spam) for the certificate

### Test Email Content

The email includes:
- Congratulations message
- Certificate number
- Course name
- Achievement percentage
- Completion date
- Valid until date
- PDF attachment with certificate

---

## Security Considerations

1. **Email credentials**: Keep `.env` file secure and never commit to version control
2. **Base64 limits**: For very high-resolution PDFs, base64 encoding may create large payloads
3. **Rate limiting**: Consider implementing rate limiting to prevent email spam
4. **Authentication**: Only authenticated users can send certificates via their endpoints

---

## Future Enhancements

Consider implementing:

1. **Scheduled emails**: Send certificate automatically after course completion
2. **Email templates**: Customize email templates per organization
3. **Multiple recipients**: Allow sharing certificates with others
4. **Email history**: Track sent certificates in database
5. **Resend functionality**: Allow users to request email resend
6. **Bulk sending**: Admin feature to send certificates to multiple users
7. **SMS notification**: Notify users via SMS when certificate is ready

---

## Support

If you encounter issues:

1. Check backend console logs
2. Verify `.env` configuration
3. Test email service separately if needed
4. Ensure all npm packages are installed

---

## Files Modified/Created

### Backend
- ✅ `backend/controllers/certificate.controller.js` - Added email function
- ✅ `backend/routes/certificate.route.js` - Added email route

### Frontend
- ✅ `frontend/src/components/Certificate.jsx` - Added email button and functionality

### Dependencies to Install
- ❌ `nodemailer` (backend) - Run: `npm install nodemailer`
- ❌ `html2pdf.js` (frontend) - Run: `npm install html2pdf.js`

---

**Setup Date**: March 6, 2026  
**Status**: Ready for implementation
