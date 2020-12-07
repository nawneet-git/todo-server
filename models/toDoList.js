"use strict";
const uuid = require("uuid").v4;
module.exports = (sequelize, DataTypes) => {
  const toDoList = sequelize.define(
    "toDoList",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
  toDoList.addHook("beforeCreate", (obj) => {
    obj.id = uuid();
  });
  return toDoList;
};
