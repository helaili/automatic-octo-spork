'use strict';

/**
 * Module dependencies.
 */
var sporksPolicy = require('../policies/sporks.server.policy'),
  sporks = require('../controllers/sporks.server.controller');

module.exports = function (app) {
  // Sporks collection routes
  app.route('/api/sporks').all(sporksPolicy.isAllowed)
    .get(sporks.list)
    .post(sporks.create);

  // Single spork routes
  app.route('/api/sporks/:sporkId').all(sporksPolicy.isAllowed)
    .get(sporks.read)
    .put(sporks.update)
    .delete(sporks.delete);

  // Finish by binding the spork middleware
  app.param('sporkId', sporks.sporkByID);
};
