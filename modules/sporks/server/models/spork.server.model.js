'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Spork Schema
 */
var SporkSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  firstname: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  lastname: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Spork', SporkSchema);
