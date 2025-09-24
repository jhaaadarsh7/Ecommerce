const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDatabase = require("./config/database");
const cors = require("cors");
const path = require("path");
const user = require("./routes/userroute");
const product = require("./routes/ProductRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

// Load environment variables
dotenv.config({ path: "backend/config/config.env" });

// Connect to the database
connectDatabase();

const app = express();

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add this line for cookie parsing
app.use(cors()); // Make sure CORS is enabled

// Serve static files (images) - Ensure the correct path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route for server status
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully!",
    status: "Active",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 4000,
    environment: process.env.NODE_ENV || "development"
  });
});

// Routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Handle unhandled promise rejections
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
