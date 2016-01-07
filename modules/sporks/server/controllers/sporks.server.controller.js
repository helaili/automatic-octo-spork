'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Spork = mongoose.model('Spork'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a spork
 */
exports.create = function (req, res) {
  var spork = new Spork(req.body);
  spork.user = req.user;

  spork.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(spork);
    }
  });
};

/**
 * Show the current spork
 */
exports.read = function (req, res) {
  res.json(req.spork);
};

/**
 * Update a spork
 * We need the full spork to be sent back - no partial update at the moment
 */
exports.update = function (req, res) {
  req.body.id = req.spork.id;
  req.body._id = req.spork._id;
  var spork = new Spork(req.body);

  spork.update(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(spork);
    }
  });
};

/**
 * Delete an spork
 */
exports.delete = function (req, res) {
  var spork = req.spork;
  var user = req.user;

  if(spork.owner.id === user.id) {
    spork.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(spork);
      }
    });
  } else {
    return res.status(403).send({
      message: 'Only the owner can delete a spork'
    });
  }
};

/**
 * List of Sporks
 */
exports.list = function (req, res) {
  Spork.find().sort('-created').populate('owner', 'displayName').exec(function (err, sporks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.append('Cache-Control', 'private, max-age=60');
      res.json(sporks);
    }
  });
};


exports.sporkByState = function (req, res) {
  Spork.findOne({ 'menu.items.state' : req.params.stateName }).populate('owner', 'displayName').exec(function (err, spork) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if(spork) {
        var viewName, view;

        //Looking for the view name matching this state
        for(var menuItemIndex = 0; menuItemIndex < spork.menu.items.length; menuItemIndex++) {
          if(spork.menu.items[menuItemIndex].state === req.params.stateName) {
            viewName = spork.menu.items[menuItemIndex].view;
            break;
          }
        }

        if(viewName) {
          for(var viewIndex = 0; viewIndex < spork.views.length; viewIndex++) {
            if(spork.views[viewIndex].name === viewName) {
              view = spork.views[viewIndex];
              break;
            }
          }

          if(view) {
            // Creating a map of the fields to later populate the concrete view
            var cols = [];

            let fieldMap = new Map();
            spork.fields.forEach(function (field, fieldIndex) {
              fieldMap.set(field.name, field);
            });

            view.cols.forEach(function(col, colIndex) {
              cols[colIndex] = {
                'width' : col.width,
                'fields' : []
              };

              col.fields.forEach(function(field) {
                cols[colIndex].fields.push(fieldMap.get(field.name));
              });
            });

            view.cols = cols;

            res.append('Cache-Control', 'private, max-age=60');
            return res.json(view);
          }
        } else {
          return res.status(404).send({
            message: 'Now view found for state : ' + req.params.stateName
          });
        }
      } else {
        return res.status(404).send({
          message: 'Unknown state : ' + req.params.stateName
        });
      }
    }
  });
};

/**
 * Spork middleware
 */
exports.sporkByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Spork is invalid'
    });
  }

  Spork.findById(id).populate('owner', 'displayName').exec(function (err, spork) {
    if (err) {
      return next(err);
    } else if (!spork) {
      return res.status(404).send({
        message: 'No spork with that identifier has been found'
      });
    }
    req.spork = spork;
    next();
  });
};
