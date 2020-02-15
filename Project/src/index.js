const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
//To upload files
const fileUpload = require('express-fileupload');
//To get value from radio button
const bodyParser = require('body-parser');
//To validate data 

const { database } = require('./keys');

// Initializations 
const app = express();
require('./lib/passport');

// Settings
app.set ('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(session({
    secret: 'adminsession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore (database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
//to upload files
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: 'files/temp'
}));
    //to use body parser
app.use(bodyParser.urlencoded({
    extended: true
}));

// Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})

// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting Server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
