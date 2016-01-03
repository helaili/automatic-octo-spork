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
  updated: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true,
    required: 'Description cannot be blank'
  },
  menu : {
    title : {
      type: String,
      default: '',
      trim: true,
      required: 'Menu title cannot be blank'
    },
    state : {
      type: String,
      default: '',
      trim: true,
      required: 'Menu state cannot be blank'
    },
    url : {
      type: String,
      default: '',
      trim: true,
      required: 'URL cannot be blank'
    },
    items : [
      {
        title : {
          type: String,
          default: '',
          trim: true,
          required: 'Menu title cannot be blank'
        },
        state : {
          type: String,
          default: '',
          trim: true,
          required: 'Menu state cannot be blank'
        },
        url : {
          type: String,
          default: '',
          trim: true,
          required: 'URL cannot be blank'
        },
        templateUrl : {
          type: String,
          default: '',
          trim: true,
          required: 'Template URL cannot be blank'
        }
      }
    ]
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Spork', SporkSchema);
