const assert = require('assert');
const app = require('../../src/app');

describe('\'play\' service', () => {
  it('registered the service', () => {
    const service = app.service('play');

    assert.ok(service, 'Registered the service');
  });
});
