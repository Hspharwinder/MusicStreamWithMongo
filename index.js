var bodyParser = require('body-parser');
var express = require('express');
var logger = require('morgan');
var path = require('path');
const app = express();
require('../musicStream/db/connection/connection');

// Middleware

/** It create log of each request */
app.use(logger('dev'));  // use can also pass 'combined' instead of 'dev' it tells what type of format want into terminal for log
app.use(bodyParser.json()); // parse the body data in json format post by http 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/media/registrationImages/')));
app.use(express.static(path.join(__dirname, '/songsAndImages/audioVideo/')));
app.use(express.static(path.join(__dirname, '/songs/thumbnail_Images/')));

// Routes
app.use('/', require('./routes/users'));
app.use('/', require('./routes/songs'));
app.use('/', require('./routes/approvals'));

// Start server
const port = 3000;
app.listen(port);
console.log("Server listen at port ::  " + port);

module.exports = app;
