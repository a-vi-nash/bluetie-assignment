const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

let verifyToken = (req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(global.config.unauthorized_http_code).send({
      responseCode: global.config.unauthorized_http_code,
      responseDesc: global.config.unauthorized_message
    });

  // verifies secret and checks exp
  jwt.verify(token, global.config.jwtSecret, function(err, decoded) {
    if (err)
      return res.status(global.config.unauthorized_http_code).send({
        responseCode: global.config.unauthorized_http_code,
        responseDesc: global.config.unauthorized_message
      });

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
