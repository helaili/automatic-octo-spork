'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Spork = mongoose.model('Spork');

/**
 * Globals
 */
var user, spork;

/**
 * Unit tests
 */
describe('Spork Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      spork = new Spork({
        'name' : 'contact',
        'description' : 'This is the contact module',
        'menu' : {
          'title' : 'Contacts',
          'state' : 'contacts',
          'url' : '/contacts',
          'items' : [
            {
              'title' : 'List Contacts',
              'state' : 'contacts.list',
              'url' : '/',
              'view' : 'contactList',
              'templateUrl': 'modules/sporks/client/views/list-sporks.client.view.html'
            },
            {
              'title' : 'Create Contact',
              'state' : 'contacts.create',
              'url' : '/create',
              'view' : 'contactCreationForm',
              'templateUrl': 'modules/sporks/client/views/create-spork.client.view.html'
            }
          ]
        },
        'fields' : [
          {
            'name' : 'title',
            'fieldType' : 'select',
            'label' : 'Title',
            'model' : 'title',
            'placeholder' : 'Title',
            'required' : true,
            'errorMessages' : [
              { 'errorType' : 'required', 'text' : 'You must provide a title' }
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
              { 'errorType' : 'minlength', 'text' : 'Firstname must be at least 2 characters' }
            ]
          },
          {
            'name' : 'email',
            'fieldType' : 'text',
            'label' : 'Email',
            'model' : 'email',
            'placeholder' :'Email',
            'required' : false,
            'pattern' : '.*@.*\\..*',
            'errorMessages' : [
              { 'errorType' : 'pattern', 'text' : 'Invalide email address pattern' }
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
              { 'errorType' : 'required', 'text' : 'You must provide a phone number' }
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
              { 'errorType' : 'required', 'text' : 'You must provide a cell number' }
            ]
          }
        ],
        'views' : [
          {
            'name' : 'contactCreationForm',
            'viewType' : 'form',
            'cols' : [
              {
                'width' : 6,
                'fields' : [
                  { 'name' : 'title' },
                  { 'name' : 'firstname' }
                ]
              },
              {
                'width' : 6,
                'fields' : [
                  { 'name' : 'email' },
                  { 'name' : 'phone' },
                  { 'name' : 'cell' }
                ]
              }
            ],
            'actions' : [
              { 'name' : 'save', 'label' : 'Save', 'click' : 'test' },
              { 'name' : 'cancel', 'label' : 'Cancel', 'click' : 'test' },
              { 'name' : 'reset', 'label' : 'Reset', 'click' : 'test' }
            ]
          },
          {
            'name' : 'contactList',
            'viewType' : 'list'
          }
        ],
        'owner' : user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return spork.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      spork.name = '';

      return spork.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Spork.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
