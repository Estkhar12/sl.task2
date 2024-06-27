import express from "express";
import mongoose from "mongoose";
import userRoute from "./src/routes/user.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(express.json());

app.use("/api/user", userRoute);

mongoose.connect(process.env.MONGODB);

//Handling connection events
const db = mongoose.connection;

db.once("open", () => {
  console.log("Database connection is successfull");
});

const port = 3000;
app.listen(port, () => {
  console.log(`server is running on ${port}..`);
});
