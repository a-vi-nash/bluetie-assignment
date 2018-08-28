//Search Inspection Data
module.exports.GetInspection = {
  searchTerm: global.expressJoi.Joi.string().required()
};

var addressMatcher = {
  addressLine1: global.expressJoi.Joi.string().required(),
  addressLine2: global.expressJoi.Joi.string().required(),
  city: global.expressJoi.Joi.string().required(),
  zipCode: global.expressJoi.Joi.string().required()
};

//Save Inspection Data
module.exports.SaveInspection = {
  venueType: global.expressJoi.Joi.string()
    .valid(global.config.venueTypes)
    .required(),
  location: global.expressJoi.Joi.object(addressMatcher).required(),
  status: global.expressJoi.Joi.string()
    .valid(global.config.inspectionTypes)
    .required()
};

module.exports.UserLogin = {
  email: global.expressJoi.Joi.string().required(),
  password: global.expressJoi.Joi.string().required()
};

module.exports.UserRegister = {
  name: global.expressJoi.Joi.string().required(),
  email: global.expressJoi.Joi.string().required(),
  password: global.expressJoi.Joi.string().required()
};
