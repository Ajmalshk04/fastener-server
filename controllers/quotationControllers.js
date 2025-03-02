// quotationController.js
const Quotation = require("../models/quotationModel");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const { sendEmail } = require("../helpers/emailHelper");
const APIFeatures = require("../utils/apiFeatures");
const Supplier = require("../models/supplierModel");

// exports.createQuotation = async (req, res) => {
//   try {
//     const { 
//       unitPrice, 
//       quantity, 
//       taxes, 
//       shippingCost, 
//       leadTime, 
//       validUntil 
//     } = req.body;

//     const user = await User.findOne({ _id: req.user._id });
//     if (!user) {
//       return res.status(400).json({ success: false, message: "Supplier profile not found" });
//     }

//     const supplier = await Supplier.findOne({ user: req.user._id });
//     if (!supplier) {
//       return res.status(400).json({ success: false, message: "Supplier profile not found" });
//     }

//     const quotation = await Quotation.create({
//       project: req.params.projectId,
//       supplier: supplier._id, // Use supplier._id instead of req.user.id
//       unitPrice: parseFloat(unitPrice),
//       quantity: parseInt(quantity),
//       subtotal: parseFloat(unitPrice) * parseInt(quantity),
//       taxes: parseFloat(taxes || 0),
//       shippingCost: parseFloat(shippingCost || 0),
//       totalPrice: parseFloat(unitPrice) * parseInt(quantity) + parseFloat(taxes || 0) + parseFloat(shippingCost || 0),
//       leadTime: parseInt(leadTime),
//       validUntil: new Date(validUntil),
//       status: "PENDING",
//     });

//     // Notify Admin about new quotation
//     const admins = await User.find({ role: "admin" });
//     for (let admin of admins) {
//       await sendEmail(
//         admin.email,
//         "New Quotation Received",
//         `A new quotation has been submitted for project "${quotation.project.title}".`
//       );
//     }

//     res.status(201).json({ success: true, data: quotation });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

exports.createQuotation = async (req, res) => {
  try {
    const { 
      unitPrice, 
      quantity, 
      taxes, 
      shippingCost, 
      leadTime, 
      validUntil 
    } = req.body;

    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(400).json({ success: false, message: "Supplier profile not found" });
    }

    const supplier = await Supplier.findOne({ user: req.user._id });
    if (!supplier) {
      return res.status(400).json({ success: false, message: "Supplier profile not found" });
    }

    // Check if a quotation already exists for this project and supplier
    const existingQuotation = await Quotation.findOne({
      project: req.params.projectId,
      supplier: supplier._id,
    });

    if (existingQuotation) {
      return res.status(400).json({
        success: false,
        message: "A quotation from this supplier for this project already exists.",
        data: existingQuotation,
      });
      // Optionally, you could update the existing quotation instead:
      /*
      const updatedQuotation = await Quotation.findOneAndUpdate(
        { project: req.params.projectId, supplier: supplier._id },
        {
          unitPrice: parseFloat(unitPrice),
          quantity: parseInt(quantity),
          subtotal: parseFloat(unitPrice) * parseInt(quantity),
          taxes: parseFloat(taxes || 0),
          shippingCost: parseFloat(shippingCost || 0),
          totalPrice: parseFloat(unitPrice) * parseInt(quantity) + parseFloat(taxes || 0) + parseFloat(shippingCost || 0),
          leadTime: parseInt(leadTime),
          validUntil: new Date(validUntil),
          status: "PENDING",
        },
        { new: true }
      );
      return res.status(200).json({ success: true, data: updatedQuotation });
      */
    }

    // Create new quotation if no duplicate exists
    const quotation = await Quotation.create({
      project: req.params.projectId,
      supplier: supplier._id,
      unitPrice: parseFloat(unitPrice),
      quantity: parseInt(quantity),
      subtotal: parseFloat(unitPrice) * parseInt(quantity),
      taxes: parseFloat(taxes || 0),
      shippingCost: parseFloat(shippingCost || 0),
      totalPrice: parseFloat(unitPrice) * parseInt(quantity) + parseFloat(taxes || 0) + parseFloat(shippingCost || 0),
      leadTime: parseInt(leadTime),
      validUntil: new Date(validUntil),
      status: "PENDING",
    });

    // Notify Admin about new quotation
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
    let query = Quotation.find();

    // Role-based filtering
    if (req.user.role === "supplier") {
      const supplier = await Supplier.findOne({ user: req.user.id });
      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: "Supplier profile not found",
        });
      }
      query = query.where({ supplier: supplier._id });
    }
    // No additional filtering for admin or customer roles; admins see all quotations

    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const quotations = await features.query.populate([
      {
        path: "project",
        select: "title description status createdAt",
        populate: {
          path: "customer",
          select: "companyName",
        },
      },
      {
        path: "supplier",
        select: "companyName certifications",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: quotations.length,
      data: quotations,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
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

exports.updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body; // status should be either 'ACCEPTED' or 'REJECTED'
    const quotation = await Quotation.findById(req.params.id).populate("project");
    if (!quotation) {
      return res.status(404).json({ success: false, message: "Quotation not found" });
    }

    if (status === "ACCEPTED") {
      // Update quotation status
      quotation.status = "ACCEPTED";
      await quotation.save();

      // Update project status and assign supplier
      const project = await Project.findById(quotation.project._id);
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      project.status = "IN_PRODUCTION";
      project.supplier = quotation.supplier; // Assign supplier to project
      await project.save();

      // Notify Supplier about acceptance (if supplier exists)
      const supplier = quotation.supplier ? await User.findById(quotation.supplier) : null;
      if (supplier) {
        await sendEmail(
          supplier.email,
          "Quotation Accepted",
          `Your quotation for project "${project.title}" has been accepted. Production will begin soon.`
        );
      } else {
        console.warn(`No supplier found for quotation ${quotation._id}`);
      }

      // Notify Customer about acceptance (if customer exists)
      const customer = project.customer ? await User.findById(project.customer) : null;
      if (customer) {
        await sendEmail(
          customer.email,
          "Project Update",
          `A supplier has been selected for your project "${project.title}". Production will begin soon.`
        );
      } else {
        console.warn(`No customer found for project ${project._id}`);
      }
    } else if (status === "REJECTED") {
      quotation.status = "REJECTED";
      await quotation.save();

      const supplier = quotation.supplier ? await User.findById(quotation.supplier) : null;
      if (supplier) {
        await sendEmail(
          supplier.email,
          "Quotation Rejected",
          `Your quotation for project "${quotation.project.title}" has been rejected.`
        );
      } else {
        console.warn(`No supplier found for quotation ${quotation._id}`);
      }
    }

    res.status(200).json({
      success: true,
      message: status === "ACCEPTED" ? "Quotation accepted and project updated" : "Quotation rejected",
    });
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
