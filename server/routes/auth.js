const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
var User = require("../models/User");

router.post("/register", async function (req, res, next) {
  const { email, name, password, role } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(409).json({ message: "User already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const newUser = new User({
        email: email,
        name: name,
        role: role,
        password: hash,
      });
      await newUser.save();
      res.status(201).json({ message: "User created" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error registering user" });
  }
});

router.post("/login", async function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: "User logged in" });
    });
  })(req, res, next);
});

router.get("/user", async function (req, res) {
  try {
    // check if logged in
    if (!req.user) {
        return res.status(401).json({ message: "User not logged in" });
    }
    
    res.send(req.user);
  } catch (err) {
    res.status(500).send({ message: "Error getting user" });
  }
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.status(200).json({ message: "User logged out" });
  });
});

module.exports = router;
