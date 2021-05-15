const express = require('express');
const bodyParser = require('body-parser');

var http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs');
const Busboy = require('busboy');

const PORT = process.argv[2];

const app = express()
app.use(bodyParser.json())

app.post('/fileupload', (req, res) => {
    console.log(req)
    http.createServer(function(req, res) {
        if (req.method === 'POST') {
          var busboy = new Busboy({ headers: req.headers });
          busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            var saveTo = path.join(os.tmpDir(), path.basename(fieldname));
            file.pipe(fs.createWriteStream(saveTo));
          });
          busboy.on('finish', function() {
            res.writeHead(200, { 'Connection': 'close' });
            res.end("That's all folks!");
          });
          return req.pipe(busboy);
        }
        res.writeHead(404);
        res.end();
    })
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})