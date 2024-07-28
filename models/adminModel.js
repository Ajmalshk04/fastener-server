const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  department: { type: String },
  accessLevel: { type: Number, default: 1 },
});

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
