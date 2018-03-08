const assert = require('assert');
const app = require('../../src/app');

describe('\'storage\' service', () => {
  it('registered the service', () => {
    const service = app.service('storage');

    assert.ok(service, 'Registered the service');
  });
});
