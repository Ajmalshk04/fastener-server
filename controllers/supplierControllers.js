// supplierController.js
const Supplier = require("../models/supplierModel");
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const APIFeatures = require("../utils/apiFeatures");
const projectUpdateModel = require("../models/projectUpdateModel");

exports.getSuppliers = async (req, res) => {
  try {
    const features = new APIFeatures(Supplier.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const suppliers = await features.query;

    res
      .status(200)
      .json({ success: true, count: suppliers.length, data: suppliers });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate(
      "user",
      "firstName lastName email"
    );
    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getSupplierProjects = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    // Check if the logged-in user is the supplier or an admin
    if (req.user.role !== "admin" && supplier.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view these projects",
      });
    }

    const features = new APIFeatures(
      Project.find({ supplier: supplierId }),
      req.query
    )
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const projects = await features.query;

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateProjectStatus = async (req, res) => {
  try {
    const { projectId, status, description } = req.body;
    const project = await Project.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const supplier = await Supplier.findOne({ user: req.user.id });
    if (!supplier || project.supplier.toString() !== supplier._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this project",
      });
    }

    project.status = status;
    await project.save();

    // Create a new project update
    const projectUpdate = await projectUpdateModel.create({
      project: projectId,
      supplier: supplier._id,
      description,
      status,
    });

    // Notify customer about the update
    const customer = await User.findById(project.customer);
    await sendEmail(
      customer.email,
      "Project Update",
      `Your project "${project.title}" has been updated to status: ${status}. Update: ${description}`
    );

    res.status(200).json({
      success: true,
      message: "Project status updated",
      data: { project, projectUpdate },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
