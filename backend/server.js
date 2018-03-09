var express    = require("express");
var login = require('./routes/loginroutes');;
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var cookieParser = require('cookie-parser');
var cors = require('cors');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
// var corsOptions = {
//   credentials: true, origin: 'http://localhost:3000'
// }

var corsOptions = {
  credentials: true, origin: 'http://138.68.50.25:3000'
}
app.use(cors(corsOptions));

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'clstdb'
};
 
var sessionStore = new MySQLStore(options);

app.use(cookieParser());
app.use(session({
    key: 'app_sid',
    secret: 'asjkdfcnszdkncsienoesiosesnbbfksjdjk23kjsdkj',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
            "maxAge": 86400000
        }
}));
var router = express.Router();

// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our upload module apis' });
});

//route to handle user registration
router.post('/register',login.register);
router.post('/login',login.login);
router.get('/islogin',login.islogin);
router.get('/logout',login.logout);
router.post('/sendmessage',login.sendmessage);
router.post('/readfile',login.readfile);
router.get('/getUserData',login.getUserData);
app.use('/api', router);
app.listen(4000);