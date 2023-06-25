const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 500,
    minlength: 5
  },
  email: {
    type: String,
    unique: true,
    maxlength: 100,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email"
    },
  },
  password: {
    type: String,
    required: [true, "A password is required"],
    minlength: 5
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Inactive",
  },
  confirmationCode: {
    type: String,
    unique: true,
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;