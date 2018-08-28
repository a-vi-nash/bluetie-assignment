/**
 * Module dependencies
 */
const Mongoose = require("mongoose"),
  Types = Mongoose.Schema.Types

/**
 * Inspection Schema
 */
const modelName = "Inspection";

var Address = new Mongoose.Schema({
  addressLine1:{
      type: Types.String
  },
  addressLine2:{
      type: Types.String
  },
  city:{
      type: Types.String
  },
  zipCode:{
      type: Types.String
  }
});


const InspectionSchema = new Mongoose.Schema(
  {
    venueType: {
      type: Types.String,
      enum: global.config.venueTypes,
      required: true
    },
    location: {
      type: [Address],
      required: true
    },
    status:{
      type: Types.String,
      enum: global.config.inspectionTypes,
      required: true
    },
    inspectorId:{
      type: Types.String
    },
    inspectorName:{
      type: Types.String
    }
  },
  { timestamps: true }
);

InspectionSchema.index({'$**': 'text'});


module.exports = Mongoose.model("Inspection", InspectionSchema);
