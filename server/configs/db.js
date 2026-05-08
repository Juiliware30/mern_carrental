import mongoose from "mongoose";

const connectDB =  async ()=>{
 if (!process.env.MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not defined in environment variables!");
    return;
 }
 try {
    //mongoose.connection gives access to the connection object.
    mongoose.connection.on('connected',()=> console.log("Database Connected"))
    await mongoose.connect(process.env.MONGO_URI)
 } catch (error) {
    console.error("❌ Database connection error:", error.message)
 }
}
export default connectDB;