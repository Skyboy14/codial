const express = require('express')
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');

//use assests
app.use(express.static('./assets'));

// use layouts
app.use(expressLayouts);
// extract style and script from sub pages into layout
app.set('layout extractStyles', true)
app.set('layout extractScripts', true)

// use express 
app.use('/', require('./routes'));

//use views
app.set('view engine', 'ejs');
app.set('views', './views')

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`server is running on port : ${port}`)
})