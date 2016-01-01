'use strict';

//sporks service used for communicating with the sporks REST endpoints
angular.module('sporks').factory('Sporks', ['$resource',
  function ($resource) {
    return $resource('api/sporks/:sporkId', {
      sporkId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
