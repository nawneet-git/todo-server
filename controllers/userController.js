const sequelize = require("../db");
const UserModel = sequelize.import("../models/users");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { v4: uuidv4 } = require('uuid');

const userController = express.Router();

/**************************
 * Register Route
 **************************/

userController.post("/register", async (req, res) => {

  let userResponse = await UserModel.findOne({
    where: { email: req.body.email }
  });
  if (userResponse) {
    return res.status(400).json({
      message: `This email is already registered`,
    })
  }
  UserModel.create({
    id: uuidv4(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    passwordhash: bcrypt.hashSync(req.body.password, 10),
  }).then((data) => {
    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET);
    res.status(201).json({
      message: "Success: Account created!",
      token: token,
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).json({
      message: `Error Logging In: ${err}`,
    })
  }
  );
});

/************************
 * Login Route
 ************************/

userController.post("/login", async (req, res) => {
  console.log(req);
  // try {
  let loginUser = await UserModel.findOne({
    where: { email: req.body.email },
  });
  console.log(loginUser);
  if (loginUser && (await bcrypt.compare(req.body.password, loginUser.passwordhash))) {
    const token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET);
    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } else {
    res.status(401).json({
      message: "Login Failed",
    });
  }
});

/* ******************
 * Delete User Route
 ********************/

userController.delete("/deleteuser", async (req, res) => {
  console.log(req.user.id);
  try {
    const removedUser = await UserModel.destroy({
      where: { id: req.user.id },
    }).then((data) => {
      res.status(200).json({ message: "User succesfully deleted!" });
    });
  } catch (err) {
    res.status(500).json({
      message: `failed to delete user. ${err}`,
    });
  }
});

module.exports = userController;
