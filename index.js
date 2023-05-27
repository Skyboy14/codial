const express = require('express')
const app = express();
const port = 8000;


// use express 
app.use('/', require('./routes'))

//use views
app.set('view engine', 'ejs');
app.set('views', './views')

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`server is running on port : ${port}`)
})