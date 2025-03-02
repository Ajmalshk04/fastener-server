// quotationRoutes.js
const express = require("express");
const router = express.Router();
const {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  acceptQuotation,
  updateQuotationStatus,
} = require("../controllers/quotationControllers");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/projects/:projectId", protect, authorize("admin","supplier"), createQuotation);
router.get("/", protect, getQuotations);
router.get("/:id", protect, getQuotationById);
router.put("/:id", protect, authorize("admin"), updateQuotationStatus);
router.post("/:id/accept", protect, authorize("admin"), acceptQuotation);

module.exports = router;
