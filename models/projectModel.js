const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
    admin: { type: Schema.Types.ObjectId, ref: "Admin" },
    title: { type: String, required: true },
    description: { type: String },
    requirements: {
      material: String,
      process: String,
      quantity: Number,
      tolerance: String,
      finish: String,
    },
    files: [
      {
        name: String,
        firebaseStorageUrl: String,
        downloadUrl: String,
        fileType: {
          type: String,
          enum: [
            "3DMXL",
            "3MF",
            "DXF",
            "SAT",
            "SLDPRT",
            "STL",
            "STP",
            "STEP",
            "GIF",
            "JPEG",
            "JPG",
            "PNG",
            "PDF",
            "DWG",
            "IGES",
            "POF",
          ],
        },
        category: {
          type: String,
          enum: ["3D_MODEL", "DRAWING", "SPECIFICATION", "IMAGE", "OTHER"],
        },
        size: Number, // File size in bytes
        uploadedAt: Date,
      },
    ],
    status: {
      type: String,
      enum: [
        "DRAFT",
        "SUBMITTED",
        "QUOTED",
        "IN_PRODUCTION",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "DRAFT",
    },
    deliveryDate: Date,
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
