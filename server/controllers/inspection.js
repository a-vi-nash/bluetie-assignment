"use strict";
const express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"),
  Inspection = require("../models/Inspection_Model"),
  User = require("../models/User_Model"),
  schema = require("./schema"),
  authenticate = require("../helpers/verifyToken");

/**
 * Fetches the inspection details via a search term(performs global text search)
 */
router.get(
  "/:searchTerm",
  authenticate,
  global.expressJoi.joiValidate(schema.GetInspection),
  (req, res, next) => {
    const searchTerm = req.params.searchTerm || "";
    Inspection.find({$text: {$search: searchTerm}})
      .sort({ sortOrder: 1 })
      .then(Inspection => {
        if (!Inspection.length) {
          return res
            .status(global.config.default_not_found_http_code)
            .json({
              responseCode: global.config.default_not_found_http_code,
              responseDesc: global.config.default_not_found_message
            })
            .send();
        }

        return res
            .status(global.config.default_success_http_code)
            .send(Inspection);
      })
      .catch(error => {
        throw error;
      });
  }
);

/**
 * save the inspection details.
 */
router.post(
    "/",
    authenticate,
    global.expressJoi.joiValidate(schema.SaveInspection),
    (req, res) => {
        let inspectionData = {...req.body};
        
        //get user details
        return User.findById(req.userId,'-password')
                .then(userDetails=>{
                   if(userDetails.name){
                       return userDetails;
                   }
                   else{
                       throw new Error("USER_NOT_FOUND");
                   }
                })
                .then(userDetails=>{
                    inspectionData.inspectorId = userDetails._id.toString();
                    inspectionData.inspectorName = userDetails.name
                    let inspection = new Inspection(inspectionData);
                    return inspection.save().then(
                        result => {
                            console.log(result)
                            return res
                            .status(global.config.default_success_http_code)
                            .json({
                                responseCode: global.config.default_success_http_code,
                                responseDesc: global.config.default_success_message,
                                //result:result
                              })
                            .send();
                        })
                })
                .catch(error => {
                if(error.message == "USER_NOT_FOUND"){
                    return res
                        .status(global.config.default_not_found_http_code)
                        .json({
                        responseCode: global.config.default_not_found_http_code,
                        responseDesc: global.config.default_not_found_message
                        })
                        .send();
                }
                throw error;
            });


    }
);

module.exports = router;
