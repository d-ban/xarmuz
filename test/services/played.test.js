const assert = require('assert');
const app = require('../../src/app');

describe('\'played\' service', () => {
  it('registered the service', () => {
    const service = app.service('played');

    assert.ok(service, 'Registered the service');
  });
});
