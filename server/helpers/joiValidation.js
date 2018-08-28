
'use strict';
// External module dependencies
const Joi = require('joi');

/**
 * A per route validation option
 *
 * @param {Object|Array} validations The validations to perform on the specified route
 * @param {Object} options A list of options for validations.
 * @return {Function}
 *
 * @public
 */
exports.joiValidate = (validations, options) => {
    options = options || {};
    const strict = options.allowUnknown == true ? false : true;

  /**
  * The middleware that handles the route validation
  *
  * @param {Object} req The express request object
  * @param {Object} res The express result object
  * @param {Function} next The function to call upon validation completion
  *
  * @private
  */
  const validate =  (req, res, next) =>{
    // Get method from req
    const method = req.method;

    // Get all of our req data items
    const body = req.body,
    params = req.params,
    query = req.query;
    let items = {};

    // Copy all of the items from the express data into our single items object
    const paramExtras = copyObject(params, items, validations,strict, true),
    queryExtras = copyObject(query, items, validations,strict, true);
    let bodyExtras = {};

    // Only store body methods on calls that may have a body
    if (method !== "GET" && method !== "DELETE") {
      bodyExtras = copyObject(body, items, validations, strict, true);
    }

    const err = Joi.validate(items, validations, options,(err, value) => { 
        if (err) {
            return res
            .status(400)
            .json({
              responseCode: 400,
              responseDesc: "Validation Error",
              message: err.message
            })
            .send();
          } else {
            copyObject(paramExtras, items, null, null);
            copyObject(queryExtras, items, null, null);
            copyObject(bodyExtras, items, null, null);
            req.items = items;
            next();
          }
    });
    
  }

  return validate;
};

// Expose the Joi object so users can create validation schemas.
exports.Joi = Joi;

/**
 * Copies one object's first level parameters to a second ones
 *
 * @param {Object} from An object to copy from.
 * @param {Object} to An object to copy to.
 * @param {Object} validations list of validation keys.
 * @param {Boolean} strict whether to reject keys that aren't in validations list
 * @param {Boolean} decode whether to use decodeURIComponent or not
 *
 * @private
 */

  let copyObject = (from, to, validations, strict, decode) => {
  let extras = {};
  if (from) {
    for (var key in from) {
      if (from.hasOwnProperty(key) && (!validations || strict || validations.hasOwnProperty(key))) {
        try {
          to[key] = (decode && typeof(from[key]) === 'string') ? decodeURIComponent(from[key]) : from[key];
        } catch (err) {
          to[key] = from[key];
        }
      } else {
        try {
          extras[key] = (decode && typeof(from[key]) === 'string') ? decodeURIComponent(from[key]) : from[key];
        } catch (err) {
          extras[key] = from[key];
        }
      }
    }
  }

  return extras;
 }
