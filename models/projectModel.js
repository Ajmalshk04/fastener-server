const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
        uploadedAt: Date,
      },
    ],
    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "IN_PRODUCTION",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "AVAILABLE",
    },
    deliveryDate: Date,
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
