'use strict';

// sporks controller
angular.module('sporks').controller('SporksController', ['$scope', '$stateParams', '$state', '$location', 'Authentication', 'Sporks',
  function ($scope, $stateParams, $state, $location, Authentication, Sporks) {
    $scope.authentication = Authentication;

/*
    $scope.sporkCreationFormObj = {
      name : 'sporkCreationForm',
      actions : [
        { 'name' : 'save', 'label' : 'Save', 'click' : 'test' },
        { 'name' : 'cancel', 'label' : 'Cancel', 'click' : 'test' },
        { 'name' : 'reset', 'label' : 'Reset', 'click' : 'test' }
      ],
      cols : [
        [
          {
            'name' : 'title',
            'fieldType' : 'select',
            'label' : 'Title',
            'model' : 'title',
            'placeholder' : 'Title',
            'required' : true,
            'errorMessages' : [
              { 'type' : 'required', 'text' : 'You must provide a title' }
            ],
            'options' : [
              { 'label' : 'Mr.', 'value' : 'Mr' },
              { 'label' : 'Ms.', 'value' : 'Ms' },
              { 'label' : 'Dr.', 'value' : 'Dr' }
            ]
          },
          {
            'name' : 'firstname',
            'fieldType' : 'text',
            'label' : 'Firstname',
            'model' : 'firstname',
            'placeholder' : 'Firstname',
            'required' : false,
            'minlength' : 2,
            'errorMessages' : [
              { 'type' : 'minlength', 'text' : 'Firstname must be at least 2 characters' }
            ]
          }
        ],
        [
          {
            'name' : 'email',
            'fieldType' : 'text',
            'label' : 'Email',
            'model' : 'email',
            'placeholder' :'Email',
            'required' : false,
            'pattern' : '.*@.*\\..*',
            'errorMessages' : [
              { 'type' : 'pattern', 'text' : 'Invalide email address pattern' }
            ]
          },
          {
            'name' : 'phone',
            'fieldType' : 'text',
            'label' : 'Phone',
            'model' : 'phone',
            'placeholder' : 'Phone number',
            'required' : true,
            'errorMessages' : [
              { 'type' : 'required', 'text' : 'You must provide a phone number' }
            ]
          },
          {
            'name' : 'cell',
            'fieldType' : 'text',
            'label' : 'Cell',
            'model' : 'cell',
            'placeholder' : 'Cell phone number',
            'required' : true,
            'errorMessages' : [
              { 'type' : 'required', 'text' : 'You must provide a cell number' }
            ]
          }
        ]
      ]
    };

    */

    $scope.loadSpork = function() {
      Sporks.sporkByState({ stateName: $state.current.name }, function(spork) {
        $scope.sporkCreationFormObj = spork;
      });
    };

    $scope.callAction = function(action) {
      if (!$scope[$scope.sporkCreationFormObj.name].$valid) {
        $scope.$broadcast('show-errors-check-validity', 'innerForm');
        return false;
      }
      $scope[action]();
    };

    $scope.submitIt = function(action) {
      if (!$scope[$scope.sporkCreationFormObj.name].$valid) {
        $scope.$broadcast('show-errors-check-validity', 'sporkCreationForm');
        return false;
      }
    };

    $scope.test = function() {
      console.log($scope.title);
      console.log($scope[$scope.sporkCreationFormObj.cols[0][0].model]);
      console.log($scope[$scope.sporkCreationFormObj.cols[0][1].model]);
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
        title: this.title,
        content: this.content
      });

      // Redirect after save
      spork.$save(function (response) {
        $location.path('sporks/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
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
