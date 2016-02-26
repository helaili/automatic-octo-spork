'use strict';

// Configuring the sporks module
angular.module('sporks').run(['Menus', 'Sporks',
  function (Menus, Sporks) {
    /*
    // Add the sporks dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Sporks',
      state: 'sporks',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'sporks', {
      title: 'List Sporks',
      state: 'sporks.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'sporks', {
      title: 'Create Sporks',
      state: 'sporks.create',
      roles: ['user']
    });

*/
    Sporks.menus(function(sporkArray) {
      buildMenu(sporkArray);
    });


    function buildMenu(sporkArray) {
      sporkArray.forEach(function (spork, sporkIndex) {
        Menus.addMenuItem('topbar', {
          title: spork.menu.title,
          state: spork.menu.state,
          class: 'dynamicMenu',
          type: 'dropdown',
          roles: ['user']
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
