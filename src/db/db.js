import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URL}/${process.env.DB_NAME}`
    );
    console.log(
      "Connected to MongoDB. Host:",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error("Error while connecting to database:", error.message);
    throw error;
  }
};

export { connectDB };
