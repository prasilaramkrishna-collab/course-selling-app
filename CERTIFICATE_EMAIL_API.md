# Certificate Email API Documentation

## Overview

The Certificate Email Functionality allows users to send their course completion certificates directly to their registered email address as a PDF attachment.

---

## API Endpoint

### POST `/api/certificate/email/:courseId`

Sends a user's certificate PDF to their registered email address.

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| courseId | String | Yes | MongoDB ObjectId of the course |

#### Request Headers

```
Authorization: Bearer <user-jwt-token>
Content-Type: application/json
```

#### Request Body

```json
{
  "pdfData": "data:application/pdf;base64,JVBERi0xLjQKJeLjz9..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| pdfData | String | Yes | Base64 encoded PDF data with data URI prefix |

#### Request Example (JavaScript/Fetch)

```javascript
// Generate PDF (frontend)
const pdfBase64 = await generatePdfFromHtml(certificateHtml);

// Send email request
const response = await fetch('/api/certificate/email/courseId123', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    pdfData: pdfBase64
  })
});

const result = await response.json();
console.log(result);
```

#### Request Example (Axios)

```javascript
import api from '../services/api';

const sendCertificateEmail = async (courseId, pdfBase64) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  
  const response = await api.post(
    `/api/certificate/email/${courseId}`,
    { pdfData: pdfBase64 },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    }
  );
  
  return response.data;
};
```

---

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Certificate sent successfully to your email"
}
```

### Error Responses

#### 404 Not Found - User Not Found

```json
{
  "success": false,
  "message": "User not found"
}
```

#### 404 Not Found - Certificate Not Found

```json
{
  "success": false,
  "message": "Certificate not found"
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Failed to send certificate. Please try again later.",
  "error": "Details of the error"
}
```

---

## Authentication

- **Required**: Yes
- **Type**: JWT Bearer Token
- **Middleware**: `userMiddleware`
- **Token Source**: LocalStorage (`user` object)

The endpoint only works for authenticated users. The JWT token must be included in the Authorization header.

---

## Data Flow

### Frontend Side

```javascript
// 1. Get certificate HTML element
const certificateElement = document.getElementById('certificateContent');

// 2. Configure html2pdf options
const options = {
  margin: 10,
  filename: 'certificate.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
};

// 3. Generate PDF
const pdf = html2pdf().set(options).from(certificateElement);
const pdfBlob = await pdf.output('blob');

// 4. Convert to base64
const reader = new FileReader();
reader.readAsDataURL(pdfBlob);
const pdfBase64 = reader.result; // data:application/pdf;base64,...

// 5. Send to backend
const response = await api.post(
  `/api/certificate/email/${courseId}`,
  { pdfData: pdfBase64 },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### Backend Side

```javascript
// 1. Extract PDF data
const pdfBase64 = req.body.pdfData;

// 2. Fetch user and certificate from database
const user = await User.findById(userId);
const certificate = await Certificate.findOne({ userId, courseId });

// 3. Convert base64 to buffer
const pdfBuffer = Buffer.from(
  pdfBase64.split(',')[1] || pdfBase64, 
  'base64'
);

// 4. Create email with attachment
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: user.email,
  subject: `Your Course Completion Certificate - ${certificate.courseName}`,
  html: emailTemplate,
  attachments: [{
    filename: `${certificate.certificateNumber}.pdf`,
    content: pdfBuffer,
    contentType: 'application/pdf'
  }]
};

// 5. Send via SMTP
await transporter.sendMail(mailOptions);
```

---

## Email Template

The backend generates the following HTML email:

```html
<div style="font-family: Playfair Display, serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px;">
    <h1>🎓 Certificate Received</h1>
    
    <p>Dear [First Name] [Last Name],</p>
    
    <p>Congratulations! Your certificate for the course 
    <strong>[Course Name]</strong> has been generated and is attached.</p>
    
    <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px;">
      <p><strong>Certificate Details:</strong></p>
      <ul>
        <li>Certificate Number: [CertificateNumber]</li>
        <li>Course: [CourseName]</li>
        <li>Achievement: [Percentage]%</li>
        <li>Completion Date: [Date]</li>
        <li>Valid Until: [Date]</li>
      </ul>
    </div>
    
    <p>You can view and download your certificate anytime from your dashboard.</p>
    
    <p>Best regards,<br><strong>FUTURE PROOF Learning Platform</strong></p>
  </div>
</div>
```

---

## Email Attachment Details

### File Name Format
```
[CERTIFICATE_NUMBER].pdf
Example: CERT-2026-FP-001.pdf
```

### Attachment Type
- **Content-Type**: `application/pdf`
- **Size**: Varies (typically 100-500 KB depending on certificate complexity)
- **Format**: Landscape A4 with high-quality rendering

---

## Error Handling

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "User not found" | Invalid userId from JWT | Check token validity |
| "Certificate not found" | No certificate for this course | Ensure user completed the course with ≥70% |
| "Failed to send certificate" | SMTP configuration issue | Verify .env email settings |
| "Invalid PDF format" | Corrupted base64 string | Regenerate PDF on frontend |

---

## Rate Limiting Recommendations

For production, implement rate limiting to prevent email spam:

```javascript
// Example using express-rate-limit
import rateLimit from 'express-rate-limit';

const emailLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // 3 requests per minute
  message: 'Too many email requests, please try again later'
});

router.post('/email/:courseId', emailLimiter, sendCertificateEmail);
```

---

## Security Considerations

### 1. Authentication
- Only authenticated users can access
- JWT token validation required
- User can only send their own certificate

### 2. Data Protection
- HTTPS should be enabled in production
- Base64 encoding for safe transmission
- No sensitive data in logs

### 3. Email Security
- Email credentials stored in `.env`
- Use app-specific passwords for Gmail
- SMTP connection encrypted

### 4. Input Validation

```javascript
// The endpoint validates:
- Valid courseId format
- Valid userId from JWT
- Valid PDF base64 data
- Certificate existence
- User email availability
```

---

## Performance Considerations

### PDF Generation
- **Frontend**: ~1-3 seconds for most certificates
- **Backend**: ~0.5-1 second for email sending
- **Total**: ~2-4 seconds end-to-end

### File Size
- **Average PDF size**: 150-300 KB
- **Max recommended**: <5 MB for email gateways

### Recommendations
- Display loading indicator during PDF generation
- Show progress message to user
- Implement retry logic for failed sends

---

## Environment Variables Required

```env
# Email Service Configuration
EMAIL_SERVICE=gmail              # Or: outlook, yahoo, custom
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-specific-pwd

# Optional for custom SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false               # true for 465, false for 587
```

---

## Testing the Endpoint

### Using cURL

```bash
curl -X POST \
  http://localhost:5000/api/certificate/email/courseId123 \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "pdfData": "data:application/pdf;base64,JVBERi0xLjQK..."
  }'
```

### Using Postman

1. Set method to POST
2. URL: `http://localhost:5000/api/certificate/email/courseId123`
3. Headers:
   - Authorization: `Bearer your-jwt-token`
   - Content-Type: `application/json`
4. Body (raw JSON):
   ```json
   {
     "pdfData": "data:application/pdf;base64,JVBERi0xLjQK..."
   }
   ```
5. Click Send

---

## Response Time Analysis

| Operation | Time | Notes |
|-----------|------|-------|
| Frontend PDF generation | 1-3s | Depends on PDF size |
| API request overhead | 0.1-0.5s | Network latency |
| Database queries | 0.1-0.2s | Fetching user/cert |
| Email sending | 0.5-2s | SMTP connection |
| **Total** | **2-6s** | Varies by network |

---

## Monitoring & Logging

### Suggested Log Points

```javascript
// Log successful emails
console.log(`[EMAIL_SENT] Certificate sent to ${user.email}`);

// Log failures
console.error(`[EMAIL_ERROR] Failed to send to ${user.email}:`, error);

// Log statistics
console.log(`[EMAIL_STATS] Total sent: ${count}, Failed: ${failed}`);
```

---

## Future Enhancement Ideas

1. **Scheduled Emails**: Send automatically after course completion
2. **Email Templates**: Customize per organization
3. **Bulk Sending**: Admin feature for multiple users
4. **Email History**: Track all sent certificates
5. **Resend Feature**: Allow users to request resend
6. **Multiple Recipients**: Share certificate with others
7. **SMS Notification**: Alert via SMS when ready
8. **Email Verification**: Verify email before sending

---

## Troubleshooting Guide

### Debug Mode

Enable detailed logging:

```javascript
// Add to certificate controller
if (process.env.DEBUG_EMAIL === 'true') {
  console.log('Email payload:', mailOptions);
  console.log('PDF buffer size:', pdfBuffer.length);
  console.log('User email:', user.email);
}
```

### Test Email Sending Separately

```javascript
// Test email configuration
const testTransport = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

testTransport.verify((error) => {
  if (error) {
    console.log('Email config error:', error);
  } else {
    console.log('Email service ready');
  }
});
```

---

## Support & Contact

For issues or questions:
1. Check the Troubleshooting Guide above
2. Review backend console logs
3. Verify `.env` configuration
4. Check email provider's documentation

---

**API Version**: 1.0  
**Last Updated**: March 6, 2026  
**Status**: Production Ready
