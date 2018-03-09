const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('winston');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');


const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const mongoose = require('./mongoose');

const authentication = require('./authentication');

const file_extension = require('path')
fs = require('fs');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));
app.use('/images', function(req, res) {
  // console.log("images<<<<<<<<<<<<<<<<<");
  var image_extensions = ['png', 'jpg', 'jpeg'];
  var storage1 = app.settings.musicRootDir
  var file = req.query.file;
  // var img = fs.readFileSync('/Users/dban/Music/no_image.png');
  console.log(file);
  if (file) {
    var status = 0;
    for (var i = 0; i < image_extensions.length; i++) {

      var file2image = file.replace(file_extension.extname(file), "." + image_extensions[i]);
        // console.log(storage1 + file2image);
      if (fs.existsSync(storage1 + file2image)) {
        console.log("first exist");

        var img = fs.readFileSync(storage1 + file2image);
        res.writeHead(200, {
          'Content-Type': 'image/' + image_extensions[i] + ''
        });
        res.end(img, 'binary');
        status = 1;
      } else if (fs.existsSync(storage1 + file + "." + image_extensions[i])) {
        console.log("second exist");

        var img = fs.readFileSync(storage1 + file + "." + image_extensions[i]);
        res.writeHead(200, {
          'Content-Type': 'image/' + image_extensions[i] + ''
        });
        res.crossOrigin = "anonymous";
        res.end(img, 'binary');
        status = 1;
      }
      else if (fs.existsSync(storage1 + file + "." + image_extensions[i])) {
        console.log("cover exist");
       var img = fs.readFileSync(storage1 + "cover" + "." + image_extensions[i]);
       res.writeHead(200, {
         'Content-Type': 'image/' + image_extensions[i] + ''
       });
       res.crossOrigin = "anonymous";
       res.end(img, 'binary');
       status = 1;
     }
    }
    if (status == 0) {
      var img = fs.readFileSync('public/no_image.png');
      res.setHeader("Cache-Control", "public, max-age=2592000");
      res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
      res.writeHead(200, {
        'Content-Type': 'image/png'
      });
      res.end(img, 'binary');
    }
  } else {
    res.send("no file:" + file);
  }
})
// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(mongoose);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);





module.exports = app;
