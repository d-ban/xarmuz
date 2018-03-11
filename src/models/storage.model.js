// storage-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const storage = new Schema({
    vol: { type: String, default: "80" }
  }, {
    timestamps: true,
    strict: false
  });
  storage.index({file: 'text',Artist:'text',Title:'text',Genre:'text',myComment:'text'});

  return mongooseClient.model('storage', storage);
};
