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
await connectDB();
console.log("Database connected");

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",                 // local development
  "https://drive-now-blush.vercel.app",    // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, Mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ CORS BLOCKED:", origin);
        return callback(new Error("CORS Not Allowed"), false);
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

// Server listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
