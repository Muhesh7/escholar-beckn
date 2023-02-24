var localStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");
var User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async function (email, password, done) {
        try {
          const user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password" });
          } else {
            return done(null, user);
          }
        } catch (err) {
          console.log(err);
          return done(err, false);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.email);
  });
  passport.deserializeUser(async function (email, done) {
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        done(null, user);
      }
    } catch (err) {
      console.log(err);
      done(err, false);
    }
  });
};