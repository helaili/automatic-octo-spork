'use strict';

// sporks controller
angular.module('sporks').controller('SporksController', ['$scope', '$stateParams', '$state', '$location', 'Authentication', 'Sporks',
  function ($scope, $stateParams, $state, $location, Authentication, Sporks) {
    $scope.authentication = Authentication;

    $scope.getField = function(form, field) {
      console.log('getField', form, field);
      return $scope['sporkCreationForm']['menuItemsForm'][field];
    }

    $scope.loadSpork = function() {
      var stateName = $state.current.name;
      Sporks.sporkByState({ 'stateName': stateName }, function(spork) {
        //$scope.spork = spork;

        //Looking for the view name matching this state
        var viewName;
        for(var menuItemIndex = 0; menuItemIndex < spork.menu.items.length; menuItemIndex++) {
          if(spork.menu.items[menuItemIndex].state === stateName) {
            viewName = spork.menu.items[menuItemIndex].view;
            break;
          }
        }

        if(viewName) {
          for(var viewIndex = 0; viewIndex < spork.views.length; viewIndex++) {
            if(spork.views[viewIndex].name === viewName) {
              $scope.sporkCreationFormObj = spork.views[viewIndex];
            }
          }
        }
      });
    };

    //Accessing a field through a string in the shape of 'xxx.yyy.zzz'
    $scope.getObjectFromModelName = function(model, isArray) {
      var tokens = model.split('.');

      if(!$scope.spork) {
        $scope.spork = {};
      }
      var currentObj = $scope.spork;

      for(var token in tokens) {
        if(!currentObj[tokens[token]]) {
          //Force casting to int
          if(tokens.length-1-token === 0 && isArray) {
            currentObj[tokens[token]] = [];
          } else {
            currentObj[tokens[token]] = {};
          }
        }
        currentObj = currentObj[tokens[token]];
      }

      return currentObj;
    };

    $scope.callAction = function(action) {
      if (!$scope[$scope.sporkCreationFormObj.formName].$valid) {
        $scope.$broadcast('show-errors-check-validity', 'innerForm');
        //$scope.$broadcast('show-errors-check-validity', 'menuItemsForm');
        return false;
      }

      $scope[action]();
    };

    $scope.callTableAction = function(action, table) {
      console.log(action);
      $scope[action](table);
    };

    $scope.saveTableline = function(table) {
      if (!$scope[$scope.sporkCreationFormObj.formName][table.formName].$valid) {
        $scope.$broadcast('show-errors-check-validity', table.formName);
        return false;
      } else {
        console.log('nailed it');
      }
    };

    $scope.test = function() {
      console.log($scope.title);
      console.log($scope[$scope.sporkCreationFormObj.cols[0][0].model]);
      console.log($scope[$scope.sporkCreationFormObj.cols[0][1].model]);
    };

    $scope.newTableLine = function(table) {
      //var array = $scope.getObjectFromModelName(table.model, true);
      table.editModeOn = true;

    };

    // Create new Spork
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'sporkForm');

        return false;
      }

      // Create new Spork object
      var spork = new Sporks({
        name : this.name,
        description : this.description
      });

      // Redirect after save
      spork.$save(function (response) {
        $location.path('sporks/' + response._id);

        // Clear form fields
        $scope.name = '';
        $scope.description = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Spork
    $scope.remove = function (spork) {
      if (spork) {
        spork.$remove();

        for (var i in $scope.sporks) {
          if ($scope.sporks[i] === spork) {
            $scope.sporks.splice(i, 1);
          }
        }
      } else {
        $scope.spork.$remove(function () {
          $location.path('sporks');
        });
      }
    };

    // Update existing Spork
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'sporkForm');

        return false;
      }

      var spork = $scope.spork;

      spork.$update(function () {
        $location.path('sporks/' + spork._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of sporks
    $scope.find = function () {
      $scope.sporks = Sporks.list();
    };

    // Find existing Spork
    $scope.findOne = function () {
      $scope.spork = Sporks.get({
        sporkId: $stateParams.sporkId
      });
    };



  }
]);
