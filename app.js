//importing .env file
require("dotenv").config();

// for accesing json file in express
app.use(express.json());

//importing express from installed library
const express = require("express");
const app = express();

//importing user from model
const User = require("./model/user");

//Routes

app.get("/", (req, res) => {
  res.status(200).send("This is the HOME PAGE for AUTH System");
});

app.post("/register", (req, res) => {
  const { firstname, lastname, email, password, country } = req.body;

  //checking mandatory fields
  if (!(firstname && email && password && country)) {
    res.status(400).send("All fields are mandatory");
  }

  //checking existing user
  const existingUser = User.findOne({ email });
  if (existingUser) {
    res.status(401).send("User is alreday registered");
  }
});

module.exports = app;
