import mongoose from "mongoose";
import "dotenv/config";
import Car from "./models/Car.js";
import User from "./models/User.js";

const dummyCars = [
  {
    "brand": "BMW",
    "model": "X5",
    "image": "car_image1.png",
    "year": 2006,
    "category": "SUV",
    "seating_capacity": 4,
    "fuel_type": "Hybrid",
    "transmission": "Semi-Automatic",
    "pricePerDay": 300,
    "location": "New York",
    "description": "The BMW X5 is a mid-size luxury SUV produced by BMW. The X5 made its debut in 1999 as the first SUV ever produced by BMW.",
    "isAvailable": true
  },
  {
    "brand": "Toyota",
    "model": "Corolla",
    "image": "car_image2.png",
    "year": 2021,
    "category": "Sedan",
    "seating_capacity": 4,
    "fuel_type": "Diesel",
    "transmission": "Manual",
    "pricePerDay": 130,
    "location": "Chicago",
    "description": "The Toyota Corolla is a mid-size luxury sedan produced by Toyota. The Corolla made its debut in 2008 as the first sedan ever produced by Toyota.",
    "isAvailable": true
  },
  {
    "brand": "Jeep",
    "model": "Wrangler",
    "image": "car_image3.png",
    "year": 2023,
    "category": "SUV",
    "seating_capacity": 4,
    "fuel_type": "Hybrid",
    "transmission": "Automatic",
    "pricePerDay": 200,
    "location": "Los Angeles",
    "description": "The Jeep Wrangler is a mid-size luxury SUV produced by Jeep. The Wrangler made its debut in 2003 as the first SUV ever produced by Jeep.",
    "isAvailable": true
  },
  {
    "brand": "Ford",
    "model": "Neo 6",
    "image": "car_image4.png",
    "year": 2022,
    "category": "Sedan",
    "seating_capacity": 2,
    "fuel_type": "Diesel",
    "transmission": "Semi-Automatic",
    "pricePerDay": 209,
    "location": "Houston",
    "description": "This is a mid-size luxury sedan produced by Ford. Features an upgraded interior and smooth ride mechanics.",
    "isAvailable": true
  },
  {
    "brand": "Audi",
    "model": "A6",
    "image": "main_car.png",
    "year": 2024,
    "category": "Sedan",
    "seating_capacity": 5,
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "pricePerDay": 250,
    "location": "Miami",
    "description": "The sleek Audi A6 offers a luxurious interior layout, high-tech features, and a powerful engine to deliver a top-notch driving experience.",
    "isAvailable": true
  },
  {
    "brand": "Porsche",
    "model": "Cayenne",
    "image": "banner_car_image.png",
    "year": 2023,
    "category": "SUV",
    "seating_capacity": 5,
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "pricePerDay": 400,
    "location": "San Francisco",
    "description": "A high-performance SUV delivering sports-car handling with all the practicality of an SUV. A thrilling drive guaranteed.",
    "isAvailable": true
  }
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully!");

    // Find the admin user to assign as owner
    const adminEmail = "cartrentaladmin@gmail.com";
    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.error("Admin user not found. Please run ensureAdmin.js first.");
      mongoose.connection.close();
      return;
    }

    console.log("Clearing existing cars...");
    await Car.deleteMany({});

    console.log("Inserting dummy data...");
    const carsWithOwner = dummyCars.map(car => ({
      ...car,
      owner: admin._id
    }));

    await Car.insertMany(carsWithOwner);
    console.log("Successfully inserted " + dummyCars.length + " cars into the database!");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting data:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
