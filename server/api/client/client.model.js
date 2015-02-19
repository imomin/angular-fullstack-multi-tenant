'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClientSchema = new Schema({
  name: String,
  loginName: String,
  password: String,
  dbUrl: String,
  active: Boolean
});

module.exports = mongoose.model('Client', ClientSchema);