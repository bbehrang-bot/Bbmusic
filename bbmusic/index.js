var cookiePaser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var engine = require('ejs-mate');
var MongoStore =require('connect-mongo')(session);
var LocalStrategy = require('passport-local').Strategy;
var csrf = require('csurf');
var route = express.Router();
var csrfProtection = csrf({cookie:true});
var indexController = require('./routes/Home/indexController.js');
var songController = require('./routes/songController.js');
var cartController = require('./routes/ShoppingCart.js');
var albumController = require('./routes/albumController.js');
var artistController = require('./routes/artistController.js');
var userController = require('./routes/userController.js');
var ajaxController = require('./routes/ajaxController.js');
var adminController = require('./routes/adminController.js');
var fileUploadController = require('./routes/fileUploadController.js');
var checkoutController = require('./routes/checkoutController.js');


mongoose.connect('mongodb://heroku_r92vh9sw:nhtf7uq729n9iqqbe78kgeuool@ds015995.mlab.com:15995/heroku_r92vh9sw');
var db = mongoose.connection;
var app = express();

// view engine setup
app.set('port', (process.env.PORT || 5000));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookiePaser());


//static folder
app.use("/media",express.static(path.join(__dirname + '/media')));
app.use("/public",express.static(path.join(__dirname + '/public')));
app.use("/artistsMedia",express.static(path.join(__dirname + '/artistsMedia')));
//express session
app.use(session({
    secret: 'winteriscomingandthedeadcomewithitbastard',
    saveUninitialized: false,
    resave: false,
    store:new MongoStore({
      mongooseConnection : mongoose.connection,
    }),
    cookie:{maxAge : 180*60*1000}

}));

//route.use(csrf());
//passportInit
app.use(passport.initialize());
app.use(passport.session());
// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());
//app.use(csrf());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.session = req.session;
  next();
});

app.use('/',indexController);
app.use('/cart',cartController);
app.use('/checkout',checkoutController);
app.use('/artists',artistController);
app.use('/albums',albumController);
app.use('/users',csrfProtection,userController);
app.use('/file',fileUploadController);
app.use('/songs',songController);
app.use('/ajax',ajaxController);
app.use('/admin',adminController);
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
