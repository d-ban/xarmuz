// favorite-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const favorite = new Schema({
    file: { type: String, required: true,unique:true },
    playCount: { type: Number ,default:0},
  }, {
    timestamps: true
  });

  return mongooseClient.model('favorite', favorite);
};
