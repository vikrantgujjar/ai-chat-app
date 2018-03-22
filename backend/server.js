var express    = require("express");
var login = require('./routes/loginroutes');;
var dbapp = require('./routes/dbapproutes');;
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var cors = require('cors');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// var corsOptions = {
//   credentials: true, origin: 'http://localhost:3001'
// }

var corsOptions = {
  credentials: true, origin: 'http://138.68.50.25:3001'
}
app.use(cors(corsOptions));

var options = {
    url: 'mongodb://localhost/aics'
};
 
var sessionStore = new MongoStore(options);

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



// routes for dbapp
router.get('/getMenu',dbapp.getMenu);
router.get('/createMenu',dbapp.createMenu);
router.post('/getTables',dbapp.getTables);
router.post('/createTables',dbapp.createTables);
router.post('/hideBlock',dbapp.hideBlock);
router.post('/showBlock',dbapp.showBlock);

router.post('/foreignColumn',dbapp.foreignColumn);
router.post('/foreignColumnValue',dbapp.foreignColumnValue);

router.post('/foreignFormSelect',dbapp.foreignFormSelect);


app.use('/api', router);
app.listen(4001);