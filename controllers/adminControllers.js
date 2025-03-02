// adminController.js
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const Quotation = require("../models/quotationModel");
const ProjectUpdate = require("../models/projectUpdateModel");
const Supplier = require("../models/supplierModel");
const { sendEmail } = require("../helpers/emailHelper");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.getAllSuppliers = async (req, res) => {
  try {
    const users = await User.find({ role: "supplier" });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User Deleted Successful" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalQuotations = await Quotation.countDocuments();
    const recentProjects = await Project.find().sort("-createdAt").limit(5);
    const recentQuotations = await Quotation.find().sort("-createdAt").limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProjects,
        totalQuotations,
        recentProjects,
        recentQuotations,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.forwardProjectToSuppliers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const suppliers = await User.find({ role: "supplier" });
    for (let supplier of suppliers) {
      await sendEmail(
        supplier.email,
        "New Project Available for Quotation",
        `A new project "${project.title}" is available for quotation. Please log in to your account to view details and submit your quote.`
      );
    }

    project.status = "SUBMITTED";
    await project.save();

    res.status(200).json({
      success: true,
      message: "Project forwarded to suppliers successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.reviewQuotation = async (req, res) => {
  try {
    const { quotationId, status, adminComment } = req.body;
    const quotation = await Quotation.findById(quotationId);

    if (!quotation) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }

    quotation.status = status;
    quotation.adminComment = adminComment;
    await quotation.save();

    // Notify supplier about the quotation review
    const supplier = await User.findById(quotation.supplier);
    await sendEmail(
      supplier.email,
      "Quotation Review Update",
      `Your quotation for project "${quotation.project.title}" has been ${status}. Admin comment: ${adminComment}`
    );

    res.status(200).json({
      success: true,
      message: "Quotation reviewed successfully",
      data: quotation,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};




// Get all project updates
exports.getAllProjectUpdates = async (req, res) => {
  try {
    const projectUpdates = await ProjectUpdate.find()
      .populate("project", "title description status")
      .populate("supplier", "companyName");
    res.status(200).json({
      success: true,
      count: projectUpdates.length,
      data: projectUpdates,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get a single project update by ID
exports.getProjectUpdateById = async (req, res) => {
  try {
    const projectUpdate = await ProjectUpdate.findById(req.params.id)
      .populate("project", "title description status")
      .populate("supplier", "companyName");
    if (!projectUpdate) {
      return res.status(404).json({ success: false, message: "Project update not found" });
    }
    res.status(200).json({ success: true, data: projectUpdate });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Create a new project update (admin override)
exports.createProjectUpdate = async (req, res) => {
  try {
    const { projectId, supplierId, description, status, completionPercentage } = req.body;

    if (!projectId || !supplierId || !description || !status || completionPercentage === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields (projectId, supplierId, description, status, completionPercentage) are required",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }

    const projectUpdate = await ProjectUpdate.create({
      project: projectId,
      supplier: supplierId,
      description,
      status,
      completionPercentage,
    });

    // Update project status if applicable
    project.status = status === "COMPLETED" ? "DELIVERED" : "IN_PRODUCTION";
    await project.save();

    // Notify supplier and customer
    const supplierUser = await User.findById(supplier.user);
    const customer = await User.findById(project.customer);
    const recipients = [supplierUser, customer].filter(Boolean);
    for (let recipient of recipients) {
      await sendEmail(
        recipient.email,
        "Admin Project Update",
        `Admin updated project "${project.title}" to "${status}". Description: ${description}, Completion: ${completionPercentage}%`
      );
    }

    res.status(201).json({ success: true, data: projectUpdate });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update a project update
exports.updateProjectUpdate = async (req, res) => {
  try {
    const { description, status, completionPercentage } = req.body;

    const projectUpdate = await ProjectUpdate.findById(req.params.id);
    if (!projectUpdate) {
      return res.status(404).json({ success: false, message: "Project update not found" });
    }

    projectUpdate.description = description || projectUpdate.description;
    projectUpdate.status = status || projectUpdate.status;
    projectUpdate.completionPercentage = completionPercentage !== undefined ? completionPercentage : projectUpdate.completionPercentage;
    await projectUpdate.save();

    // Update project status if changed
    const project = await Project.findById(projectUpdate.project);
    if (status && project.status !== (status === "COMPLETED" ? "DELIVERED" : "IN_PRODUCTION")) {
      project.status = status === "COMPLETED" ? "DELIVERED" : "IN_PRODUCTION";
      await project.save();
    }

    res.status(200).json({ success: true, data: projectUpdate });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a project update
exports.deleteProjectUpdate = async (req, res) => {
  try {
    const projectUpdate = await ProjectUpdate.findByIdAndDelete(req.params.id);
    if (!projectUpdate) {
      return res.status(404).json({ success: false, message: "Project update not found" });
    }
    res.status(200).json({ success: true, message: "Project update deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};