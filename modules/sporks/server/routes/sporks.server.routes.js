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

  app.route('/api/menus').all(sporksPolicy.isAllowed)
    .get(sporks.list);

  // Single spork routes
  app.route('/api/sporks/state/:stateName').all(sporksPolicy.isAllowed)
    .get(sporks.sporkByState);

  // Single spork routes
  app.route('/api/sporks/:sporkId').all(sporksPolicy.isAllowed)
    .get(sporks.read)
    .put(sporks.update)
    .delete(sporks.delete);

  // Finish by binding the spork middleware
  app.param('sporkId', sporks.sporkByID);
};
