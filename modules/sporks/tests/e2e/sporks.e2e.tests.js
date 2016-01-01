'use strict';

describe('Sporks E2E Tests:', function () {
  describe('Test sporks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sporks');
      expect(element.all(by.repeater('spork in sporks')).count()).toEqual(0);
    });
  });
});
