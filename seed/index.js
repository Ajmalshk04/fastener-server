// const mongoose = require("mongoose");
// const config = require("../config/config"); // Adjust the path as needed
// const bcrypt = require("bcryptjs");
// // Import your models
// const User = require("../models/userModel");
// const Customer = require("../models/customerModel");
// const Admin = require("../models/adminModel");
// const Supplier = require("../models/supplierModel");
// const Project = require("../models/projectModel");
// const ProjectUpdate = require("../models/projectUpdateModel");
// const Quotation = require("../models/quotationModel");

// // Connect to MongoDB
// mongoose.connect(config.MONGO_URI);

// // Function to hash password
// const hashPassword = async (password) => {
//   const salt = await bcrypt.genSalt(10);
//   return bcrypt.hash(password, salt);
// };

// // Seed data
// const seedData = async () => {
//   try {
//     // Clear existing data
// await User.deleteMany();
// await Customer.deleteMany();
// await Admin.deleteMany();
// await Supplier.deleteMany();
// await Project.deleteMany();
// await ProjectUpdate.deleteMany();
// await Quotation.deleteMany();

//     // Seed Users
//     const users = [
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e6f"),
//         email: "john@example.com",
//         password: await hashPassword("12345"),
//         role: "customer",
//         firstName: "John",
//         lastName: "Doe",
//         phoneNumber: "+1234567890",
//         company: "ABC Corp",
//         isVerified: true,
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e70"),
//         email: "jane@example.com",
//         password: await hashPassword("12345"),
//         role: "admin",
//         firstName: "Jane",
//         lastName: "Smith",
//         phoneNumber: "+1987654321",
//         company: "Fastners Inc",
//         isVerified: true,
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e71"),
//         email: "bob@supplier.com",
//         password: await hashPassword("12345"),
//         role: "supplier",
//         firstName: "Bob",
//         lastName: "Johnson",
//         phoneNumber: "+1122334455",
//         company: "Parts Co",
//         isVerified: true,
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e78"),
//         email: "alice@customer.com",
//         password: await hashPassword("12345"),
//         role: "customer",
//         firstName: "Alice",
//         lastName: "Brown",
//         phoneNumber: "+1231231234",
//         company: "XYZ Industries",
//         isVerified: true,
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e79"),
//         email: "charlie@supplier.com",
//         password: await hashPassword("12345"),
//         role: "supplier",
//         firstName: "Charlie",
//         lastName: "Davis",
//         phoneNumber: "+1567567567",
//         company: "Precision Manufacturing",
//         isVerified: true,
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e80"),
//         email: "diana@supplier.com",
//         password: await hashPassword("12345"),
//         role: "supplier",
//         firstName: "Diana",
//         lastName: "Evans",
//         phoneNumber: "+1890890890",
//         company: "Quality Fasteners",
//         isVerified: true,
//       },
//     ];
//     await User.insertMany(users);

//     // Seed Customers
//     const customers = [
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e72"),
//         user: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e6f"),
//         shippingAddresses: [
//           {
//             addressLine1: "123 Main St",
//             city: "Anytown",
//             state: "CA",
//             country: "USA",
//             zipCode: "12345",
//           },
//         ],
//         billingAddress: {
//           addressLine1: "456 Oak Ave",
//           city: "Somewhere",
//           state: "NY",
//           country: "USA",
//           zipCode: "67890",
//         },
//         preferredPaymentMethod: "Credit Card",
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e81"),
//         user: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e78"),
//         shippingAddresses: [
//           {
//             addressLine1: "789 Pine St",
//             city: "Tech City",
//             state: "TX",
//             country: "USA",
//             zipCode: "54321",
//           },
//         ],
//         billingAddress: {
//           addressLine1: "101 Cedar Rd",
//           city: "Techville",
//           state: "TX",
//           country: "USA",
//           zipCode: "54322",
//         },
//         preferredPaymentMethod: "Bank Transfer",
//       },
//     ];
//     await Customer.insertMany(customers);

//     // Seed Admin
//     const admins = [
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e73"),
//         user: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e70"),
//         department: "Operations",
//         accessLevel: 4,
//       },
//     ];
//     await Admin.insertMany(admins);

//     // Seed Suppliers
//     const suppliers = [
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e74"),
//         user: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e71"),
//         companyName: "Parts Co",
//         companyAddress: "789 Industrial Blvd, Manufacturing City, MN 54321",
//         taxId: "12-3456789",
//         manufacturingCapabilities: ["CNC Machining", "3D Printing"],
//         certifications: ["ISO 9001", "AS9100"],
//         rating: 4.5,
//         totalProjects: 50,
//         activeProjects: 5,
//         leadTime: 14,
//         minimumOrderValue: 1000,
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e82"),
//         user: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e79"),
//         companyName: "Precision Manufacturing",
//         companyAddress: "456 Precision Way, Exactville, CA 98765",
//         taxId: "98-7654321",
//         manufacturingCapabilities: ["Injection Molding", "Metal Stamping"],
//         certifications: ["ISO 9001", "IATF 16949"],
//         rating: 4.8,
//         totalProjects: 75,
//         activeProjects: 8,
//         leadTime: 10,
//         minimumOrderValue: 5000,
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e83"),
//         user: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e80"),
//         companyName: "Quality Fasteners",
//         companyAddress: "321 Bolt Street, Screwton, OH 45678",
//         taxId: "45-6789012",
//         manufacturingCapabilities: ["Threading", "Heat Treatment"],
//         certifications: ["ISO 9001"],
//         rating: 4.2,
//         totalProjects: 30,
//         activeProjects: 3,
//         leadTime: 7,
//         minimumOrderValue: 500,
//       },
//     ];
//     await Supplier.insertMany(suppliers);

//     // Seed Projects
//     const projects = [
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e75"),
//         customer: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e72"),
//         supplier: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e74"),
//         admin: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e73"),
//         title: "Custom Bolt Production",
//         description:
//           "Production of 1000 custom bolts for aerospace application",
//         requirements: {
//           material: "Titanium",
//           process: "CNC Machining",
//           quantity: 1000,
//           tolerance: "±0.005 inches",
//           finish: "Anodized",
//         },
//         files: [
//           {
//             name: "bolt_design.stp",
//             firebaseStorageUrl:
//               "https://firebasestorage.example.com/bolt_design.stp",
//             downloadUrl: "https://download.example.com/bolt_design.stp",
//             fileType: "STP",
//             category: "3D_MODEL",
//             size: 1024000,
//             uploadedAt: new Date("2023-07-01"),
//           },
//         ],
//         status: "IN_PRODUCTION",
//         deliveryDate: new Date("2023-08-15"),
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e84"),
//         customer: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e81"),
//         supplier: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e82"),
//         admin: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e73"),
//         title: "Custom Plastic Housings",
//         description:
//           "Production of 5000 custom plastic housings for electronic devices",
//         requirements: {
//           material: "ABS Plastic",
//           process: "Injection Molding",
//           quantity: 5000,
//           tolerance: "±0.02 inches",
//           finish: "Smooth",
//         },
//         files: [
//           {
//             name: "housing_design.step",
//             firebaseStorageUrl:
//               "https://firebasestorage.example.com/housing_design.step",
//             downloadUrl: "https://download.example.com/housing_design.step",
//             fileType: "STEP",
//             category: "3D_MODEL",
//             size: 2048000,
//             uploadedAt: new Date("2023-07-10"),
//           },
//         ],
//         status: "QUOTED",
//         deliveryDate: new Date("2023-09-30"),
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e85"),
//         customer: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e72"),
//         supplier: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e83"),
//         admin: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e73"),
//         title: "High-Strength Screws",
//         description:
//           "Production of 10000 high-strength screws for automotive use",
//         requirements: {
//           material: "Alloy Steel",
//           process: "Threading and Heat Treatment",
//           quantity: 10000,
//           tolerance: "±0.001 inches",
//           finish: "Black Oxide",
//         },
//         files: [
//           {
//             name: "screw_specs.pdf",
//             firebaseStorageUrl:
//               "https://firebasestorage.example.com/screw_specs.pdf",
//             downloadUrl: "https://download.example.com/screw_specs.pdf",
//             fileType: "PDF",
//             category: "SPECIFICATION",
//             size: 512000,
//             uploadedAt: new Date("2023-07-20"),
//           },
//         ],
//         status: "SUBMITTED",
//         deliveryDate: new Date("2023-10-15"),
//       },
//     ];
//     await Project.insertMany(projects);

//     // Seed Project Updates
//     const projectUpdates = [
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e76"),
//         project: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e75"),
//         supplier: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e74"),
//         description: "500 bolts completed, starting second batch",
//         status: "IN_PROGRESS",
//         attachments: [
//           {
//             name: "progress_report.pdf",
//             firebaseStorageUrl:
//               "https://firebasestorage.example.com/progress_report.pdf",
//             downloadUrl: "https://download.example.com/progress_report.pdf",
//             fileType: "PDF",
//             category: "OTHER",
//             size: 512000,
//             uploadedAt: new Date("2023-07-15"),
//           },
//         ],
//         createdAt: new Date("2023-07-15"),
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e86"),
//         project: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e84"),
//         supplier: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e82"),
//         description: "Mold design completed, awaiting customer approval",
//         status: "PENDING",
//         createdAt: new Date("2023-07-15"),
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e87"),
//         project: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e85"),
//         supplier: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e83"),
//         description: "Material sourcing completed, production to start soon",
//         status: "PENDING",
//         createdAt: new Date("2023-07-25"),
//       },
//     ];
//     await ProjectUpdate.insertMany(projectUpdates);

//     // Seed Quotations
//     const quotations = [
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e77"),
//         project: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e75"),
//         supplier: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e71"),
//         unitPrice: 50,
//         quantity: 1000,
//         subtotal: 50000,
//         taxes: 5000,
//         shippingCost: 500,
//         totalPrice: 55500,
//         currency: "USD",
//         leadTime: 30,
//         validUntil: new Date("2023-08-31"),
//         status: "ACCEPTED",
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e88"),
//         project: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e84"),
//         supplier: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e79"),
//         unitPrice: 2,
//         quantity: 5000,
//         subtotal: 10000,
//         taxes: 800,
//         shippingCost: 200,
//         totalPrice: 11000,
//         currency: "USD",
//         leadTime: 45,
//         validUntil: new Date("2023-08-31"),
//         status: "PENDING",
//       },
//       {
//         _id: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e89"),
//         project: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e85"),
//         supplier: new mongoose.Types.ObjectId("5f8d0f5b9d3f2a1b3c4d5e80"),
//         unitPrice: 0.5,
//         quantity: 10000,
//         subtotal: 5000,
//         taxes: 400,
//         shippingCost: 100,
//         totalPrice: 5500,
//         currency: "USD",
//         leadTime: 30,
//         validUntil: new Date("2023-09-15"),
//         status: "PENDING",
//       },
//     ];
//     await Quotation.insertMany(quotations);

//     console.log("Data seeded successfully");
//   } catch (error) {
//     console.error("Error seeding data:", error);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// seedData();
//===================================================
const mongoose = require("mongoose");
// const { faker } = require("@faker-js/faker");
// const Admin = require("../models/adminModel");
// const Customer = require("../models/customerModel");
// const Project = require("../models/projectModel");
// const ProjectUpdate = require("../models/projectUpdateModel");
// const Quotation = require("../models/quotationModel");
// const Supplier = require("../models/supplierModel");
// const User = require("../models/userModel");
// const bcrypt = require("bcryptjs");
// // Connect to your MongoDB database
// mongoose.connect("mongodb://localhost:27017/Fastener-new");

// const seedData = async () => {
//   await User.deleteMany();
//   await Customer.deleteMany();
//   await Admin.deleteMany();
//   await Supplier.deleteMany();
//   await Project.deleteMany();
//   await ProjectUpdate.deleteMany();
//   await Quotation.deleteMany();
//   // Hash the same password for all users
//   const hashedPassword = await bcrypt.hash("12345678", 10);

//   // Seed Users
//   const users = [];
//   for (let i = 0; i < 25; i++) {
//     const user = new User({
//       email: faker.internet.email(),
//       password: hashedPassword,
//       role: faker.helpers.arrayElement(["customer", "supplier"]),
//       firstName: faker.person.firstName(),
//       lastName: faker.person.lastName(),
//       phoneNumber: faker.phone.number(),
//       company: faker.company.name(),
//       isVerified: faker.datatype.boolean(),
//       otp: {
//         code: faker.string.numeric(6),
//         expiresAt: faker.date.future(),
//       },
//     });
//     users.push(user);
//   }

//   await User.insertMany(users);

//   // Seed Admins
//   const admins = [];
//   for (let i = 0; i < 25; i++) {
//     const admin = new Admin({
//       user: users[i]._id,
//       department: faker.commerce.department(),
//       accessLevel: faker.number.int({ min: 1, max: 5 }),
//     });
//     admins.push(admin);
//   }

//   await Admin.insertMany(admins);

//   // Seed Customers
//   const customers = [];
//   for (let i = 0; i < 25; i++) {
//     const customer = new Customer({
//       user: users[i]._id,
//       shippingAddresses: [
//         {
//           addressLine1: faker.location.streetAddress(),
//           addressLine2: faker.location.secondaryAddress(),
//           city: faker.location.city(),
//           state: faker.location.state(),
//           country: faker.location.country(),
//           zipCode: faker.location.zipCode(),
//         },
//       ],
//       billingAddress: {
//         addressLine1: faker.location.streetAddress(),
//         addressLine2: faker.location.secondaryAddress(),
//         city: faker.location.city(),
//         state: faker.location.state(),
//         country: faker.location.country(),
//         zipCode: faker.location.zipCode(),
//       },
//       preferredPaymentMethod: faker.helpers.arrayElement([
//         "Credit Card",
//         "PayPal",
//         "Bank Transfer",
//       ]),
//     });
//     customers.push(customer);
//   }

//   await Customer.insertMany(customers);

//   // Seed Suppliers
//   const suppliers = [];
//   for (let i = 0; i < 25; i++) {
//     const supplier = new Supplier({
//       user: users[i]._id,
//       companyName: faker.company.name(),
//       companyAddress: faker.location.streetAddress(),
//       taxId: faker.finance.account(),
//       manufacturingCapabilities: faker.helpers.arrayElements(
//         ["CNC Machining", "Injection Molding", "Sheet Metal Fabrication"],
//         2
//       ),
//       certifications: faker.helpers.arrayElements(
//         ["ISO 9001", "ISO 14001", "AS9100"],
//         2
//       ),
//       rating: faker.number.int({ min: 1, max: 5 }),
//       totalProjects: faker.number.int({ min: 1, max: 100 }),
//       activeProjects: faker.number.int({ min: 0, max: 20 }),
//       leadTime: faker.number.int({ min: 1, max: 60 }),
//       minimumOrderValue: faker.finance.amount(100, 1000, 2),
//     });
//     suppliers.push(supplier);
//   }

//   await Supplier.insertMany(suppliers);

//   // Seed Projects
//   const projects = [];
//   for (let i = 0; i < 25; i++) {
//     const project = new Project({
//       customer: customers[i]._id,
//       user: users[i]._id,
//       supplier: suppliers[i]._id,
//       admin: admins[i]._id,
//       title: faker.commerce.productName(),
//       description: faker.lorem.sentences(),
//       requirements: {
//         material: faker.commerce.productMaterial(),
//         process: faker.helpers.arrayElement([
//           "Casting",
//           "Machining",
//           "Molding",
//         ]),
//         quantity: faker.number.int({ min: 1, max: 1000 }),
//         tolerance: faker.helpers.arrayElement(["0.01mm", "0.05mm", "0.1mm"]),
//         finish: faker.helpers.arrayElement(["Polished", "Anodized", "Painted"]),
//       },
//       files: [
//         {
//           name: faker.system.fileName(),
//           firebaseStorageUrl: faker.internet.url(),
//           downloadUrl: faker.internet.url(),
//           fileType: faker.helpers.arrayElement([
//             "3DMXL",
//             "3MF",
//             "DXF",
//             "SAT",
//             "SLDPRT",
//             "STL",
//             "STP",
//             "STEP",
//             "GIF",
//             "JPEG",
//             "JPG",
//             "PNG",
//             "PDF",
//             "DWG",
//             "IGES",
//             "POF",
//           ]),
//           category: faker.helpers.arrayElement([
//             "3D_MODEL",
//             "DRAWING",
//             "SPECIFICATION",
//             "IMAGE",
//             "OTHER",
//           ]),
//           uploadedAt: faker.date.past(),
//         },
//       ],
//       status: faker.helpers.arrayElement([
//         "QUOTED",
//         "AVAILABLE",
//         "IN_PRODUCTION",
//         "SHIPPED",
//         "DELIVERED",
//         "CANCELLED",
//       ]),
//       deliveryDate: faker.date.future(),
//     });
//     projects.push(project);
//   }

//   await Project.insertMany(projects);

//   // Seed Project Updates
//   const projectUpdates = [];
//   for (let i = 0; i < 25; i++) {
//     const projectUpdate = new ProjectUpdate({
//       project: projects[i]._id,
//       supplier: suppliers[i]._id,
//       description: faker.lorem.sentence(),
//       status: faker.helpers.arrayElement([
//         "PENDING",
//         "IN_PROGRESS",
//         "COMPLETED",
//       ]),
//       attachments: [
//         {
//           name: faker.system.fileName(),
//           firebaseStorageUrl: faker.internet.url(),
//           downloadUrl: faker.internet.url(),
//           fileType: faker.helpers.arrayElement([
//             "3DMXL",
//             "3MF",
//             "DXF",
//             "SAT",
//             "SLDPRT",
//             "STL",
//             "STP",
//             "STEP",
//             "GIF",
//             "JPEG",
//             "JPG",
//             "PNG",
//             "PDF",
//             "DWG",
//             "IGES",
//             "POF",
//           ]),
//           category: faker.helpers.arrayElement([
//             "3D_MODEL",
//             "DRAWING",
//             "SPECIFICATION",
//             "IMAGE",
//             "OTHER",
//           ]),
//           size: faker.number.int({ min: 100, max: 5000 }),
//           uploadedAt: faker.date.past(),
//         },
//       ],
//     });
//     projectUpdates.push(projectUpdate);
//   }

//   await ProjectUpdate.insertMany(projectUpdates);

//   // Seed Quotations
//   const quotations = [];
//   for (let i = 0; i < 25; i++) {
//     const quotation = new Quotation({
//       project: projects[i]._id,
//       supplier: suppliers[i]._id,
//       unitPrice: faker.finance.amount(10, 1000, 2),
//       quantity: faker.number.int({ min: 1, max: 100 }),
//       subtotal: faker.finance.amount(100, 10000, 2),
//       taxes: faker.finance.amount(0, 500, 2),
//       shippingCost: faker.finance.amount(10, 100, 2),
//       totalPrice: faker.finance.amount(100, 12000, 2),
//       currency: "USD",
//       leadTime: faker.number.int({ min: 1, max: 30 }),
//       validUntil: faker.date.future(),
//       status: faker.helpers.arrayElement(["PENDING", "ACCEPTED", "REJECTED"]),
//     });
//     quotations.push(quotation);
//   }

//   await Quotation.insertMany(quotations);

//   console.log("Data seeded successfully!");
//   mongoose.connection.close();
// };

// seedData();
//===================================================
const { faker } = require("@faker-js/faker");
const Admin = require("../models/adminModel");
const Customer = require("../models/customerModel");
const Project = require("../models/projectModel");
const ProjectUpdate = require("../models/projectUpdateModel");
const Quotation = require("../models/quotationModel");
const Supplier = require("../models/supplierModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Connect to your MongoDB database
mongoose.connect("mongodb://localhost:27017/Fastener-new");

const seedData = async () => {
  await User.deleteMany();
  await Customer.deleteMany();
  await Admin.deleteMany();
  await Supplier.deleteMany();
  await Project.deleteMany();
  await ProjectUpdate.deleteMany();
  await Quotation.deleteMany();

  // Hash the same password for all users
  const hashedPassword = await bcrypt.hash("12345678", 10);

  // Seed Users
  const users = [];
  const admins = [];
  const adminCount = faker.number.int({ min: 4, max: 5 });

  for (let i = 0; i < 25; i++) {
    const role =
      i < adminCount
        ? "admin"
        : faker.helpers.arrayElement(["customer", "supplier"]);
    const user = new User({
      email: faker.internet.email(),
      password: hashedPassword,
      role,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number(),
      company: faker.company.name(),
      isVerified: faker.datatype.boolean(),
      otp: {
        code: faker.string.numeric(6),
        expiresAt: faker.date.future(),
      },
    });
    users.push(user);

    // Create Admins only for the first few users
    if (i < adminCount) {
      const admin = new Admin({
        user: user._id,
        department: faker.commerce.department(),
        accessLevel: faker.number.int({ min: 1, max: 5 }),
      });
      admins.push(admin);
    }
  }

  await User.insertMany(users);
  await Admin.insertMany(admins);

  // Seed Customers
  const customers = [];
  for (let i = adminCount; i < adminCount + 20; i++) {
    // Start from adminCount to avoid overwriting admin users
    const customer = new Customer({
      user: users[i]._id,
      shippingAddresses: [
        {
          addressLine1: faker.location.streetAddress(),
          addressLine2: faker.location.secondaryAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          zipCode: faker.location.zipCode(),
        },
      ],
      billingAddress: {
        addressLine1: faker.location.streetAddress(),
        addressLine2: faker.location.secondaryAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        zipCode: faker.location.zipCode(),
      },
      preferredPaymentMethod: faker.helpers.arrayElement([
        "Credit Card",
        "PayPal",
        "Bank Transfer",
      ]),
    });
    customers.push(customer);
  }

  await Customer.insertMany(customers);

  // Seed Suppliers
  const suppliers = [];
  for (let i = adminCount; i < adminCount + 20; i++) {
    // Start from adminCount to avoid overwriting admin users
    const supplier = new Supplier({
      user: users[i]._id,
      companyName: faker.company.name(),
      companyAddress: faker.location.streetAddress(),
      taxId: faker.finance.account(),
      manufacturingCapabilities: faker.helpers.arrayElements(
        ["CNC Machining", "Injection Molding", "Sheet Metal Fabrication"],
        2
      ),
      certifications: faker.helpers.arrayElements(
        ["ISO 9001", "ISO 14001", "AS9100"],
        2
      ),
      rating: faker.number.int({ min: 1, max: 5 }),
      totalProjects: faker.number.int({ min: 1, max: 100 }),
      activeProjects: faker.number.int({ min: 0, max: 20 }),
      leadTime: faker.number.int({ min: 1, max: 60 }),
      minimumOrderValue: faker.finance.amount(100, 1000, 2),
    });
    suppliers.push(supplier);
  }

  await Supplier.insertMany(suppliers);

  // Seed Projects
  const projects = [];
  for (let i = adminCount; i < adminCount + 20; i++) {
    // Start from adminCount to avoid overwriting admin users
    const project = new Project({
      customer: customers[i - adminCount]._id,
      user: users[i]._id,
      supplier: suppliers[i - adminCount]._id,
      admin: admins[i % adminCount]._id, // Assign admin in round-robin fashion
      title: faker.commerce.productName(),
      description: faker.lorem.sentences(),
      requirements: {
        material: faker.commerce.productMaterial(),
        process: faker.helpers.arrayElement([
          "Casting",
          "Machining",
          "Molding",
        ]),
        quantity: faker.number.int({ min: 1, max: 1000 }),
        tolerance: faker.helpers.arrayElement(["0.01mm", "0.05mm", "0.1mm"]),
        finish: faker.helpers.arrayElement(["Polished", "Anodized", "Painted"]),
      },
      files: [
        {
          name: faker.system.fileName(),
          firebaseStorageUrl: faker.internet.url(),
          downloadUrl: faker.internet.url(),
          fileType: faker.helpers.arrayElement([
            "3DMXL",
            "3MF",
            "DXF",
            "SAT",
            "SLDPRT",
            "STL",
            "STP",
            "STEP",
            "GIF",
            "JPEG",
            "JPG",
            "PNG",
            "PDF",
            "DWG",
            "IGES",
            "POF",
          ]),
          category: faker.helpers.arrayElement([
            "3D_MODEL",
            "DRAWING",
            "SPECIFICATION",
            "IMAGE",
            "OTHER",
          ]),
          uploadedAt: faker.date.past(),
        },
      ],
      status: faker.helpers.arrayElement([
        "QUOTED",
        "AVAILABLE",
        "IN_PRODUCTION",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ]),
      deliveryDate: faker.date.future(),
    });
    projects.push(project);
  }

  await Project.insertMany(projects);

  // Seed Project Updates
  const projectUpdates = [];
  for (let i = adminCount; i < adminCount + 20; i++) {
    // Start from adminCount to avoid overwriting admin users
    const projectUpdate = new ProjectUpdate({
      project: projects[i - adminCount]._id,
      supplier: suppliers[i - adminCount]._id,
      description: faker.lorem.sentence(),
      status: faker.helpers.arrayElement([
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
      ]),
      attachments: [
        {
          name: faker.system.fileName(),
          firebaseStorageUrl: faker.internet.url(),
          downloadUrl: faker.internet.url(),
          fileType: faker.helpers.arrayElement([
            "3DMXL",
            "3MF",
            "DXF",
            "SAT",
            "SLDPRT",
            "STL",
            "STP",
            "STEP",
            "GIF",
            "JPEG",
            "JPG",
            "PNG",
            "PDF",
            "DWG",
            "IGES",
            "POF",
          ]),
          category: faker.helpers.arrayElement([
            "3D_MODEL",
            "DRAWING",
            "SPECIFICATION",
            "IMAGE",
            "OTHER",
          ]),
          size: faker.number.int({ min: 100, max: 5000 }),
          uploadedAt: faker.date.past(),
        },
      ],
    });
    projectUpdates.push(projectUpdate);
  }

  await ProjectUpdate.insertMany(projectUpdates);

  // Seed Quotations
  const quotations = [];
  for (let i = adminCount; i < adminCount + 20; i++) {
    // Start from adminCount to avoid overwriting admin users
    const quotation = new Quotation({
      project: projects[i - adminCount]._id,
      supplier: suppliers[i - adminCount]._id,
      unitPrice: faker.finance.amount(10, 1000, 2),
      quantity: faker.number.int({ min: 1, max: 100 }),
      subtotal: faker.finance.amount(100, 10000, 2),
      taxes: faker.finance.amount(0, 500, 2),
      shippingCost: faker.finance.amount(10, 100, 2),
      totalPrice: faker.finance.amount(100, 12000, 2),
      currency: "USD",
      leadTime: faker.number.int({ min: 1, max: 30 }),
      validUntil: faker.date.future(),
      status: faker.helpers.arrayElement(["PENDING", "ACCEPTED", "REJECTED"]),
    });
    quotations.push(quotation);
  }

  await Quotation.insertMany(quotations);

  console.log("Seed data inserted successfully");
  process.exit();
};

seedData();
