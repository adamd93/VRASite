var express = require('express');
var router = express();
var User = require('../models/user');
var app = require('../app');
var path = require('path');


// GET route for reading data
router.get('/', function (req, res, next) {
  console.log("In Index");
  return res.sendFile(path.resolve('templateLogReg/register.html'));
});

router.get('/register', function (req, res, next) {
    console.log("In Reg1");
    console.log(path.resolve('templateLogReg/register.html'));
  return res.sendFile(path.resolve('templateLogReg/register.html'));
});

router.get('/logIn', function (req, res, next) {
  console.log("In Reg1");
  console.log(path.resolve('templateLogReg/index.html'));
return res.sendFile(path.resolve('templateLogReg/index.html'));
});


//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }
    console.log("in post");
    
     app.createUser(userData.email, userData.username, userData.password ,function(value){
      console.log("in callback");   
      console.log(value);  
     });
     app.getUser(userData.username, userData.password, function(value1){
      console.log(value1);
         res.send('<h1>Name: </h1>' + userData.username + '<h2>Mail: </h2>' + userData.email + '<br><a type="button" href="/logout">Logout</a>')
    });
     
   /* User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.redirect('/profile');
      }
    });*/

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/profile', function (req, res, next) {
  console.log("in getProf");
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
       

           //res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;