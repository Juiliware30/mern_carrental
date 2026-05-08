import mongoose from "mongoose";
import "dotenv/config";
import User from "../../server/models/User.js";

const getAdminId = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const adminEmail = "cartrentaladmin@gmail.com";
    const admin = await User.findOne({ email: adminEmail });
    if (admin) {
      console.log("ADMIN_ID:" + admin._id);
    } else {
      console.log("ADMIN_NOT_FOUND");
    }
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

getAdminId();
