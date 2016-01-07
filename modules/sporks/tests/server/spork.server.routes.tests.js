'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Spork = mongoose.model('Spork'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, spork;

/**
 * Spork routes tests
 */
describe('Spork CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new spork
    user.save(function () {
      spork = {
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
      };

      done();
    });
  });

  it('should be able to save an spork if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new spork
        agent.post('/api/sporks')
          .send(spork)
          .expect(200)
          .end(function (sporkSaveErr, sporkSaveRes) {
            // Handle spork save error
            if (sporkSaveErr) {
              return done(sporkSaveErr);
            }

            // Get a list of sporks
            agent.get('/api/sporks')
              .end(function (sporksGetErr, sporksGetRes) {
                // Handle spork save error
                if (sporksGetErr) {
                  return done(sporksGetErr);
                }

                // Get sporks list
                var sporks = sporksGetRes.body;

                // Set assertions
                (sporks[0].owner._id).should.equal(userId);
                (sporks[0].name).should.match('contact');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an spork if not logged in', function (done) {
    agent.post('/api/sporks')
      .send(spork)
      .expect(403)
      .end(function (sporkSaveErr, sporkSaveRes) {
        // Call the assertion callback
        done(sporkSaveErr);
      });
  });

  it('should not be able to save an spork if no name is provided', function (done) {
    // Invalidate name field
    spork.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new spork
        agent.post('/api/sporks')
          .send(spork)
          .expect(400)
          .end(function (sporkSaveErr, sporkSaveRes) {
            // Set message assertion
            (sporkSaveRes.body.message).should.match('Name cannot be blank');

            // Handle spork save error
            done(sporkSaveErr);
          });
      });
  });

  it('should be able to update an spork if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new spork
        agent.post('/api/sporks')
          .send(spork)
          .expect(200)
          .end(function (sporkSaveErr, sporkSaveRes) {
            // Handle spork save error
            if (sporkSaveErr) {
              return done(sporkSaveErr);
            }

            // Update spork name
            spork.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing spork
            agent.put('/api/sporks/' + sporkSaveRes.body._id)
              .send(spork)
              .expect(200)
              .end(function (sporkUpdateErr, sporkUpdateRes) {
                // Handle spork update error
                if (sporkUpdateErr) {
                  return done(sporkUpdateErr);
                }

                // Set assertions
                (sporkUpdateRes.body._id).should.equal(sporkSaveRes.body._id);
                (sporkUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of sporks if not signed in', function (done) {
    // Create new spork model instance
    var sporkObj = new Spork(spork);

    // Save the spork
    sporkObj.save(function () {
      // Request sporks
      request(app).get('/api/sporks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should not be able to get a single spork if not signed in', function (done) {
    // Create new spork model instance
    var sporkObj = new Spork(spork);

    // Save the spork
    sporkObj.save(function () {
      request(app).get('/api/sporks/' + sporkObj._id)
        .expect(403).end(function (sporkDeleteErr, sporkDeleteRes) {
          return done(sporkDeleteErr);
        });
    });
  });

  it('should return proper error for single spork with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sporks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Spork is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single spork which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent spork
    request(app).get('/api/sporks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No spork with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an spork if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new spork
        agent.post('/api/sporks')
          .send(spork)
          .expect(200)
          .end(function (sporkSaveErr, sporkSaveRes) {
            // Handle spork save error
            if (sporkSaveErr) {
              return done(sporkSaveErr);
            }

            // Delete an existing spork
            agent.delete('/api/sporks/' + sporkSaveRes.body._id)
              .send(spork)
              .expect(200)
              .end(function (sporkDeleteErr, sporkDeleteRes) {
                // Handle spork error error
                if (sporkDeleteErr) {
                  return done(sporkDeleteErr);
                }

                // Set assertions
                (sporkDeleteRes.body._id).should.equal(sporkSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an spork if not signed in', function (done) {
    // Set spork user
    spork.owner = user;

    // Create new spork model instance
    var sporkObj = new Spork(spork);

    // Save the spork
    sporkObj.save(function () {
      // Try deleting spork
      request(app).delete('/api/sporks/' + sporkObj._id)
        .expect(403)
        .end(function (sporkDeleteErr, sporkDeleteRes) {
          // Set message assertion
          (sporkDeleteRes.body.message).should.match('User is not authorized');

          // Handle spork error error
          done(sporkDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Spork.remove().exec(done);
    });
  });
});
