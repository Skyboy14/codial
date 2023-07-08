const express = require('express')
const cookieParser = require('cookie-parser')
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware')
const flash = require('connect-flash')
const customeMware = require('./config/middleware')


app.use(
    sassMiddleware({
        /* Options */
        src: './assets/scss',
        dest: './assets/css',
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
    }),
)
app.use(express.urlencoded());

//using cookie-parser
app.use(cookieParser());

//use assests
app.use(express.static('./assets'));

// use layouts
app.use(expressLayouts);

//make the upload paths available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'))

// extract style and script from sub pages into layout
app.set('layout extractStyles', true)
app.set('layout extractScripts', true)

//use views
app.set('view engine', 'ejs');
app.set('views', './views')

//Mogo store is used to store session cookie
//middleware express session
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/codial_development',
        autoRemove: "disabled",
    }),

}));

app.use(passport.initialize());
app.use(passport.session());

// check weather session cookie is present or not (it is middleware)
app.use(passport.setAuthenticatedUser);

//set the flash 
app.use(flash());
app.use(customeMware.setFlash)

// use express router
app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`server is running on port : ${port}`)
})