var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();
var session = require("express-session");
var cors = require("cors");
var app = express();

const httpserver = require("http").createServer(app);

const io = require("socket.io")(httpserver, {
  cors: {
      origin: process.env.FRONTEND,
      credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("disconnect", () => {
      console.log("user disconnected");
  });
});


const redisClient = require("./utils/redis");

var redisStore = require('connect-redis')(session);

const passport = require("passport");
const mongoose = require("mongoose");

// connect to mongoose
console.log("mongo",process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log(err);
    console.log("Error Connecting to mongo");
});

const { dsep, auth } = require("./routes")

app.use(cors({
    origin: process.env.FRONTEND,
    credentials: true
}));

app.use(session({
    store: new redisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport')(passport);

app.use('/bap', dsep)

app.use('/auth', auth)

module.exports = { app, httpserver, io };
