import dotenv from "dotenv";
import { connectDB } from "./src/db/index.js";
import { app } from "./app.js";
dotenv.config({ path: "./.env" });
await connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("App error:", error);
      process.exit(1);
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
