'use strict';

//TODO : cache option doesn't seem to be applied.

//sporks service used for communicating with the sporks REST endpoints
angular.module('sporks').factory('Sporks', ['$resource',
  function ($resource) {
    return $resource('api/sporks/:sporkId', {
      sporkId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      list: {
        method: 'GET',
        url: 'api/sporks',
        isArray: true
      },
      menus: {
        method: 'GET',
        url: 'api/menus',
        cache: true,
        isArray: true
      },
      sporkByState: {
        method: 'GET',
        url: 'api/sporks/state/:stateName',
        cache: true
      }
    });
  }
]);
