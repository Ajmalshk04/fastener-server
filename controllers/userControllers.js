// userController.js
const User = require("../models/userModel");
const Customer = require("../models/customerModel");
const Supplier = require("../models/supplierModel");
const Admin = require("../models/adminModel");
const { sendEmail } = require("../helpers/emailHelper");
const { generateOTP } = require("../helpers/otpHelper");

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, company, phoneNumber } =
      req.body;

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role,
      company,
      phoneNumber,
    });

    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    };
    await user.save();

    // Create role-specific profile
    if (role === "customer") {
      await Customer.create({ user: user._id });
    } else if (role === "supplier") {
      await Supplier.create({ user: user._id, companyName: company });
    } else if (role === "admin") {
      await Admin.create({ user: user._id });
    }

    await sendEmail(email, "Verify Your Account", `Your OTP is: ${otp}`);
    res.status(201).json({
      success: true,
      message: "User registered. Please check your email for OTP.",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ success: false, message: "Please verify your account first" });
    }
    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token, role: user.role });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Account verified successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };
    await user.save();
    await sendEmail(
      email,
      "New OTP for Account Verification",
      `Your new OTP is: ${otp}`
    );
    res
      .status(200)
      .json({ success: true, message: "New OTP sent to your email" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let profile;
    if (user.role === "customer") {
      profile = await Customer.findOne({ user: user._id });
    } else if (user.role === "supplier") {
      profile = await Supplier.findOne({ user: user._id });
    } else if (user.role === "admin") {
      profile = await Admin.findOne({ user: user._id });
    }
    res.status(200).json({ success: true, data: { user, profile } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });
    let profile;
    if (user.role === "customer") {
      profile = await Customer.findOneAndUpdate({ user: user._id }, req.body, {
        new: true,
        runValidators: true,
      });
    } else if (user.role === "supplier") {
      profile = await Supplier.findOneAndUpdate({ user: user._id }, req.body, {
        new: true,
        runValidators: true,
      });
    } else if (user.role === "admin") {
      profile = await Admin.findOneAndUpdate({ user: user._id }, req.body, {
        new: true,
        runValidators: true,
      });
    }
    res.status(200).json({ success: true, data: { user, profile } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect old password" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const resetToken = jwt.sign({ id: user._id }, process.env.RESET_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`; // Replace with your frontend URL
    await sendEmail(
      email,
      "Password Reset Request",
      `Please use the following link to reset your password: ${resetLink}`
    );
    res
      .status(200)
      .json({ success: true, message: "Password reset link sent to email" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.RESET_SECRET);
    const user = await User.findById(decoded.id).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
