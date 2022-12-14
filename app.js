//importing .env file
require("dotenv").config();

//importing express from installed library
const express = require("express");
const app = express();

//importing database connection to run
require("./config/database").connect();

// for accesing json file in express
app.use(express.json());

//importing user from model and auth
const User = require("./model/user");
const auth = require("./middleware/auth");

//importing bcryptjs from library
const bcrypt = require("bcryptjs");

// importing jwtToken from library
const jwt = require("jsonwebtoken");

//Routes

app.get("/", (req, res) => {
  res.status(200).send("This is the HOME PAGE for AUTH System V2");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password, country } = req.body;

    //checking mandatory fields
    if (!(firstname && email && password && country)) {
      res.status(400).send("All fields are mandatory");
    }

    //checking existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).send("User is alreday registered");
    }

    //Encrypt the password
    const myEncryptPassword = await bcrypt.hash(password, 10);

    //creating a user data
    const user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: myEncryptPassword,
      country,
    });

    //Creating Token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;

    //hide password in postman
    user.password = undefined;

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

//Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //For missing value
    if (!(email && password)) {
      res.status(400).send("Email or Password is missing");
    }

    const user = await User.findOne({ email });

    //Check user is registered or not
    // if (!user) {
    //   res.status(400).send(`User is not registered on our website`);
    // }

    //another way
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      user.password = undefined;
      res.status(200).json(user);
    }

    //If the above if statement is not working then:
    res.status(200).send("Email or password is incorrect");
  } catch (error) {
    console.log(error);
  }
});

//Dasboard route:
app.get("/dashboard", auth, (req, res) => {
  res.status(200).send(`Welcome to Dashbord Secret Path`);
});

module.exports = app;
