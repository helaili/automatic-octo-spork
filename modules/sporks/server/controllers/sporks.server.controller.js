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
 */
exports.update = function (req, res) {
  var spork = req.spork;

  spork.title = req.body.title;
  spork.content = req.body.content;

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
 * Delete an spork
 */
exports.delete = function (req, res) {
  var spork = req.spork;

  spork.remove(function (err) {
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
 * List of Sporks
 */
exports.list = function (req, res) {
  Spork.find().sort('-created').populate('user', 'displayName').exec(function (err, sporks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(sporks);
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

  Spork.findById(id).populate('user', 'displayName').exec(function (err, spork) {
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
