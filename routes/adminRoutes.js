// adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
  forwardProjectToSuppliers,
  reviewQuotation,
  getAllSuppliers,
  getAllProjectUpdates,
  getProjectUpdateById,
  createProjectUpdate,
  updateProjectUpdate,
  deleteProjectUpdate,
} = require("../controllers/adminControllers");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorize("admin"));

router.get("/users", getAllUsers);
router.get("/suppliers", getAllSuppliers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/dashboard", getDashboardStats);
router.post("/projects/:id/forward", forwardProjectToSuppliers);
router.post("/quotations/review", reviewQuotation);




// Project Update Routes
router.get("/project-updates", getAllProjectUpdates);
router.get("/project-updates/:id", getProjectUpdateById);
router.post("/project-updates", createProjectUpdate);
router.put("/project-updates/:id", updateProjectUpdate);
router.delete("/project-updates/:id", deleteProjectUpdate);

module.exports = router;
