const express = require("express");
const router = express.Router();
const passport = require("passport");
var User = require("../models/User");
const axios = require("axios");
const {createKeyPair} = require("../utils/keyPair");
const { createBPP } = require("../utils/registryRequests");


router.post("/register", async function (req, res) {

  const {
    email,
    department,
    organisation,
    city
  } = req.body;

  const country = "IND";
  const domain = "dsep:scholarships";
  const subscriberId = department.toLowerCase() + "." + organisation.toLowerCase() + "." + process.env.BECKN_HOST_NAME;
  try {
    // find if user already exists
    const user = await User.findOne({ subscriberId: subscriberId });
    if (user) {
      res.status(409).json({ message: "BPP already exists" });
      return;
    }
    const { publicKey, privateKey } = await createKeyPair();
    const newUser = new User({
      email,
      subscriberId,
      country,
      city,
      domain,
      publicKey,
      privateKey
    });

    try {
      await createBPP(subscriberId, publicKey);
    }
    catch (err) {
      console.log("Axios Request ERROR", err);
      throw err;
    }
    await newUser.save();
    res.status(201).json({ message: "BPP created" });

  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error registering BPP" });
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
