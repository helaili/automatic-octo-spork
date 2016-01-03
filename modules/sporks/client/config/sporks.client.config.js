'use strict';

// Configuring the sporks module
angular.module('sporks').run(['Menus', 'Sporks',
  function (Menus, Sporks) {
    console.log('config');
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


    Sporks.list(function(sporkArray) {
      buildMenu(sporkArray);
    });


    function buildMenu(sporkArray) {
      sporkArray.forEach(function (spork, sporkIndex) {
        Menus.addMenuItem('topbar', {
          title: spork.menu.title,
          state: spork.menu.state,
          class: 'dynamicMenu',
          type: 'dropdown',
          roles: ['*']
        });

        spork.menu.items.forEach(function (menuItem, menuItemIndex) {
          Menus.addSubMenuItem('topbar', spork.menu.state, {
            title: menuItem.title,
            state: menuItem.state
          });
        });
      });
    }
  }
]);
