const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  domain: {
    type: String,
    minLength: 3,
    required: true,
  },
  available: Boolean,
  owner: String,
  expirationDate: Date,
});

module.exports = mongoose.model("Record", recordSchema);
