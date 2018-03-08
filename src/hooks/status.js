// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
var moment = require('moment')
var mpd = require('mpd'),
cmd = mpd.cmd
cmd = mpd.cmd
// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
  // context.app.client.sendCommand(cmd("status", []), function(err, statusResponse) {
  //   var status = mpd.parseKeyValueMessage(statusResponse);
  //   console.log(status);
  //   let storageLenght = 0
  //   let queueTime = 0
  // });
  const currentsong = new Promise((resolve, reject) => {

    context.app.client.sendCommand(cmd("currentsong", []), function(err, currentsongResponse) {
      var csr = mpd.parseKeyValueMessage(currentsongResponse);
      resolve(csr)
      // console.log(csr);
    });
    });


    return currentsong.then(res => {
      return new Promise((resolve, reject) => {

        context.result=res
        resolve(context);
      });
    });
  };
};
