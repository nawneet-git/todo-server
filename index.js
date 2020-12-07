require("dotenv").config({ path: `${__dirname}/.env` });
const sequelize = require("./db");
const express = require("express");
const user = require("./controllers/userController");
const listItem = require("./controllers/listItemController");
const adminListController = require('./controllers/adminItemController');
const validate = require('./middleware/validate-session');
var cors = require('cors')

sequelize.sync();

const app = express();
app.use(cors())
app.use(express.json());

app.use(require("./middleware/headers"));

app.use("/user", user);
app.use("/todo", validate, listItem);
app.use('/admin', validate, adminListController);

app.listen(process.env.PORT, () => {
  console.log(`great,listening on port ${process.env.PORT}`);
});
