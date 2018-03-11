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
  cmd = mpd.cmd

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
        // set volume
        // console.log(playResponse);
        app.service('storage').find({
                      query: {
                        file: playResponse.currentsong.file
                      }
                    }).then((fromStorage) => {
                      // console.log(fromStorage);
                      if (fromStorage.data[0].vol>0) {
                        app.client.sendCommand(cmd("setvol", [fromStorage.data[0].vol]), function(err, currentsongResponse) {
                          console.log("set new volume",currentsongResponse);
                        });
                      }else {
                        let vol = 80
                        app.client.sendCommand(cmd("setvol", [vol]), function(err, currentsongResponse) {
                          console.log("set default volume",vol,currentsongResponse);
                        });
                      }
                    });

        // console.log("playResponse",playResponse);
        let songDuration = (parseInt(playResponse.status.duration)/2)*1000
        // songDuration = 3000
        console.log("wait",songDuration);
        clearTimeout(wait)
      wait = setTimeout(function() {
        console.log(songDuration);
        Promise.all([
          app.service('played').find({
            query:{
              file:playResponse.currentsong.file
              // $sort:{createdAt:-1},
              // $limit:1
            }
          })
        ]).then(([playedResponse]) =>{

        if (playedResponse.data.length>0 && playedResponse.data[0].file!==playResponse.status.file) {
          // console.log("Nova stvar");
          // console.log("unesi novu stvar",playResponse.currentsong.file);

          app.service('played').create({file:playResponse.currentsong.file}).then((alreadyPLayed)=>{
            // console.log("alreadyPLayed times",playedResponse.data.length);
            app.service('favorite').patch(null, { playCount: playedResponse.data.length },{query:{file:playResponse.currentsong.file}}).then((favPlayCount)=>{
              // console.log("favPlayCount times",favPlayCount);
            })
          })
        }else if (playedResponse.data.length===0) {
          // console.log("Prva stvar");
          // console.log("unesi novu stvar");
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
  app.client.on('system-mixer', function() {
    console.log("vol change");
    app.service('played').emit('created', {
      message:"vol changed"
    });
    // clearTimeout(waitPlaylist)
  // waitPlaylist = setTimeout(function() {
    // app.service('queue').create({})
  // },5000);
  });
};
