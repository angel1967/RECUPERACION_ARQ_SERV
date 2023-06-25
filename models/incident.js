const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "A description is required"],
    maxlength: 500,
    minlength: 5
  },
  user: {
    type: String,
    required: [true, "Email is required"],
    maxlength: 100,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email"
    },
  },
  latitude: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) { return v && (v > -90 && v < 90); },
      message: 'Latitude should be a number between -90 and 90.'
    }
  },
  longitude: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) { return v && (v > -180 && v < 180); },
      message: 'Longitude should be a number between -180 and 180.'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Incident = mongoose.model("Incident", IncidentSchema);

module.exports = Incident;