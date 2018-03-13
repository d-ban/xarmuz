const { authenticate } = require('@feathersjs/authentication').hooks;
const {searchDistinct} = require('../../hooks/distinct');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [searchDistinct()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
