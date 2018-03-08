// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('@feathersjs/errors');
var mpd = require('mpd'),
cmd = mpd.cmd
cmd = mpd.cmd
// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const authorisation = new Promise((resolve, reject) => {
    var authorized = new errors.Forbidden();
         authorized.message = "Request sent";
         authorized.code = 200;


         for (var i = 0; i < context.data.data.length; i++) {
           context.app.client.sendCommand(cmd("add", [context.data.data[i].file]), function(err, currentsongResponse) {
             context.app.client.sendCommand(cmd("status", []), function(err, currentsongResponse) {
               var csr1 = mpd.parseKeyValueMessage(currentsongResponse);
               var from = csr1.playlistlength-1
               var to = csr1.nextsong
               console.log(from,to);
               if (from && to) {
                 context.app.client.sendCommand(cmd("move", [from,to,]), function(err, currentsongResponse) {
                   // var csr1 = mpd.parseKeyValueMessage(currentsongResponse);
                   // console.log(currentsongResponse);
                   // resolve({"currentsong":"currentsongResponse"})
                 });
               }

               // resolve({"currentsong":csr1})
             });
           });
         }

         reject(authorized);
       })

      return authorisation.then(lfRespo => {

        return (context);
      })


    // return context;
  };
};
