const auth = require('express').Router()
const controller = require('../controllers/')

auth.post("/register",controller.register);
auth.post("/login", controller.login);
auth.get('/user', controller.user)
auth.get("/logout", controller.logout);

module.exports = auth;
