'use strict';

// Setting up route
angular.module('sporks').config(['$stateProvider',
  function ($stateProvider) {
    // sporks state routing
    $stateProvider
      .state('sporks', {
        abstract: true,
        url: '/sporks',
        template: '<ui-view/>'
      })
      .state('sporks.list', {
        url: '',
        templateUrl: 'modules/sporks/client/views/list-sporks.client.view.html'
      })
      .state('sporks.create', {
        url: '/create',
        templateUrl: 'modules/sporks/client/views/create-spork.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('sporks.view', {
        url: '/:sporkId',
        templateUrl: 'modules/sporks/client/views/view-spork.client.view.html'
      })
      .state('sporks.edit', {
        url: '/:sporkId/edit',
        templateUrl: 'modules/sporks/client/views/edit-spork.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
