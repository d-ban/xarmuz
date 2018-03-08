// Initializes the `played` service on path `/played`
const createService = require('feathers-mongoose');
const createModel = require('../../models/played.model');
const hooks = require('./played.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'played',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/played', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('played');

  service.hooks(hooks);
};
