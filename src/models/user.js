import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your username"],
    },
    email: {
      type: String,
      required: [true, "Email Id is required!"],
      unique:   [true, "Email Id is already exits!"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      min: 8,
      max: 16,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
