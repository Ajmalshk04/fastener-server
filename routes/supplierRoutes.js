// // supplierRoutes.js
// const express = require("express");
// const router = express.Router();
// const {
//   getSuppliers,
//   getSupplierById,
//   updateSupplier,
//   getSupplierProjects,
//   updateProjectStatus,
// } = require("../controllers/supplierControllers");
// const { protect, authorize } = require("../middleware/authMiddleware");

// router.get("/", protect, authorize("admin"), getSuppliers);
// router.get("/:id", protect, getSupplierById);
// router.put("/:id", protect, authorize("admin", "supplier"), updateSupplier);
// router.get(
//   "/:id/projects",
//   protect,
//   authorize("admin", "supplier"),
//   getSupplierProjects
// );
// router.post(
//   "/update-project",
//   protect,
//   authorize("admin", "supplier"),
//   updateProjectStatus
// );

// module.exports = router;

// supplierRoutes.js
const express = require("express");
const router = express.Router();
const {
  getSuppliers,
  getSupplierById,
  updateSupplier,
  getSupplierProjects,
  updateProjectStatus,
} = require("../controllers/supplierControllers");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin"), getSuppliers);
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

module.exports = router;
