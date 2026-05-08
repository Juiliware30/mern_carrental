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

// CORS Configuration - Temporarily allow all for debugging
app.use(
  cors({
    origin: true, // This allows ALL origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Middleware
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(`Origin: ${req.headers.origin}`);
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
