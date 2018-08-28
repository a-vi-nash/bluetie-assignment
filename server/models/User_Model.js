/**
 * Module dependencies
 */
const Mongoose = require("mongoose"),
  Types = Mongoose.Schema.Types

/**
 * User Schema
 */
const modelName = "User";

const UserSchema = new Mongoose.Schema(
    {
      email: {
        type: Types.String,
        unique: true,
        required: true
      },
      name: {
        type: Types.String,
        required: true
      },
      password: {
        type: Types.String,
        required: true
      }

    },
    { timestamps: true }
  );
  
  
  module.exports = Mongoose.model("User", UserSchema);