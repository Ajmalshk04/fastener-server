// projectController.js
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const { sendEmail } = require("../helpers/emailHelper");
const APIFeatures = require("../utils/apiFeatures");

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      customer: req.user.id,
    });

    // Notify admin about new project
    const admins = await User.find({ role: "admin" });
    for (let admin of admins) {
      await sendEmail(
        admin.email,
        "New Project Created",
        `A new project "${project.title}" has been created and needs your attention.`
      );
    }

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const features = new APIFeatures(Project.find(), req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const projects = await features.query;

    res
      .status(200)
      .json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("supplier");
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: "Project Deleted Successful" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.forwardToSuppliers = async (req, res) => {
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
        "New Project Opportunity",
        `A new project "${project.title}" is available for quotation. Please check your dashboard for details.`
      );
    }

    project.status = "SUBMITTED";
    await project.save();

    res
      .status(200)
      .json({ success: true, message: "Project forwarded to suppliers" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
