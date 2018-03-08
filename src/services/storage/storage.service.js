// Initializes the `storage` service on path `/storage`
const createService = require('feathers-mongoose');
const createModel = require('../../models/storage.model');
const hooks = require('./storage.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'storage',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/storage', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('storage');

  service.hooks(hooks);
};
