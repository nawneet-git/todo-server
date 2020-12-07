require("dotenv").config({ path: `${__dirname}/.env` });
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DATABASE_URL,
    dialect: 'postgres',
  }
);

sequelize.authenticate().then(() => console.log("database is connected"));

module.exports = sequelize;
