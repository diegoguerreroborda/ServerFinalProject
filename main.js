const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var multiparty = require('multiparty');
//var ffmpeg = require('ffmpeg');
var ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

//var EXT_RE = /(\.[_\-a-zA-Z0-9]{0,16}).*/g;
/*
var options = {
  //uploadDir : path.join(__dirname,'../public/videos')
  uploadDir: __dirname + '/tmp'
}
*/

var form = new multiparty.Form();

const PORT = process.argv[2];

const app = express()
app.use(bodyParser.json())


app.post('/fileupload', (req, res) => {
  console.log(req)
  if (req.url === '/fileupload' && req.method === 'POST') {
    form.parse(req, function(err, fields, files) {
      console.log(fields.description)
      console.log(files.video[0].path);
      console.log(files.video[0]);
      fs.createWriteStream(files.video[0].path);
      /*
      ffmpeg(fs.createReadStream(files.video[0].path))
        .screenshots({
          timestamps: [0],
          filename: 'thumbnail-at-%s-seconds.png',
          folder: './path',
          size: '320x240'
      });
      */
      //test(files.video[0].path)
      
     /*
      var proc = new ffmpeg('11.mp4')
      .takeScreenshots({
        count: 2,
        timemarks: [ '50%', '75%' ],
        filename: '%b_screenshot_%w_%i'
      }, 'test_screenshot/', function(err, filenames) {
        console.log(filenames);
        console.log('screenshots were saved');
      });
      */
    });
  }
  res.sendStatus(200)
})

function test(){
  ffmpeg('./tmp/QAVUSJFB_FLVYrX5km5ctzAi.mp4')
        .takeScreenshots({
        count: 1,
        timemarks: [ '4' ] // number of seconds
      }, './ss', function(err) {
        console.log('screenshots were saved')
      });
}


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})