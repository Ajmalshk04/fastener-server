// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const User = require('../models/userModel');
// const Admin = require('../models/adminModel');
// const Customer = require('../models/customerModel');
// const Supplier = require('../models/supplierModel');
// const Project = require('../models/projectModel');
// const ProjectUpdate = require('../models/projectUpdateModel');
// const Quotation = require('../models/quotationModel');
// const connectDB = require('../config/dbConnection');
// // Generate hashed password for '12345678'
// const hashedPassword = bcrypt.hashSync('12345678', 10);

// // Users (10 records)
// const users = [
//   {
//     _id: new mongoose.Types.ObjectId(),
//     email: "customer1@example.com",
//     password: hashedPassword,
//     role: "customer",
//     firstName: "John",
//     lastName: "Doe",
//     phoneNumber: "+1234567890",
//     company: "ABC Corp",
//     isVerified: true
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     email: "supplier1@example.com",
//     password: hashedPassword,
//     role: "supplier",
//     firstName: "Jane",
//     lastName: "Smith",
//     phoneNumber: "+1234567891",
//     company: "XYZ Manufacturing",
//     isVerified: true
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     email: "admin1@example.com",
//     password: hashedPassword,
//     role: "admin",
//     firstName: "Mike",
//     lastName: "Johnson",
//     phoneNumber: "+1234567892",
//     company: "Fastners Admin",
//     isVerified: true
//   },
//   // Continue the pattern for 10 users
//   {
//     _id: new mongoose.Types.ObjectId(),
//     email: "customer2@example.com",
//     password: hashedPassword,
//     role: "customer",
//     firstName: "Sarah",
//     lastName: "Wilson",
//     phoneNumber: "+1234567893",
//     company: "DEF Industries",
//     isVerified: true
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     email: "supplier2@example.com",
//     password: hashedPassword,
//     role: "supplier",
//     firstName: "Robert",
//     lastName: "Brown",
//     phoneNumber: "+1234567894",
//     company: "Quality Parts Co",
//     isVerified: true
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     email: "customer3@example.com",
//     password: hashedPassword,
//     role: "customer",
//     firstName: "Emily",
//     lastName: "Davis",
//     phoneNumber: "+1234567895",
//     company: "GHI Solutions",
//     isVerified: true
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     email: "supplier3@example.com",
//     password: hashedPassword,
//     role: "supplier",
//     firstName: "David",
//     lastName: "Miller",
//     phoneNumber: "+1234567896",
//     company: "Precision Parts",
//     isVerified: true
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     email: "admin2@example.com",
//     password: hashedPassword,
//     role: "admin",
//     firstName: "Lisa",
//     lastName: "Taylor",
//     phoneNumber: "+1234567897",
//     company: "Fastners Admin",
//     isVerified: true
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     email: "customer4@example.com",
//     password: hashedPassword,
//     role: "customer",
//     firstName: "Thomas",
//     lastName: "Anderson",
//     phoneNumber: "+1234567898",
//     company: "JKL Corp",
//     isVerified: true
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     email: "supplier4@example.com",
//     password: hashedPassword,
//     role: "supplier",
//     firstName: "Mary",
//     lastName: "White",
//     phoneNumber: "+1234567899",
//     company: "Elite Manufacturing",
//     isVerified: true
//   }
// ];

// // Complete all 10 records for other models
// // Admins (10 records)
// const admins = users
//   .filter(u => u.role === 'admin')
//   .map((user, index) => ({
//     _id: new mongoose.Types.ObjectId(),
//     user: user._id,
//     department: index % 2 === 0 ? "Operations" : "Quality Control",
//     accessLevel: index % 2 === 0 ? 2 : 1
//   }));

// // Customers (10 records)
// const customers = users
//   .filter(u => u.role === 'customer')
//   .map((user, index) => ({
//     _id: new mongoose.Types.ObjectId(),
//     user: user._id,
//     shippingAddresses: [{
//       addressLine1: `${index + 123} Main St`,
//       city: ["Boston", "Chicago", "Houston"][index % 3],
//       state: ["MA", "IL", "TX"][index % 3],
//       country: "USA",
//       zipCode: `0210${index}`
//     }],
//     billingAddress: {
//       addressLine1: `${index + 123} Main St`,
//       city: ["Boston", "Chicago", "Houston"][index % 3],
//       state: ["MA", "IL", "TX"][index % 3],
//       country: "USA",
//       zipCode: `0210${index}`
//     },
//     preferredPaymentMethod: ["credit_card", "paypal", "bank_transfer"][index % 3]
//   }));

// // Suppliers (10 records)
// const suppliers = users
//   .filter(u => u.role === 'supplier')
//   .map((user, index) => ({
//     _id: new mongoose.Types.ObjectId(),
//     user: user._id,
//     companyName: user.company,
//     companyAddress: `${index + 456} Industry Ave, ${["Chicago", "Houston", "Boston"][index % 3]}, ${["IL", "TX", "MA"][index % 3]} ${60000 + index}`,
//     taxId: `TAX-${10000 + index}`,
//     manufacturingCapabilities: [["CNC Machining", "3D Printing"], ["Metal Stamping", "Threading"], ["Injection Molding"]][index % 3],
//     certifications: [["ISO 9001"], ["AS9100D"], ["ISO 13485"]][index % 3],
//     rating: (4 + (index * 0.1)).toFixed(1),
//     totalProjects: 100 + (index * 10),
//     activeProjects: 10 + index,
//     leadTime: 14 + index,
//     minimumOrderValue: 500 + (index * 100)
//   }));

// // Projects (10 records) - Generate realistic projects
// const projects = Array.from({ length: 10 }, (_, index) => ({
//   _id: new mongoose.Types.ObjectId(),
//   customer: customers[index % customers.length]._id,
//   user: users.find(u => u.role === 'customer')._id,
//   supplier: suppliers[index % suppliers.length]._id,
//   admin: admins[index % admins.length]._id,
//   title: `Project ${index + 1} - ${['Aerospace', 'Automotive', 'Medical'][index % 3]} Components`,
//   description: `Manufacturing of specialized ${['bolts', 'brackets', 'gears'][index % 3]} for ${['aerospace', 'automotive', 'medical'][index % 3]} application`,
//   requirements: {
//     material: ["Titanium Grade 5", "Stainless Steel 316", "Aluminum 6061"][index % 3],
//     process: ["CNC Machining", "3D Printing", "Metal Stamping"][index % 3],
//     quantity: 1000 + (index * 500),
//     tolerance: "±0.00" + (index + 3),
//     finish: ["Anodized", "Passivated", "Powder Coated"][index % 3]
//   },
//   files: [{
//     name: `spec_${index + 1}.pdf`,
//     firebaseStorageUrl: `https://storage.firebase.com/spec_${index + 1}.pdf`,
//     downloadUrl: `https://download.com/spec_${index + 1}.pdf`,
//     fileType: "PDF",
//     category: "SPECIFICATION",
//     uploadedAt: new Date()
//   }],
//   status: ["AVAILABLE", "IN_PRODUCTION", "DELIVERED"][index % 3],
//   deliveryDate: new Date(Date.now() + (30 + index) * 24 * 60 * 60 * 1000)
// }));


// async function base() {
//   try {

//     connectDB();
//     // Clear existing data
//     await Promise.all([
//       User.deleteMany({}),
//       Admin.deleteMany({}),
//       Customer.deleteMany({}),
//       Supplier.deleteMany({}),
//       Project.deleteMany({}),
//       ProjectUpdate.deleteMany({}),
//       Quotation.deleteMany({})
//     ]);

//     // Insert new data
//     await Promise.all([
//       User.insertMany(users),
//       Admin.insertMany(admins),
//       Customer.insertMany(customers),
//       Supplier.insertMany(suppliers),
//       Project.insertMany(projects),
//     //   ProjectUpdate.insertMany(projectUpdates),
//     //   Quotation.insertMany(quotations)
//     ]);

//     console.log('Database seeded successfully');
//   } catch (error) {
//     console.error('Error seeding database:', error);
//   }
// }
// base();
//-==============================================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const Customer = require('../models/customerModel');
const Supplier = require('../models/supplierModel');
const Project = require('../models/projectModel');
const ProjectUpdate = require('../models/projectUpdateModel');
const Quotation = require('../models/quotationModel');
const connectDB = require('../config/dbConnection');

// Generate hashed password for '12345678'
const hashedPassword = bcrypt.hashSync('12345678', 10);

// Users (20 records)
const users = [
  ...Array.from({ length: 20 }, (_, index) => {
    const roles = ['customer', 'supplier', 'admin'];
    const role = roles[index % 3];
    return {
      _id: new mongoose.Types.ObjectId(),
      email: `${role}${index + 1}@example.com`,
      password: hashedPassword,
      role,
      firstName: [
        "John", "Jane", "Mike", "Sarah", "Robert", "Emily", "David", "Lisa", "Thomas", "Mary",
        "Alex", "Sophie", "Chris", "Anna", "James", "Laura", "Peter", "Kate", "Mark", "Rachel"
      ][index],
      lastName: [
        "Doe", "Smith", "Johnson", "Wilson", "Brown", "Davis", "Miller", "Taylor", "Anderson", "White",
        "Lee", "Clark", "Harris", "Lewis", "Walker", "Hall", "Allen", "Young", "King", "Scott"
      ][index],
      phoneNumber: `+12345678${index.toString().padStart(2, '0')}`,
      company: [
        "ABC Corp", "XYZ Manufacturing", "Fastners Admin", "DEF Industries", "Quality Parts Co",
        "GHI Solutions", "Precision Parts", "Fastners Admin", "JKL Corp", "Elite Manufacturing",
        "Tech Innovations", "BuildEasy Inc", "AeroTech", "MediParts", "AutoWorks",
        "SteelCraft", "ProFab", "GreenTech", "NanoCorp", "SwiftParts"
      ][index],
      isVerified: true,
    };
  })
];

// Admins (filtered from users, up to 7 based on role distribution)
const admins = users
  .filter(u => u.role === 'admin')
  .map((user, index) => ({
    _id: new mongoose.Types.ObjectId(),
    user: user._id,
    department: ["Operations", "Quality Control", "Logistics", "Engineering"][index % 4],
    accessLevel: (index % 3) + 1, // 1, 2, or 3
  }));

// Customers (filtered from users, up to 7 based on role distribution)
const customers = users
  .filter(u => u.role === 'customer')
  .map((user, index) => ({
    _id: new mongoose.Types.ObjectId(),
    user: user._id,
    shippingAddresses: [{
      addressLine1: `${100 + index * 10} Main St`,
      city: ["Boston", "Chicago", "Houston", "Seattle", "Miami", "Denver", "Phoenix"][index % 7],
      state: ["MA", "IL", "TX", "WA", "FL", "CO", "AZ"][index % 7],
      country: "USA",
      zipCode: `021${index.toString().padStart(2, '0')}`,
    }],
    billingAddress: {
      addressLine1: `${100 + index * 10} Main St`,
      city: ["Boston", "Chicago", "Houston", "Seattle", "Miami", "Denver", "Phoenix"][index % 7],
      state: ["MA", "IL", "TX", "WA", "FL", "CO", "AZ"][index % 7],
      country: "USA",
      zipCode: `021${index.toString().padStart(2, '0')}`,
    },
    preferredPaymentMethod: ["credit_card", "paypal", "bank_transfer", "net_30"][index % 4],
  }));

// Suppliers (filtered from users, up to 6 based on role distribution)
const suppliers = users
  .filter(u => u.role === 'supplier')
  .map((user, index) => ({
    _id: new mongoose.Types.ObjectId(),
    user: user._id,
    companyName: user.company,
    companyAddress: `${500 + index * 10} Industry Ave, ${["Chicago", "Houston", "Boston", "Seattle", "Phoenix", "Denver"][index % 6]}, ${["IL", "TX", "MA", "WA", "AZ", "CO"][index % 6]} ${60000 + index}`,
    taxId: `TAX-${20000 + index}`,
    manufacturingCapabilities: [
      ["CNC Machining", "3D Printing"],
      ["Metal Stamping", "Threading"],
      ["Injection Molding", "Welding"],
      ["Laser Cutting", "Casting"],
      ["Forging", "Assembly"],
      ["Surface Finishing", "Prototyping"]
    ][index % 6],
    certifications: [
      ["ISO 9001"], ["AS9100D"], ["ISO 13485"],
      ["ISO 14001"], ["IATF 16949"], ["ISO 9001", "AS9100D"]
    ][index % 6],
    rating: (3.5 + (index * 0.2)).toFixed(1),
    totalProjects: 50 + (index * 20),
    activeProjects: 5 + (index * 2),
    leadTime: 10 + (index * 2),
    minimumOrderValue: 300 + (index * 100),
  }));

// Projects (20 records)
const projects = Array.from({ length: 20 }, (_, index) => ({
  _id: new mongoose.Types.ObjectId(),
  customer: customers[index % customers.length]._id,
  user: customers[index % customers.length].user,
  supplier: suppliers[index % suppliers.length]._id,
  admin: admins[index % admins.length]._id,
  title: `Project ${index + 1} - ${["Aerospace", "Automotive", "Medical", "Industrial", "Electronics"][index % 5]} Parts`,
  description: `Production of ${["fasteners", "brackets", "gears", "housings", "connectors"][index % 5]} for ${["aerospace", "automotive", "medical", "industrial", "electronics"][index % 5]} use`,
  requirements: {
    material: ["Titanium Grade 5", "Stainless Steel 316", "Aluminum 6061", "PEEK", "Brass C360"][index % 5],
    process: ["CNC Machining", "3D Printing", "Metal Stamping", "Injection Molding", "Laser Cutting"][index % 5],
    quantity: 500 + (index * 250),
    tolerance: `±0.00${2 + (index % 4)}`,
    finish: ["Anodized", "Passivated", "Powder Coated", "Polished", "Bead Blasted"][index % 5],
  },
  files: [{
    name: `design_${index + 1}.${["pdf", "stl", "step", "dxf"][index % 4]}`,
    firebaseStorageUrl: `https://storage.firebase.com/design_${index + 1}.${["pdf", "stl", "step", "dxf"][index % 4]}`,
    downloadUrl: `https://download.com/design_${index + 1}.${["pdf", "stl", "step", "dxf"][index % 4]}`,
    fileType: ["PDF", "STL", "STEP", "DXF"][index % 4],
    category: ["SPECIFICATION", "3D_MODEL", "DRAWING", "OTHER"][index % 4],
    uploadedAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)),
  }],
  status: ["AVAILABLE", "IN_PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED"][index % 5],
  deliveryDate: new Date(Date.now() + (20 + index) * 24 * 60 * 60 * 1000),
}));

// Project Updates (20 records)
const projectUpdates = Array.from({ length: 20 }, (_, index) => ({
  _id: new mongoose.Types.ObjectId(),
  project: projects[index]._id,
  supplier: projects[index].supplier,
  description: [
    "Material procurement completed",
    "CNC machining in progress",
    "Quality inspection underway",
    "Parts shipped to customer",
    "Final assembly completed"
  ][index % 5],
  status: ["PENDING", "IN_PROGRESS", "COMPLETED"][index % 3],
  completionPercentage: (index + 1) * 5,
  attachments: index % 2 === 0 ? [{
    name: `update_${index + 1}.jpg`,
    firebaseStorageUrl: `https://storage.firebase.com/update_${index + 1}.jpg`,
    downloadUrl: `https://download.com/update_${index + 1}.jpg`,
    fileType: "JPG",
    category: "IMAGE",
    size: 1024 * (index + 1),
    uploadedAt: new Date(),
  }] : [],
}));

// Quotations (20 records)
const quotations = Array.from({ length: 20 }, (_, index) => ({
  _id: new mongoose.Types.ObjectId(),
  project: projects[index]._id,
  supplier: projects[index].supplier,
  unitPrice: 10 + (index * 2),
  quantity: projects[index].requirements.quantity,
  subtotal: (10 + (index * 2)) * projects[index].requirements.quantity,
  taxes: (10 + (index * 2)) * projects[index].requirements.quantity * 0.1,
  shippingCost: 50 + (index * 10),
  totalPrice: ((10 + (index * 2)) * projects[index].requirements.quantity * 1.1) + (50 + (index * 10)),
  currency: "USD",
  leadTime: 10 + (index % 5),
  validUntil: new Date(Date.now() + (30 + index) * 24 * 60 * 60 * 1000),
  status: ["PENDING", "ACCEPTED", "REJECTED"][index % 3],
}));

async function seed() {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Admin.deleteMany({}),
      Customer.deleteMany({}),
      Supplier.deleteMany({}),
      Project.deleteMany({}),
      ProjectUpdate.deleteMany({}),
      Quotation.deleteMany({}),
    ]);

    // Insert new data
    await Promise.all([
      User.insertMany(users),
      Admin.insertMany(admins),
      Customer.insertMany(customers),
      Supplier.insertMany(suppliers),
      Project.insertMany(projects),
      ProjectUpdate.insertMany(projectUpdates),
      Quotation.insertMany(quotations),
    ]);

    console.log('Database seeded successfully with 20 records per model');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seed();