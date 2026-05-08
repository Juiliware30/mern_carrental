import mongoose from "mongoose";
import "dotenv/config";
import User from "./models/User.js";
import bcrypt from "bcrypt";

const ensureAdmin = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully!");

    const adminEmail = "cartrentaladmin@gmail.com";
    const adminPassword = "Pass@12345";
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log("Admin user already exists. Updating password and role...");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "owner";
      await existingAdmin.save();
      console.log("Admin user updated successfully!");
    } else {
      console.log("Creating new admin user...");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = new User({
        name: "Car Rental Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "owner"
      });
      await newAdmin.save();
      console.log("Admin user created successfully!");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    mongoose.connection.close();
  }
};

ensureAdmin();
