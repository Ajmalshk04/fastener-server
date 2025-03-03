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
app.use(cors({
  origin: ['https://fastener-client.netlify.app'],
  // credentials: true
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
