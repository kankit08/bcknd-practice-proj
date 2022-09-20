//importing .env file
require("dotenv").config();

//importing express from installed library
const express = require("express");
const app = express();

//Routes

app.get("/", (req, res) => {
  res.status(200).send("This is the HOME PAGE for AUTH System");
});

module.exports = app;
