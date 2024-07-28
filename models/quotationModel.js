const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuotationSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    taxes: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    leadTime: {
      type: Number,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quotation", QuotationSchema);
