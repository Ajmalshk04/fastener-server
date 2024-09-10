// adminController.js
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const Quotation = require("../models/quotationModel");
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
