const express = require("express");
const connectDB = require("./config/dbConnection");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");

const app = express();

// Connect to database
connectDB();

// Use CORS middleware
// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',  
  'https://xofah-dev.netlify.app',
  'http://localhost:5174',  
  'http://localhost:5175',  
  'http://localhost:3000' 
];

// Use CORS middleware with dynamic origin checking
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // If you need to send cookies or authentication headers
}));


// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/admin", adminRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
