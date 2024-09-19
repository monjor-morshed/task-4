import User from "../models/userModel.js";
import { Op } from "sequelize";
import { errorHandler } from "../utils/error.js";
export const userController = (req, res, next) => {
  res.json({
    message: "Worked!",
  });
};
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { status, id } = req.body;

  if (!id || (Array.isArray(id) && id.length === 0)) {
    return res.status(400).json({ error: "User ID(s) missing!" });
  }

  try {
    if (Array.isArray(id)) {
      const updatedUsers = await User.update(
        { status: status },
        { where: { id: { [Op.in]: id } } }
      );
    } else {
      const updatedUser = await User.update(
        { status: status },
        { where: { id: id } }
      );
    }

    res.status(200).json({
      status: "Success",
      message: "User status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  const { id } = req.body;
  if (!id || (Array.isArray(id) && id.length === 0)) {
    return next(errorHandler(400, "User ID(s) missing!"));
  }
  try {
    if (Array.isArray(id)) {
      await User.destroy({ where: { id: { [Op.in]: id } } });
    } else {
      await User.destroy({ where: { id: id } });
    }

    res.status(200).json("User(s) has been deleted!");
  } catch (error) {
    next(error);
  }
};
