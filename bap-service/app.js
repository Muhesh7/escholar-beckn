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
    transports: ["websocket"],
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
console.log("mongo", process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log(err);
    console.log("Error Connecting to mongo");
});

const { dsep, auth } = require("./routes")

app.use(cors({
    origin: process.env.FRONTEND,
    credentials: true,
}));

app.use(session({
    store: new redisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));

app.use(logger('dev'));

app.use(express.json({
    limit: '50mb'
}));

app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport')(passport);

app.post('/bap/on_search', async function (req, res) {

    try {
        var result = {}
        const provider = req.body.responses[0].message.catalog.providers
        const context = req.body.responses[0].context 
        result = {
            response : {
                ...provider[0],
                context: context,
            }
        }
        console.log(result)
        io.emit("onSearch", result);
        res.send("done")
    } catch (e) {
        console.log(e)
        res.send("error")
    }
})

app.post('/bap/on_select', async function (req, res) {
    console.log(JSON.stringify(req.body))
    try {
        var result = {}
        const message = req.body.responses[0].message
        const context = req.body.responses[0].context
        result = {
            response : {
                ...message,
                context: context
            }
        }
        console.log(result)
        io.emit("onSelect", result);
        res.send("done")
    } catch (e) {
        console.log(e)
        res.send("error")
    }
})

app.post('/bap/on_init', async function (req, res) {
    try {
        var result = {}
        const order = req.body.responses[0].order
        result = {
            response : order
        }
        console.log(result)
        io.emit("onInit", result);
        res.send("done")
    } catch (e) {
        console.log(e)
        res.send("error")
    }
})

app.post('/bap/on_confirm', async function (req, res) {
    try {
        var result = {}
        const order = req.body.responses[0].order
        result = {
            response : order
        }
        console.log(result)
        io.emit("onConfirm", result);
        res.send("done")
    } catch (e) {
        console.log(e)
        res.send("error")
    }
})

app.post('/bap/on_status', async function (req, res) {
    try {
        var result = {}
        const order = req.body.responses[0].order
        result = {
            response : order
        }
        console.log(result)
        io.emit("onStatus", result);
        res.send("done")
    } catch (e) {
        console.log(e)
        res.send("error")
    }
})
app.use('/bap', dsep)

app.use('/auth', auth)

module.exports = { app, httpserver };
