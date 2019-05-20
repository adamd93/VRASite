var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require("mssql");
//var mongoose = require('mongoose');
//var session = require('express-session');
//var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
//mongoose.connect('mongodb://localhost/VRA');
var dbConfig = {
  server: "testingdatabaseire.database.windows.net", // Use your SQL server name
  database: "testDatabase", // Database to connect to
  user: "Geoforce", // Use your username
  password: "OrangeMonkey@22", // Use your password
  port: 1433,
  // Since we're on Windows Azure, we need to set the following options
  options: {
        encrypt: true
    }
 };
 

module.exports = {
  createUser(email, username, password, callback){
    // Create connection instance
      var conn = new sql.ConnectionPool(dbConfig);
    
      conn.connect()
      // Successfull connection
      .then(function () {
    
        // Create request instance, passing in connection instance
        var req = new sql.Request(conn);
    
        // Call mssql's query method passing in params
        req.input('username', sql.VarChar, username)
        req.input('password', sql.VarChar, password)
        req.input('email', sql.VarChar, email)
        console.log("in create");
        req.query("Insert into dbo.Profile (UserName, password, email) values (@username, @password, @email)")
        .then(function (recordset) {
          console.log("user created");
          conn.close();
          callback(recordset);
        })
        // Handle sql statement execution errors
        .catch(function (err) {
          console.log(err);
          conn.close();
        })
    
      })
      // Handle connection errors
      .catch(function (err) {
        console.log(err);
        conn.close();
      });
    },
    getUser(username, password, callback){
      var conn = new sql.ConnectionPool(dbConfig);
    
      conn.connect()
      // Successfull connection
      .then(function () {
    
        // Create request instance, passing in connection instance
        var req = new sql.Request(conn);
        console.log("in get");

        // Call mssql's query method passing in params
        req.input('username', sql.VarChar, username)
        req.input('password', sql.VarChar, password)

        req.query("Select * from dbo.Profile where UserName =@userName and password=@password")
        .then(function (recordset) {
          conn.close();
          callback(recordset);
        })
        // Handle sql statement execution errors
        .catch(function (err) {
          console.log(err);
          conn.close();
        })
    
      })
      // Handle connection errors
      .catch(function (err) {
        console.log(err);
        conn.close();
      });
    }
}


function getUser(){

}
//handle mongo error
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   // we're connected!
// });

//use sessions for tracking logins

// app.use(session({
//   secret: 'work hard',
//   resave: true,
//   saveUninitialized: false,
//   store: new MongoStore({
//     mongooseConnection: db
//   })
// }));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
app.use(express.static(__dirname + '/templateLogReg'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('Express app listening on port 3000');
});