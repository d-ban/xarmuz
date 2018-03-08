// Initializes the `play` service on path `/play`
const createService = require('feathers-mongoose');
const createModel = require('../../models/play.model');
const hooks = require('./play.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'play',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/play', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('play');

  service.hooks(hooks);
};
