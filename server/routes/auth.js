const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
var User = require("../models/User");
const axios = require("axios");
const _sodium = require('libsodium-wrappers');
const { base64_variants } = require('libsodium-wrappers');

const createKeyPair=async()=>{
  await _sodium.ready
  const sodium = _sodium
  let { publicKey, privateKey } = sodium.crypto_sign_keypair()
  const publicKey_base64 = sodium.to_base64(publicKey, base64_variants.ORIGINAL);
  const privateKey_base64 = sodium.to_base64(privateKey, base64_variants.ORIGINAL);

  return {
      privateKey: privateKey_base64,
      publicKey: publicKey_base64
  }
}

router.post("/register", async function (req, res, next) {
  const {
    email,
    department,
    organisation,
    city,
    domain,
    } = req.body;
    
    const country = "India";
    const subscriberId = department + "." + organisation + "." + city + "." + domain;
    const validFrom = new Date();
    // add 30 days to current date
    const validTo = new Date(validFrom.getTime() + 30 * 24 * 60 * 60 * 1000);
    try {
    // find if user already exists
    const user = await User.findOne({ subscriberId: subscriberId });
    if (user) {
      res.status(409).json({ message: "BPP already exists" });
      return;
    }
    const {publicKey, privateKey} = await createKeyPair();
    const newUser = new User({
      email,
      subscriberId,
      country,
      city,
      domain,
      publicKey,
      privateKey,
      validFrom,
      validTo,
    });
    await newUser.save();

    try {
      const response = await axios.post(process.env.REGISTRY_ENDPOINT, {
        subscriber_id: subscriberId,
        country: country,
        city: city,
        domain: domain,
        signing_public_key : publicKey,
        encr_public_key: publicKey,
        valid_from: validFrom,
        valid_until: validTo,
        nonce: "test-random-developer"
      });
      console.log(response.data);
    }
    catch (err) {
      console.log("Axios Request ERROR",err);
      throw err;
    }
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
