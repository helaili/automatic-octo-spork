'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Sporks Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/sporks',
      permissions: '*'
    }, {
      resources: '/api/sporks/:sporkId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/sporks',
      permissions: ['get', 'post']
    }, {
      resources: '/api/sporks/state/:stateName',
      permissions: ['get']
    }, {
      resources: '/api/sporks/:sporkId',
      permissions: ['get', 'put', 'delete']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/sporks',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Sporks Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an spork is being processed and the current user created it then allow any manipulation
  if (req.spork && req.user && req.spork.owner.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
