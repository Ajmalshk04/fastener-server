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
  getProjectByUserId,
} = require("../controllers/projectControllers");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", authorize("customer"), createProject);
router.get("/", getProjects);
router.get(
  "/get-project-by-user-id",
  authorize("customer"),
  getProjectByUserId
);

router.get("/:id", getProjectById);

router.put("/:id", authorize("admin", "supplier"), updateProject);
router.delete("/:id", authorize("admin"), deleteProject);
router.post("/:id/forward", authorize("admin"), forwardToSuppliers);

module.exports = router;
