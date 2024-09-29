import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
dotenv.config();
import db from "./models/userModel.js";
import path from "path";

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
  });
});

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");

    app.listen(5000, () => {
      console.log(`Server is running on port 5000`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
