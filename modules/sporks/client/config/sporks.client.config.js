'use strict';

// Configuring the sporks module
angular.module('sporks').run(['Menus',
  function (Menus) {
    // Add the sporks dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Sporks',
      state: 'sporks',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'sporks', {
      title: 'List Sporks',
      state: 'sporks.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'sporks', {
      title: 'Create Sporks',
      state: 'sporks.create',
      roles: ['user']
    });
  }
]);
