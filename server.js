const express = require('express'),
  app = express(),
  port = process.env.PORT || 10101,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  server = require('http').Server(app),
  io = require('socket.io')(server),
  cote = require('cote');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DATABASE, function(err) {
    if (err) {
        console.log('MongoDB connection error: ' + err);
        process.exit(1);
    }
});
mongoose.connection.once('open', function() {
    console.log('MongoDB event open');
    console.log('MongoDB connected [%s]', process.env.DATABASE);

    mongoose.connection.on('connected', function() {
        console.log('MongoDB event connected');
    });

    mongoose.connection.on('disconnected', function() {
        console.log('MongoDB event disconnected');
    });

    mongoose.connection.on('reconnected', function() {
        console.log('MongoDB event reconnected');
    });

    mongoose.connection.on('error', (err) => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
    });
});


// import all of our models
require('./models/Playback');
require('./models/User');
require('./models/Movie');
require('./models/Review');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/index'); //importing route
app.use('/', routes);

app.listen(port);


console.log('Dateflicks RESTful API server started on: ' + port);



new cote.Sockend(io, {
    name: 'sockend server'
});

//module.exports = app;
