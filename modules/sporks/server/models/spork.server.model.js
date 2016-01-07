'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var fieldTypeEnum = {
  values: ['text', 'select'],
  message: 'Unknown field type : `{VALUE}`'
};

var viewTypeEnum = {
  values: ['form', 'list'],
  message: 'Unknown view type : `{VALUE}`'
};

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
        view : {
          type: String,
          default: '',
          trim: true,
          required: 'View cannot be blank'
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
  fields : [
    {
      name : {
        type: String,
        default: '',
        trim: true,
        required: 'Name cannot be blank'
      },
      fieldType : {
        type: String,
        enum : fieldTypeEnum,
        required: 'Type cannot be blank'
      },
      label : {
        type: String,
        default: '',
        trim: true,
        required: 'Label cannot be blank'
      },
      model : {
        type: String,
        default: '',
        trim: true,
        required: 'Model cannot be blank'
      },
      placeholder : {
        type: String,
        trim: true
      },
      required : {
        type: Boolean,
        default: false
      },
      minlength : {
        type: Number
      },
      maxlength : {
        type: Number
      },
      pattern : {
        type: String,
        trim: true
      },
      errorMessages : [
        {
          errorType : {
            type: String,
            default: '',
            trim: true,
            required: 'Error type cannot be blank'
          },
          text : {
            type: String,
            default: '',
            trim: true,
            required: 'Error text cannot be blank'
          }
        }
      ],
      options : [
        {
          label : {
            type: String,
            default: '',
            trim: true,
            required: 'Label cannot be blank'
          },
          value : {
            type: String,
            default: '',
            trim: true,
            required: 'Value cannot be blank'
          }
        }
      ]
    }
  ],
  views : [
    {
      name : {
        type: String,
        default: '',
        trim: true,
        required: 'View name cannot be blank'
      },
      viewType : {
        type: String,
        enum: viewTypeEnum,
        required: 'View type cannot be blank'
      },
      cols : [
        {
          width : {
            type: Number,
            default: 6
          },
          fields : [
            {
              name : {
                type: String,
                default: '',
                trim: true,
                required: 'Field name cannot be blank'
              }
            }
          ]
        }
      ],
      actions : [
        {
          name : {
            type: String,
            default: '',
            trim: true,
            required: 'Action name cannot be blank'
          },
          label : {
            type: String,
            default: '',
            trim: true,
            required: 'Action label cannot be blank'
          },
          click : {
            type: String,
            default: '',
            trim: true,
            required: 'Click cannot be blank'
          }
        }
      ]
    }
  ],
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Spork', SporkSchema);
