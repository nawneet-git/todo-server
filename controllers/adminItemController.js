const sequelize = require("../db");
const ListItemModel = sequelize.import("../models/listItem");
const UserModel = sequelize.import("../models/users");
const express = require("express");

const adminListController = express.Router();

adminListController.get("/admin_list_todo/:id", async (req, res) => {
  if (req.user.isAdmin == false) {
    res.status(403).json({
      message: `You do not have access of this.`,
    });
    return;
  }
  ListItemModel.findAll({
    where: { user_id: req.params.id }
  }).then((data) => {
    res.status(201).json({
      message: "Success: Item Fetched!",
      data: data,
    });
  }).catch((err) => {
    console.log("Some error occured : ", err);
    res.status(500).json({
      message: `Error Item is not Fetched: ${err}`,
    })
  });
});


adminListController.get("/admin_list_user", async (req, res) => {

  if (req.user.isAdmin == false) {
    res.status(403).json({
      message: `You do not have access of this.`,
    });
    return;
  }

  UserModel.findAll({}).then((data) => {
    res.status(201).json({
      message: "Success: Item Fetched!",
      data: data,
    });
  }).catch((err) => {
    console.log("Some error occured : ", err);
    res.status(500).json({
      message: `Error Item is not Fetched: ${err}`,
    })
  });
});


adminListController.get("/admin_list_all_todo", async (req, res) => {

  if (req.user.isAdmin == false) {
    res.status(403).json({
      message: `You do not have access of this.`,
    });
    return;
  }

  ListItemModel.findAll({}).then((data) => {
    res.status(201).json({
      message: "Success: Item Fetched!",
      data: data,
    });
  }).catch((err) => {
    console.log("Some error occured : ", err);
    res.status(500).json({
      message: `Error Item is not Fetched: ${err}`,
    })
  });
});


module.exports = adminListController;
