const express = require("express"),
  router = express.Router(),
  VerifyToken = require("../helpers/verifyToken"),
  User = require("../models/User_Model"),
  schema = require("./schema");

//check this code for refresh token logic implementation
//https://github.com/codeforgeek/node-refresh-token
/**
 * Configure JWT
 */
const jwt = require("jsonwebtoken"), // used to create, sign, and verify tokens
  bcrypt = require("bcryptjs");

router.post(
  "/login",
  global.expressJoi.joiValidate(schema.UserLogin),
  (req, res) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          // check if the password is valid
          var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );
          if (!passwordIsValid) {
            return res.status(global.config.unauthorized_http_code).send({
              responseCode: global.config.unauthorized_http_code,
              responseDesc: global.config.unauthorized_message
            });
          }
          // if user is found and password is valid
          // create a token
          var token = jwt.sign({ id: user._id }, global.config.jwtSecret, {
            expiresIn: 86400 // expires in 24 hours
          });

          // return the information including token as JSON
          res
            .status(global.config.default_success_http_code)
            .send({ auth: true, token: token });
        }
        return res.status(global.config.default_not_found_http_code).send({
          responseCode: global.config.default_not_found_http_code,
          responseDesc: global.config.default_not_found_message
        });
      })
      .catch(err => {
        return res.status(global.config.default_error_http_code).send({
          responseCode: global.config.default_error_http_code,
          responseDesc: err.errmsg
        });
      });
  }
);

router.get("/logout", function(req, res) {
  res
    .status(global.config.default_success_http_code)
    .send({ auth: false, token: null });
});

router.post(
  "/register",
  global.expressJoi.joiValidate(schema.UserRegister),
  (req, res) => {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
      .then(user => {
        // if user is registered without errors
        // create a token
        var token = jwt.sign({ id: user._id }, global.config.jwtSecret, {
          expiresIn: 86400 // expires in 24 hours
        });

        res
          .status(global.config.default_success_http_code)
          .send({ auth: true, token: token });
      })
      .catch(err => {
        console.log(err);
        return res.status(global.config.default_error_http_code).send({
          responseCode: global.config.default_error_http_code,
          responseDesc:
            (err.errmsg && err.errmsg.indexOf("duplicate key")) != -1
              ? "Duplicate email id"
              : err.errmsg
        });
      });
  }
);

router.get("/me", VerifyToken, (req, res, next) => {
  User.findById(req.userId, "-password")
    .then(user => {
      if (user) {
        res.status(global.config.default_success_http_code).send(user);
      }
      return res.status(global.config.default_not_found_http_code).send({
        responseCode: global.config.default_not_found_http_code,
        responseDesc: global.config.default_not_found_message
      });
    })
    .catch(err => {
      return res.status(global.config.default_error_http_code).send({
        responseCode: global.config.default_error_http_code,
        responseDesc: err.errmsg
      });
    });
});

module.exports = router;
