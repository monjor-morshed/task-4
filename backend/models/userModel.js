import { Sequelize, DataTypes } from "sequelize";
import configFile from "../config/config.json";
const config = configFile[process.env.NODE_ENV || "development"];
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastLogin: {
    type: DataTypes.DATE,
  },
  regestrationTime: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  status: {
    type: DataTypes.ENUM("active", "blocked"),
    defaultValue: "active",
  },
});

User.sync({ force: true });

export default User;
