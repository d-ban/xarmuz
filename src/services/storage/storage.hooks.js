

const search = require('feathers-mongodb-fuzzy-search')

module.exports = {
  before: {
    all: [search() ,     search({  // regex search on given fields
        fields: ['Genre', 'file']
      })],
    find: [],
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
