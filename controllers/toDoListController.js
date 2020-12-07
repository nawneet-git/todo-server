const sequelize = require("../db");
const toDoListModel = sequelize.import("../models/toDoList");
const validateUser = require("../middleware/validate-session");
const express = require("express");

const listItemController = express.Router();

// /**************************
//  * CREATE  ITEM
//  **************************

listItemController.post("/additem", validateUser, async (req, res) => {
  try {
    const { title } = req.body;
    const data = await toDoListModel.create({
      title,
      userId: req.user.id,
    });
    res.status(201).json({
      message: "Success: Item created!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error Item is not added: ${error}`,
    });
  }
});

// Update Item
listItemController.put("/update/:id", validateUser, async (req, res) => {
  try {
    const payload = req.body;
    const { id } = req.params;
    await toDoListModel.update(payload, {
      where: { id, userId: req.user.id },
    });
    res.status(200).json({ message: "Item successfully updated" });
  } catch (error) {
    res.status(500).json({
      message: `Error Item not updated: ${error}`,
    });
  }
});

// get Item
listItemController.get("/get/:id", validateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await toDoListModel.findOne({
      where: { id, userId: req.user.id },
    });
    if (data) res.status(200).json({ message: "success", data });
    else res.status(404).json({ message: "data not found" });
  } catch (error) {
    res.status(500).json({
      message: `Error: ${error}`,
    });
  }
});

// get all item
listItemController.get("/getAllByUser", validateUser, async (req, res) => {
  try {
    const { status } = req.query;
    const data = await toDoListModel.findAll({
      where: { userId: req.user.id, status },
    });
    if (data) res.status(200).json({ message: "success", data });
    else res.status(404).json({ message: "data not found" });
  } catch (error) {
    res.status(500).json({
      message: `Error: ${error}`,
    });
  }
});

// get all item for admin
listItemController.get("/getAll", validateUser, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      let where = {};
      const { status, users } = req.query;
      if (status) where.status = status;
      if (users) where.userId = users;
      const data = await toDoListModel.findAll({
        where,
      });
      if (data) res.status(200).json({ message: "success", data });
      else res.status(404).json({ message: "data not found" });
    } else res.status(401).json({ message: "not authorized" });
  } catch (error) {
    res.status(500).json({
      message: `Error: ${error}`,
    });
  }
});

/**************** *
 * Delete Item
 ********************/

listItemController.delete("/delete/:id", async (req, res) => {
  try {
    await toDoListModel.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Item succesfully deleted!" });
  } catch (err) {
    res.status(500).json({
      message: `failed to delete item.`,
    });
  }
});

module.exports = listItemController;
