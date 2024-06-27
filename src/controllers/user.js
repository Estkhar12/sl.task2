import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ message: "Token not found!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return res.status(500).json({ message: "User not found!" });
    }
    req.user = currentUser;
    res.locals.user = currentUser;

    next();
  } catch (error) {
    res.status(500).json(error);
  }
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    const saveUser = await newUser.save();
    res.status(200).json({
      message: "user is created",
      data: saveUser,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(401).json({
        message: "Email or Password is wrong!",
      });
    }
    const user = await User.findOne({ email });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        message: "Email or Password is wrong!",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      message: "user logedIn",
      data: user,
      accessToken: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, userId: req.userId });
    if (!user) return res.status(404).send("User is not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "current password is wrong!" });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(401)
        .json({ message: "new and confirm password is not same!" });
    }
    const hasPassword = await bcrypt.hash(newPassword, 12);
    const result = await User.findByIdAndUpdate(
      user._id,
      { password: hasPassword },
      { new: true }
    );
    res
      .status(201)
      .json({ message: "Password updated successfully!", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      error: error,
    });
  }
};
