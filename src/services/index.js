const favorite = require('./favorite/favorite.service.js');
const play = require('./play/play.service.js');
const storage = require('./storage/storage.service.js');
const users = require('./users/users.service.js');
const played = require('./played/played.service.js');
const playlists = require('./playlists/playlists.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(favorite);
  app.configure(play);
  app.configure(storage);
  app.configure(users);
  app.configure(played);
  app.configure(playlists);
};
