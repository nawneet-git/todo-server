const jwt = require("jsonwebtoken");
const sequelize = require("../db");
const User = sequelize.import("../models/users");

const validate = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  } else {
    let sessionToken = req.headers.authorization;
    if (!sessionToken)
      return res.status(403).send({ authorized: false, message: "Must provide token." });
    else {
      jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
        if (decoded) {
          User.findOne({ where: { id: decoded.id } }).then(
            (user) => {
              req.user = user;
              console.log(user);
              next();
            },
            (err) => {
              res.status(401).send({ error: "Not Authorized" });
            }
          );
        } else {
          res.status(400).send({ error: "Bad request" });
        }
      });
    }
  }
};

module.exports = validate;
