const express = require('express');
const bodyParser = require('body-parser');
var ffmpeg = require('fluent-ffmpeg');

var multer  = require('multer')
var upload = multer({dest: './uploads/' })

const PORT = process.argv[2];

const app = express()
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))
app.post('/fileupload', upload.any(), (req, res) => {
  console.log(req)
  console.log(req.body)
  console.log(req.files)
  console.log(req.files[0].path)
  test(req.files[0].path)
  res.sendStatus(200)
})

function test(path){
  ffmpeg(path)
        .takeScreenshots({
        count: 3,
        timemarks: [ `${getRandomArbitrary(0,8)}`, `${getRandomArbitrary(0,8)}`, `${getRandomArbitrary(0,8)}` ] // number of seconds
      }, './ss', function(err) {
        console.log('screenshots were saved')
      });
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})