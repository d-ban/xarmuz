// playlists-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const playlists = new Schema({
    file: { type: String, required: true ,unique:false},
    filekey: { type: String, required: true ,unique:true},
    name: { type: String },
    tag: { type: String }
  }, {
    timestamps: true
  });

  return mongooseClient.model('playlists', playlists);
};
