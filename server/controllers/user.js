const express = require('express'),
 router = express.Router(),
 VerifyToken = require('../helpers/verifyToken'),
 User = require('../models/User_Model');

//check this code for refresh token logic implementation
//https://github.com/codeforgeek/node-refresh-token
/**
 * Configure JWT
 */
const jwt = require('jsonwebtoken'), // used to create, sign, and verify tokens
 bcrypt = require('bcryptjs');

router.post('/login', (req, res)=> {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    
    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    // if user is found and password is valid
    // create a token
    var token = jwt.sign({ id: user._id }, global.config.jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });


    // return the information including token as JSON
    res.status(200).send({ auth: true, token: token });
  });

});

router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.post('/register', function(req, res) {
  console.log(req.body,"qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  }, 
  function (err, user) {
    console.log(err,user);
    if (err){
      return res.status(global.config.default_error_http_code).send({
        responseCode: global.config.default_error_http_code,
        responseDesc: err.errmsg.indexOf("duplicate key") != -1 ? "Duplicate email id" : err.errmsg
      })
    }

    // if user is registered without errors
    // create a token
    var token = jwt.sign({ id: user._id }, global.config.jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  });

});

router.get('/me', VerifyToken, function(req, res, next) {

  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  });

});

module.exports = router;