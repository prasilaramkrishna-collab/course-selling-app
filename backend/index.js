import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';
import paymentRoute from "./routes/payment.route.js";
import quizRoute from "./routes/quiz.route.js";
import certificateRoute from "./routes/certificate.route.js";
import feedbackRoute from "./routes/feedback.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "public");


// Middleware to parse JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
    fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174', 
        'http://localhost:5175', 
        'http://localhost:5176',
        'https://frontend-silk-two-95.vercel.app',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

// Health check route
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "ok", 
        message: "Course Selling App API is running",
        timestamp: new Date().toISOString()
    });
});

//defining routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/certificate", certificateRoute);
app.use("/api/feedback", feedbackRoute);

if (existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));

    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(frontendDistPath, "index.html"));
    });
}

 // cloudinary Configuration code
    cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret: process.env.api_secret 
    });


// MongoDB connection with retry logic and better error handling
const connectDB = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(DB_URI, {
                serverSelectionTimeoutMS: 10000, // Timeout after 10s
                socketTimeoutMS: 45000, // Close sockets after 45s
            });
            console.log("✅ Connected to MongoDB successfully");
            return;
        } catch (error) {
            console.error(`❌ MongoDB connection attempt ${i + 1}/${retries} failed:`, error.message);
            
            if (i < retries - 1) {
                console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error("\n🚨 Failed to connect to MongoDB after multiple attempts.");
                console.error("📝 Troubleshooting steps:");
                console.error("   1. Check if MongoDB Atlas cluster is running (not paused)");
                console.error("   2. Verify your IP is whitelisted in Network Access");
                console.error("   3. Confirm MONGO_URI credentials are correct");
                console.error("   4. Check your internet connection\n");
                // Don't exit - allow server to start for other operations
            }
        }
    }
};

// Start MongoDB connection
connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
