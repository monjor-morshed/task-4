import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
export const signup = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const existingUser = await User.findOne({ where: { email: email } });
  if (existingUser) {
    return next(errorHandler(400, "User already exists"));
  }
  const newUser = new User({
    userName,
    email,
    password: hashedPassword,
    registrationTime: new Date(),
  });
  try {
    await newUser.save();
    res.status(201).json({
      message: "Signup success!",
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ where: { email: email } });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    if (validUser.status === "blocked") {
      return next(errorHandler(404, "User Blocked"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    await User.update({ lastLogin: new Date() }, { where: { email: email } });
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const expiryDate = new Date(Date.now() + 3600000);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDate,
      })
      .status(200)
      .json({
        message: "Signin success!",
        token,
        validUser,
      });
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie("access_token").json("Signout success!");
};
