const sequelize = require("../db");
const ListItemModel = sequelize.import("../models/listItem");
const express = require("express");

const listItemController = express.Router();

// /**************************
//  * CREATE  ITEM
//  **************************

listItemController.post("/additem", async (req, res) => {
  ListItemModel.create({
    text: req.body.text,
    user_id: req.user.id,
  }).then((data) => {
    res.status(201).json({
      message: "Success: Item created!",
      data: data,
    });
  }).catch((err) => {
    console.log("Some error occured : ", err);
    res.status(500).json({
      message: `Error Item is not added: ${err}`,
    })
  });
});

listItemController.get("/listall", async (req, res) => {
  console.log("list item : ", req.user.id, req.user.first_name)
  ListItemModel.findAll({
    where: { user_id: req.user.id }
  }).then((data) => {
    res.status(200).json({
      message: "Success: Item fetched!",
      data: data,
    });
  }).catch((err) => {
    console.log("Some error occured : ", err);
    res.status(500).json({
      message: `Error Item is not fetched: ${err}`,
    })
  });
});

// Update Item
listItemController.put("/update/:id", async (req, res) => {
  let text = req.body.text;
  let itemId = req.params.id;
  let user_id = req.user.id;

  let updateItem = await ListItemModel.findOne({
    where: { user_id: user_id, id: itemId },
  });

  if (updateItem) {
    await updateItem.update({ text: text });
    res.status(200).json({ message: "Item successfully updated" });
  } else {
    res.status(404).json({ message: "Item not found or update unsuccessful." });
  }
});

listItemController.put("/complete/:id", async (req, res) => {
  let itemId = req.params.id;
  let user_id = req.user.id;

  let updateItem = await ListItemModel.findOne({
    where: { user_id: user_id, id: itemId },
  });

  if (updateItem) {
    await updateItem.update({ isCompleted: true });
    res.status(200).json({ message: "Item successfully updated" });
  } else {
    res.status(404).json({ message: "Item not found or update unsuccessful." });
  }
});

listItemController.put("/uncomplete/:id", async (req, res) => {
  let itemId = req.params.id;
  let user_id = req.user.id;

  let updateItem = await ListItemModel.findOne({
    where: { user_id: user_id, id: itemId },
  });

  if (updateItem) {
    await updateItem.update({ isCompleted: false });
    res.status(200).json({ message: "Item successfully updated" });
  } else {
    res.status(404).json({ message: "Item not found or update unsuccessful." });
  }
});


/**************** *
 * Delete Item
 ********************/

listItemController.delete("/delete/:id", async (req, res) => {
  try {
    let user_id = req.user.id;

    const removedList = await ListItemModel.destroy({
      where: { id: req.params.id, user_id: user_id },
    }).then((data) => {
      res.status(200).json({ message: "Item succesfully deleted!" });
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: `failed to delete item.`,
    });
  }
});

module.exports = listItemController;
