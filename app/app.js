var express = require('express');
var con = require('consolidate');
var bodyParser = require('body-parser');
var Str = require('string');
var async = require('async');
var md5 = require('MD5');
var sessionexpress = require('express-session');
var cookieParser = require('cookie-parser')
var cookie = require('cookie');
var validator = require('validator');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.engine('html', con.swig);
app.set('views', __dirname + '/views');
app.set('view engine', 'swig');

module.exports = app;
//app.set('test','test111');

app.locals.title = 'My App';
app.locals.str = Str;
app.locals.async = async;
app.locals.md5 = md5;
app.locals.cookie = cookie;
app.locals.validator = validator;
app.locals.io = io;
//app.locals.root_dir = __dirname;
var connection = require('./module/connection.js');
var user_module = require('./module/user_module');
connection.getCollection('user', function () {

});
var login = require('./router/login');
var accout = require('./router/account');
var register = require('./router/register');
var chatroom = require('./router/chatroom');

app.use('/', express.static(__dirname + '/public'));
app.use(sessionexpress({secret: 'gvJpG9lOQQs9DuYzmkfM', resave: true,
    saveUninitialized: true}));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/account', accout.account);
app.get('/account/logout', function (req, res) {
    res.clearCookie('is_logged_in_cook');
    res.clearCookie('username');
    req.session.destroy(function (err) {
        res.redirect('/');
    });
    //res.end();
});
app.all('/login', login.login_route);

app.all('/register',register.register_route)
app.get('/', function (req, res) {
    res.send("i'm alive");
});
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
app.get('/chatroom',chatroom.chatroom);

/*
io.of("/chatroom").on("connection", function (socket) {
    // here are connections from /new
    socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});*/


app.use(function (req, res, next) {
    res.status(404);
    res.end();
});
server.listen(4000);
console.log('lintening port 4000');

