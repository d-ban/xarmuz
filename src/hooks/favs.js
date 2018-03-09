// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
var moment = require('moment')
var mpd = require('mpd'),
cmd = mpd.cmd
cmd = mpd.cmd
// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
  let command = context.params.query.command
  let path = context.params.query.path

  const currentsong = new Promise((resolve, reject) => {
    function demo(file,i){
      console.log(file,i);
      context.app.service('storage').find({
        query:{
          file:file,
          $limit:1
        }
      }).then((response2) => {
      if (response2.data.length) {
        context.result.data[i]=response2.data[0];
        // console.log(  context.result.data[i]);
      //   // resolve([true,mpdTrack]);
      }else {
      //   console.log(response2);
      }
      if (i+1 === context.result.data.length) {
        console.log("last one");
        resolve(context.result);
      }
      }).catch(error2 => {
      console.log("error2")
      })


    }
    let me = 0
    for (var i = 0; i < context.result.data.length; i++) {
      me = me+1
    demo (context.result.data[i].file,i)
    }
    if (context.result.data.length===0) {
      resolve(context.result);
    }
    // console.log(context.result.data.length,me);

    });


    return currentsong.then(res => {
      return new Promise((resolve, reject) => {

        context.result=res
        resolve(context);
      });
    });
  };
};
