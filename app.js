var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cors = require("cors");
const screeningAPICalls = require('./apiCalls/screeningAPICalls');
var app = express();
app.use(cors({origin: 'http://localhost:3000'}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // or specify a domain instead of '*'
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/kino', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'public', 'kino.html'));
});

async function getHall(hallId){
    const response = await fetch('http://localhost:8080/hall/' + hallId);
    const data = await response.json();
    console.log(data);
    return data;
}
app.get('/screening', function(req, res, next) {
    screeningAPICalls.getScreenings().then(data => {
        res.send(data);
    });
});
app.get('/hall/:hallId', function(req, res, next) {
    getHall(req.params.hallId).then(data => {
        res.send(data);
    });
});
module.exports = app;
