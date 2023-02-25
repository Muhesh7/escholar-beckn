var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var logger = require('morgan');
require("dotenv").config();
var cors = require("cors");

var app = express();

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/bap', require('./routes'))

app.listen(process.env.PORT, () => {
    console.log(`BAP listening at http://localhost:${process.env.PORT}`)
})


