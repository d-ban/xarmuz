// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
var moment = require('moment')
var mpd = require('mpd'),
cmd = mpd.cmd
// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
  let command = context.params.query.command
  let path = context.params.query.path
  console.log("play hook");
  const currentsong = new Promise((resolve, reject) => {

if (command==='update') {

  var storageUpdater = function(mpdTrack) {
  return new Promise(function(resolve, reject) {
        Promise.all([
        context.app.service('storage').find({
          query:{
            file:mpdTrack.file,
            $limit:1
          }
        })
      ]).then(([response2]) => {
        if (response2.data.length<=0) {
          resolve([true,mpdTrack]);
        }else {
          resolve([false,mpdTrack]);
        }
        }).catch(error2 => {
        console.log(error2)
        })
  });
}

  context.app.client.sendCommand(cmd("listall", [path]), function(err, listallResponse) {
  if (err) {
    console.log(err);
  }
  var listall = mpd.parseArrayMessage(listallResponse);
  let getFiles=[]
  for (var i = 0; i < listall.length; i++) {
    if (listall[i].file) {
      getFiles.push(listall[i])
    }
  }

  for (var i = 0; i < getFiles.length; i++) {
    if (getFiles[i].file) {

    storageUpdater(getFiles[i]).then(function(newTrack) {
      if (newTrack[0]) {
        // console.log(newTrack[1]);
        context.app.client.sendCommand(cmd("find", ['file',newTrack[1].file]), function(err, findResponse) {
          console.log(findResponse);
          let mpdTrackData = mpd.parseKeyValueMessage(findResponse)
          // remove a property from a JavaScript object
          mpdTrackData.vol=80
          delete mpdTrackData.Pos;
          // mpdTrackData.Pos=0
          // mpdTrackData.hash_file=mpdTrackData.file
          // mpdTrackData.createdAt= moment().format('YYYY-MM-DD HH:mm:ss')
          // console.log(mpdTrackData);
          context.app.service('storage').create(mpdTrackData)

        });

      }
    })



  }else {
    console.log("no file",listall[i]);
  }

}
  resolve({"command":command,"path":path})
  });

}
else if (command==='playNext') {
  // console.log(path);
  context.app.client.sendCommand(cmd("add", [path]), function(err, currentsongResponse) {
    context.app.client.sendCommand(cmd("status", []), function(err, currentsongResponse) {
      var csr1 = mpd.parseKeyValueMessage(currentsongResponse);
      var from = csr1.playlistlength-1
      var to = csr1.nextsong
      // console.log(from,to);
      context.app.client.sendCommand(cmd("move", [from,to,]), function(err, currentsongResponse) {
        // var csr1 = mpd.parseKeyValueMessage(currentsongResponse);
        // console.log(currentsongResponse);
        resolve({"file":path})
      });
      // resolve({"currentsong":csr1})
    });
  });
}
else if (command==='random') {
  let state = context.params.query.state
  context.app.client.sendCommand(cmd("random", [state]), function(err, currentsongResponse) {
    context.app.client.sendCommand(cmd("status", []), function(err, currentsongResponse) {
      var csr1 = mpd.parseKeyValueMessage(currentsongResponse);
      context.app.client.sendCommand(cmd("currentsong", []), function(err, currentsongResponse) {
        var csr2 = mpd.parseKeyValueMessage(currentsongResponse);
        context.app.service('favorite').find({
                      query: {
                        file: csr2.file,
                        $limit: 0
                      }
                    }).then((usersCount) => {
                      // console.log(usersCount);
                      csr2.favorite=usersCount.total
                      // resolve({"status":csr1,"currentsong":csr2})
                      context.app.client.sendCommand(cmd("playlistinfo", [csr1.nextsong]), function(err, nextsongData) {
                          let nextsong = mpd.parseKeyValueMessage(nextsongData)

                          resolve({"status":csr1,"currentsong":csr2,"nextsong":nextsong})
                        });
                    });
        // resolve({"status":csr1,"currentsong":csr2})
      });
    });
  });
}
else if (command==='vol') {
  let state = context.params.query.state
  console.log(state);
  context.app.client.sendCommand(cmd("setvol", [state]), function(err, currentsongResponse) {
    resolve({"vol":state})
  });
}
else {
  console.log("else");
  context.app.client.sendCommand(cmd(command, []), function(err, currentsongResponse) {
    var csr = ""
    if (currentsongResponse) {
      csr = mpd.parseKeyValueMessage(currentsongResponse);


    // console.log(csr);
    context.app.client.sendCommand(cmd("currentsong", []), function(err, currentsongResponse) {
      var csr1 = mpd.parseKeyValueMessage(currentsongResponse);
      // console.log(csr1.file);
      context.app.service('favorite').find({
                    query: {
                      file: csr1.file
                    }
                  }).then((usersCount) => {
                    // console.log(usersCount);
                    csr1.favorite=usersCount.total
                    // console.log(csr.nextsong);
                    context.app.client.sendCommand(cmd("playlistinfo", [csr.nextsong]), function(err, nextsongData) {
                        let nextsong = mpd.parseKeyValueMessage(nextsongData)

                        resolve({"status":csr,"currentsong":csr1,"nextsong":nextsong})
                      });


                  }).catch(error2 => {
                  console.log("error2")
                  });
          });
    }else {
      console.log("else");
      resolve({"status":csr})
    }
  });

}




      // resolve({"command":command})

    });


    return currentsong.then(res => {
      return new Promise((resolve, reject) => {

        context.result=res
        resolve(context);
      });
    });
  };
};
