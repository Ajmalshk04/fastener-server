// projectRoutes.js
const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  forwardToSuppliers,
} = require("../controllers/projectControllers");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("customer"), createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, authorize("admin", "supplier"), updateProject);
router.delete("/:id", protect, authorize("admin"), deleteProject);
router.post("/:id/forward", protect, authorize("admin"), forwardToSuppliers);

module.exports = router;
