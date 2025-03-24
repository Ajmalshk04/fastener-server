// supplierController.js
const Supplier = require("../models/supplierModel");
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const APIFeatures = require("../utils/apiFeatures");
const ProjectUpdate = require("../models/projectUpdateModel");
const quotationModel = require("../models/quotationModel");
const { sendEmail } = require("../helpers/emailHelper");

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
      "user"
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
exports.getSupplierByUserId = async (req, res) => {
  try {

    console.log(req.user);
const user = req.user._id;


    if (!user || !user.id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is not valid" });
    }

    const supplier = await Supplier.findOne({ user })
    .populate(
      "user",
      "firstName lastName email phoneNumber"
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
    let updateData = req.body;

    // If competencies are being updated, ensure they're added to manufacturingCapabilities
    if (req.body.competencies) {
      updateData = {
        ...req.body,
        manufacturingCapabilities: req.body.competencies,
      };
      delete updateData.competencies; // Remove the temporary competencies field
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
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

exports.getSupplierOrders = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ user: req.user.id });
    if (!supplier) {
      return res.status(404).json({ success: false, message: "Supplier profile not found" });
    }

    const orders = await quotationModel.find({ 
      supplier: supplier._id, 
      status: "ACCEPTED" 
    }).populate({
      path: "project",
      select: "title description status createdAt",
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getSupplierOrderById = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ user: req.user.id });
    console.log("supplier order",supplier);
    
    if (!supplier) {
      return res.status(404).json({ success: false, message: "Supplier profile not found" });
    }

    const order = await quotationModel
      .findOne({
        _id: req.params.orderId, // Order ID from the URL parameter
        supplier: supplier._id, // Ensure it belongs to the supplier
        status: "ACCEPTED", // Only accepted orders
      })
      .populate({
        path: "project",
        select: "title description status createdAt",
      });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


exports.updateProjectStatus = async (req, res) => {
  try {
    const { projectId, status, description, completionPercentage } = req.body;

    // Validate required fields
    if (!projectId || !status || !description || completionPercentage === undefined) {
      return res.status(400).json({
        success: false,
        message: "Project ID, status, description, and completion percentage are required",
      });
    }

    // Find the supplier
    const supplier = await Supplier.findOne({ user: req.user.id });
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier profile not found",
      });
    }

    // Verify the project exists and belongs to the supplier
    const project = await Project.findOne({ _id: projectId, supplier: supplier._id });
    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Project not found or not assigned to this supplier",
      });
    }

    // Create a new project update
    const projectUpdate = await ProjectUpdate.create({
      project: projectId,
      supplier: supplier._id,
      description,
      status,
      completionPercentage,
    });

    // Update the project status in the Project model
    project.status = status === "COMPLETED" ? "DELIVERED" : "IN_PRODUCTION"; // Map to Project model statuses
    await project.save();

    // Notify customer and admin
    const customer = await User.findById(project.customer);
    const admins = await User.find({ role: "admin" });
    const recipients = [customer, ...admins].filter(Boolean);

    for (let recipient of recipients) {
      await sendEmail(
        recipient.email,
        "Project Status Update",
        `The project "${project.title}" has been updated to "${status}" by the supplier. Description: ${description}, Completion: ${completionPercentage}%`
      );
    }

    res.status(200).json({
      success: true,
      message: "Project status updated successfully",
      data: projectUpdate,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.submitProjectUpdate = async (req, res) => {
  try {
    const { projectId, status, description, completionPercentage } = req.body;

    if (!completionPercentage) {
      return res.status(400).json({ success: false, message: "Completion percentage is required" });
    }

    const project = await Project.findOne({ _id: projectId, supplier: req.user._id });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found or unauthorized" });
    }

    // Create a new project update
    const update = await ProjectUpdate.create({
      project: projectId,
      supplier: req.user._id,
      status,
      description,
      completionPercentage,
    });

    // Update project status if necessary
    if (status !== project.status) {
      project.status = status;
      await project.save();
    }

    // Notify admin & customer
    const recipients = [
      ...(await User.find({ role: "admin" })),
      await User.findById(project.customer),
    ];

    for (let recipient of recipients) {
      await sendEmail(recipient.email, "Project Update", `Project "${project.title}" updated: ${description}`);
    }

    res.status(201).json({
      success: true,
      message: "Project update submitted successfully",
      data: update,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


exports.updateCapabilities = async (req, res) => {
  try {
    const supplierId = req.user.id; // Extract supplier's user ID from request
    console.log("supplierId", supplierId);

    const { addCapabilities, removeCapabilities } = req.body;

    if (!addCapabilities && !removeCapabilities) {
      return res.status(400).json({ message: "Provide capabilities to add or remove" });
    }

    // Step 1: Fetch Supplier's Current Capabilities
    const supplier = await Supplier.findOne({ user: supplierId });
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    const currentCapabilities = supplier.manufacturingCapabilities || [];

    // Step 2: Check existence of `addCapabilities`
    const existingAdd = [];
    const newAdd = [];
    if (addCapabilities && Array.isArray(addCapabilities)) {
      addCapabilities.forEach(capability => {
        if (currentCapabilities.includes(capability)) {
          existingAdd.push(capability); // Already exists
        } else {
          newAdd.push(capability); // Needs to be added
        }
      });
    }

    // Step 3: Check existence of `removeCapabilities`
    const existingRemove = [];
    const nonExistingRemove = [];
    if (removeCapabilities && Array.isArray(removeCapabilities)) {
      removeCapabilities.forEach(capability => {
        if (currentCapabilities.includes(capability)) {
          existingRemove.push(capability); // Exists and can be removed
        } else {
          nonExistingRemove.push(capability); // Doesn't exist
        }
      });
    }

    let updatedSupplier = supplier; // Store updated supplier data

    // Step 4: Add new capabilities (separate update)
    if (newAdd.length > 0) {
      updatedSupplier = await Supplier.findOneAndUpdate(
        { user: supplierId },
        { $addToSet: { manufacturingCapabilities: { $each: newAdd } } },
        { new: true }
      );
    }

    // Step 5: Remove existing capabilities (separate update)
    if (existingRemove.length > 0) {
      updatedSupplier = await Supplier.findOneAndUpdate(
        { user: supplierId },
        { $pull: { manufacturingCapabilities: { $in: existingRemove } } },
        { new: true }
      );
    }

    // Step 6: Return response
    res.json({
      message: "Capabilities updated successfully",
      existingAdd,
      newAdd,
      existingRemove,
      nonExistingRemove,
      supplier: updatedSupplier,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getManufacturingCapabilities = async (req, res) => {
  try {
    const supplierId = req.user.id; // Extract supplier's user ID from request
console.log("supplierId", supplierId);

    // Find supplier by user ID
    const supplier = await Supplier.findOne({ user: supplierId }).select("manufacturingCapabilities");
    
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json({ manufacturingCapabilities: supplier.manufacturingCapabilities });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};