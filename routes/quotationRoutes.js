// quotationRoutes.js
const express = require("express");
const router = express.Router();
const {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  acceptQuotation,
} = require("../controllers/quotationControllers");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("supplier"), createQuotation);
router.get("/", protect, getQuotations);
router.get("/:id", protect, getQuotationById);
router.put("/:id", protect, authorize("admin", "supplier"), updateQuotation);
router.post("/:id/accept", protect, authorize("admin"), acceptQuotation);

module.exports = router;
