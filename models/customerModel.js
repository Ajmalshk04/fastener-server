const mongoose = require("mongoose");
const { Schema } = mongoose;

const CustomerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  shippingAddresses: [
    {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
  ],
  billingAddress: {
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  preferredPaymentMethod: { type: String },
});

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
