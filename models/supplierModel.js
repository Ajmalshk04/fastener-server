const mongoose = require("mongoose");
const { Schema } = mongoose;

const SupplierSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String },
  companyAddress: { type: String },
  taxId: { type: String },
  manufacturingCapabilities: [String],
  certifications: [String],
  rating: { type: Number, default: 0 },
  totalProjects: { type: Number, default: 0 },
  activeProjects: { type: Number, default: 0 },
  leadTime: { type: Number }, // Average lead time in days
  minimumOrderValue: { type: Number },
});

const Supplier = mongoose.model("Supplier", SupplierSchema);
module.exports = Supplier;
