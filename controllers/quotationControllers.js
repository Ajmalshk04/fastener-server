// quotationController.js
const Quotation = require("../models/quotationModel");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const { sendEmail } = require("../helpers/emailHelper");
const APIFeatures = require("../utils/apiFeatures");

exports.createQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.create({
      ...req.body,
      supplier: req.user.id,
    });

    // Notify admin about new quotation
    const admins = await User.find({ role: "admin" });
    for (let admin of admins) {
      await sendEmail(
        admin.email,
        "New Quotation Received",
        `A new quotation has been submitted for project "${quotation.project.title}".`
      );
    }

    res.status(201).json({ success: true, data: quotation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getQuotations = async (req, res) => {
  try {
    const features = new APIFeatures(Quotation.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const quotations = await features.query;

    res
      .status(200)
      .json({ success: true, count: quotations.length, data: quotations });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }
    res.status(200).json({ success: true, data: quotation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!quotation) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }
    res.status(200).json({ success: true, data: quotation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.acceptQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }

    quotation.status = "ACCEPTED";
    await quotation.save();

    const project = await Project.findById(quotation.project);
    project.supplier = quotation.supplier;
    project.status = "IN_PRODUCTION";
    await project.save();

    // Notify supplier about accepted quotation
    const supplier = await User.findById(quotation.supplier);
    await sendEmail(
      supplier.email,
      "Quotation Accepted",
      `Your quotation for project "${project.title}" has been accepted.`
    );

    // Notify customer about accepted quotation
    const customer = await User.findById(project.customer);
    await sendEmail(
      customer.email,
      "Project Update",
      `A supplier has been selected for your project "${project.title}". Production will begin soon.`
    );

    res.status(200).json({
      success: true,
      message: "Quotation accepted and project updated",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
