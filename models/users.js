"use strict";
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordhash: DataTypes.STRING,
    isAdmin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  });
  User.beforeCreate((user, _) => {
    return user.id = uuidv4();
  });
  return User;
};