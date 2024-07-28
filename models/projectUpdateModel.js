const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProjectUpdateSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
      default: "PENDING",
    },
    attachments: [
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
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectUpdate", ProjectUpdateSchema);
