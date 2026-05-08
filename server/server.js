import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRouter.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRouter.js";

// initialize express App
const app = express();
console.log("Server starting...");

// Connect Database
connectDB().catch(err => console.error("❌ Database connection error:", err));

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://drive-now-blush.vercel.app",
  // Add any other deployment URLs here
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Instead of throwing an Error (which causes 500), 
        // we just pass false to block it or log it.
        console.log("❌ CORS BLOCKED:", origin);
        callback(null, false); 
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Middleware
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

// Server listen
const PORT = process.env.PORT || 4000;

// Only start the server if we're not running on Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
export default app;
