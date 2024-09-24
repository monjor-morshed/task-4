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

const validateIds = (id, next) => {
  if (!id || (Array.isArray(id) && id.length === 0)) {
    return next(errorHandler(400, "User ID(s) missing!"));
  }
};

export const updateUser = async (req, res, next) => {
  const { status, id } = req.body;

  validateIds(id, next);

  const ids = Array.isArray(id) ? id : [id];

  try {
    await User.update({ status: status }, { where: { id: { [Op.in]: ids } } });

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

  validateIds(id, next);

  const ids = Array.isArray(id) ? id : [id];

  try {
    await User.destroy({ where: { id: { [Op.in]: ids } } });

    res.status(200).json({
      status: "Success",
      message: "User(s) has been deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};
