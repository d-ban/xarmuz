

const play = require('../../hooks/play');
const playBefore = require('../../hooks/playBefore');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [playBefore()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [play()],
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
