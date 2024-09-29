import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize(
  "blmlq2chfnycylmfnd2m",
  "ut8xpdqb0yga0omf",
  "KKS2BFKj8LGrUvaqg58K",
  {
    host: "blmlq2chfnycylmfnd2m-mysql.services.clever-cloud.com",
    dialect: "mysql",
    port: 3306,
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
