// Initializes the `favorite` service on path `/favorite`
const createService = require('feathers-mongoose');
const createModel = require('../../models/favorite.model');
const hooks = require('./favorite.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'favorite',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/favorite', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('favorite');

  service.hooks(hooks);
};
