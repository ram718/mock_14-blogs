const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register API
userRouter.post("/register", async (req, res) => {
  const { username, avatar, email, password } = req.body;
  const user = await UserModel.findOne({ email });
  try {
    if (user) {
      res.status(400).send({ msg: "User already exists" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        const data = new UserModel({ username, avatar, email, password: hash });
        await data.save();
        res.status(200).send({ msg: "User is registered successfully" });
      });
    }
  } catch (err) {
    res.status(400).send({ msg: "Bad Request" });
  }
});

// Login API
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  try {
    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          res.status(200).send({
            msg: "Login successful",
            token: jwt.sign({ userID: user._id }, "masai"),
          });
        } else {
          res.status(400).send({ msg: "Wrong Credentials" });
        }
      });
    } else {
      res.status(400).send({ msg: "Register first" });
    }
  } catch (err) {
    res.status(400).send({ msg: "Bad Request" });
  }
});

// Reset API
userRouter.patch("/users/:id/reset", async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findOne({ _id: id });
  const { current_password, new_password } = req.body;

  try {
    if (user) {
      bcrypt.compare(current_password, user.password, async (err, result) => {
        if (result) {
          bcrypt.hash(new_password, 5, async (err, hash) => {
            await UserModel.findByIdAndUpdate(
              {
                _id: id,
              },
              { password: hash }
            );
            res.status(200).send({ msg: "Password is updated" });
          });
        } else {
          res.status(400).send({ msg: "password doesnt match" });
        }
      });
    } else {
      res.status(400).send({ msg: "Register first" });
    }
  } catch (err) {
    res.status(400).send({ msg: "Bad Request" });
  }
});

// Get API
userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await UserModel.findOne({ _id: id });
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ msg: "Bad Request" });
  }
});

module.exports = { userRouter };
