'use strict';

(function () {
  // Sporks Controller Spec
  describe('Sporks Controller Tests', function () {
    // Initialize global variables
    var SporksController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Sporks,
      mockSpork;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Sporks_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Sporks = _Sporks_;

      // create mock spork
      mockSpork = new Sporks({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Spork about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Sporks controller.
      SporksController = $controller('SporksController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one spork object fetched from XHR', inject(function (Sporks) {
      // Create a sample sporks array that includes the new spork
      var sampleSporks = [mockSpork];

      // Set GET response
      $httpBackend.expectGET('api/sporks').respond(sampleSporks);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.sporks).toEqualData(sampleSporks);
    }));

    it('$scope.findOne() should create an array with one spork object fetched from XHR using a sporkId URL parameter', inject(function (Sporks) {
      // Set the URL parameter
      $stateParams.sporkId = mockSpork._id;

      // Set GET response
      $httpBackend.expectGET(/api\/sporks\/([0-9a-fA-F]{24})$/).respond(mockSpork);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.spork).toEqualData(mockSpork);
    }));

    describe('$scope.create()', function () {
      var sampleSporkPostData;

      beforeEach(function () {
        // Create a sample spork object
        sampleSporkPostData = new Sporks({
          title: 'An Spork about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Spork about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Sporks) {
        // Set POST response
        $httpBackend.expectPOST('api/sporks', sampleSporkPostData).respond(mockSpork);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the spork was created
        expect($location.path.calls.mostRecent().args[0]).toBe('sporks/' + mockSpork._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/sporks', sampleSporkPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock spork in scope
        scope.spork = mockSpork;
      });

      it('should update a valid spork', inject(function (Sporks) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/sporks\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/sporks/' + mockSpork._id);
      }));

      it('should set scope.error to error response message', inject(function (Sporks) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/sporks\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(spork)', function () {
      beforeEach(function () {
        // Create new sporks array and include the spork
        scope.sporks = [mockSpork, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/sporks\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockSpork);
      });

      it('should send a DELETE request with a valid sporkId and remove the spork from the scope', inject(function (Sporks) {
        expect(scope.sporks.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.spork = mockSpork;

        $httpBackend.expectDELETE(/api\/sporks\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to sporks', function () {
        expect($location.path).toHaveBeenCalledWith('sporks');
      });
    });
  });
}());
