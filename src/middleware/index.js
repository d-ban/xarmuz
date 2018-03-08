var moment = require('moment');

let wait


module.exports = function (app) {
  // Add your custom middleware here. Remember, that
  // in Express the order matters
  console.log(">>>>>>>>>>>> midleware");
  // const app = this; // eslint-disable-line no-unused-vars

  var mpd = require('mpd')
  app.client = mpd.connect({
    port: 6600,
    host: app.settings.mpdHost,
  });

  app.client.on('system-player', function() {
      console.log("system-player O");

      setTimeout(function() {
      Promise.all([
        app.service('play').find({
          query: {
            command:'status',
          }
        })


      ]).then(([playResponse]) => {
        // console.log("playResponse",playResponse);
        let songDuration = (parseInt(playResponse.status.duration)/2)*1000
        console.log("wait",songDuration);
        clearTimeout(wait)
      wait = setTimeout(function() {
        console.log(songDuration);
        Promise.all([
          app.service('played').find({
            query:{
              $sort:{createdAt:-1},
              $limit:1
            }
          })
        ]).then(([playedResponse]) =>{

        if (playedResponse.data.length>0 && playedResponse.data[0].file!==playResponse.status.file) {
          console.log("Nova stvar");
          console.log("unesi novu stvar",playResponse.currentsong.file);

          app.service('played').create({file:playResponse.currentsong.file})
        }else if (playedResponse.data.length===0) {
          console.log("Prva stvar");
          console.log("unesi novu stvar");
          // let curentTime = moment().format('YYYY-MM-DD HH:mm:ss')
          // let colect = {}
          // colect.createdAt=curentTime
          // colect.file=playResponse.status.file
          app.service('played').create({file:playResponse.currentsong.file})
        }
      }).catch(playedError => {
          console.log(playedError);
        })
      },songDuration);
          // let curentTime = moment().format('YYYY-MM-DD HH:mm:ss')
          // let colect = {}
          // colect.createdAt=curentTime
          // colect.file=playResponse.status.file
          console.log("emit");
          app.service('played').emit('created', {
            file:playResponse.currentsong.file
          });

      }).catch(error => {
        console.log("jep er play status",error);
      })

    },500);

  });

  let waitPlaylist
  app.client.on('system-playlist', function() {
    console.log("playlist queue create");
    // clearTimeout(waitPlaylist)
  // waitPlaylist = setTimeout(function() {
    // app.service('queue').create({})
  // },5000);
  });
};
