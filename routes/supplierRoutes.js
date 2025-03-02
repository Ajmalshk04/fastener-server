const express = require("express");
const router = express.Router();
const {
  getSuppliers,
  getSupplierById,
  updateSupplier,
  getSupplierProjects,
  updateProjectStatus,
  getSupplierByUserId,
  updateCapabilities,
  getManufacturingCapabilities,
  getSupplierOrders,
  getSupplierOrderById,
} = require("../controllers/supplierControllers");
const { protect, authorize } = require("../middleware/authMiddleware");


router.get("/capabilities", protect, getManufacturingCapabilities);
router.get("/", protect, authorize("admin"), getSuppliers);
router.get("/me", protect, getSupplierByUserId);
router.get("/orders", protect, authorize("supplier"), getSupplierOrders);
router.get("/orders/:orderId", protect,authorize("supplier"), getSupplierOrderById);
// router.get("/bids", protect, authorize("supplier"), getSupplierBids);
// router.get("/active-projects", protect, authorize("supplier"), getSupplierActiveProjects);
router.get("/:id", protect, getSupplierById);
router.put("/:id", protect, authorize("admin", "supplier"), updateSupplier);
router.get(
  "/:id/projects",
  protect,
  authorize("admin", "supplier"),
  getSupplierProjects
);
router.post(
  "/update-project",
  protect,
  authorize("admin", "supplier"),
  updateProjectStatus
);

// Update capabilities (add/remove multiple at once)
router.post("/capabilities", protect, updateCapabilities);

module.exports = router;
