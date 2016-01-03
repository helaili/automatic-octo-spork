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
        cache: true,
        isArray: true
      }
    });
  }
]);
