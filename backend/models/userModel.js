import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize(
  MYSQL_ADDON_DB,
  MYSQL_ADDON_USER,
  MYSQL_ADDON_PASSWORD,
  {
    host: MYSQL_ADDON_HOST,
    dialect: "mysql",
  }
);
const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
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
  registrationTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "blocked"),
    defaultValue: "active",
  },
});
User.sync({});
export default User;
