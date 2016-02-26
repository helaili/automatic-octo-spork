'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var fieldTypeEnum = {
  values: ['text', 'select', 'array'],
  message: 'Unknown field type : `{VALUE}`'
};

var viewTypeEnum = {
  values: ['form', 'list'],
  message: 'Unknown view type : `{VALUE}`'
};

var tableActionTypeEnum = {
  values: ['newTableEntry', 'editTableEntry', 'deleteTableEntry'],
  message: 'Unknown view type : `{VALUE}`'
};


var menuItemTypeDef = {
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
};

var fieldTypeDef = {
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
};

var arrayOfFieldTypeDef = {
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
  content : [fieldTypeDef]
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
    items : [menuItemTypeDef]
  },
  fields : [fieldTypeDef, arrayOfFieldTypeDef],
  views : [
    {
      name : {
        type: String,
        trim: true,
        required: 'View name cannot be blank'
      },
      formName : {
        type: String,
        trim: true,
        required: 'View name cannot be blank'
      },
      viewType : {
        type: String,
        enum: viewTypeEnum,
        required: 'View type cannot be blank'
      },
      title : {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
      },
      description : {
        type: String,
        trim: true
      },
      sections : [
        {
          formName : {
            type: String,
            trim: true
          },
          title : {
            type: String,
            trim: true
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
          tables : [
            {
              formName : {
                type: String,
                trim: true,
                required: 'Field name cannot be blank'
              },
              globalActions : [
                {
                  label : {
                    type: String,
                    default: '',
                    trim: true,
                    required: 'Action label cannot be blank'
                  },
                  actionType : {
                    type: String,
                    enum: tableActionTypeEnum,
                    required: 'Action type cannot be blank'
                  }
                }
              ],
              rowActions : [
                {
                  label : {
                    type: String,
                    default: '',
                    trim: true,
                    required: 'Action label cannot be blank'
                  },
                  actionType : {
                    type: String,
                    enum: tableActionTypeEnum,
                    required: 'Action type cannot be blank'
                  },
                  glyphicon : {
                    type : String,
                  },
                  editModeOn : {
                    type : Boolean
                  }
                }
              ]
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
