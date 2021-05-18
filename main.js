const express = require('express');
const bodyParser = require('body-parser');
const shell = require('shelljs');
const http = require('http');
var amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
// const CircularJSON = require('circular-json');
var flatted = require('flatted');

var ffmpeg = require('fluent-ffmpeg');
const PDFDocument = require('pdfkit');

// var multer  = require('multer')
// var upload = multer({dest: './uploads/' })

const path = require('path');
const fs = require('fs');

const PORT = process.argv[2];

let ssList = []
let emailCurrent = '';

const app = express()
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))

var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: 'fuera.deo.tunja@gmail.com',
    pass: 'lalala123..'
  }
});

amqp.connect('amqp://localhost', function(error, connection) {
    connection.createChannel(function(error, channel) {
        var queue = 'task_queue';
        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
          let result = flatted.parse(msg.content.toString())
          console.log(result)
          emailCurrent = result.email
          downloadVideo(result.path)
          console.log(" [x] Received %s");
          fillRandomSS();
          
          setTimeout(function() {
            console.log(" [x] Done");
              channel.ack(msg);
              takeScreenshots('./uploads/video.mp4')
          }, 20000);
        }, {
            noAck: false
        });
    });
});

async function downloadVideo(pathC){
  const url = pathC
  const file = fs.createWriteStream("uploads/video.mp4");
  await http.get(url, function(response) {
  response.pipe(file);
  });
}

function takeScreenshots(pathC){
  shell.exec(`./deleteSS.sh`)
  ffmpeg(pathC).takeScreenshots({
    count: 10,
    timemarks: [ `${ssList[0].number}`, `${ssList[1].number}`, `${ssList[2].number}`, 
      `${ssList[3].number}`,`${ssList[4].number}`, `${ssList[5].number}`, 
      `${ssList[6].number}`, `${ssList[7].number}`, `${ssList[8].number}`, `${ssList[9].number}`] // number of seconds
  }, './ss', function(err, filenames) {
    if(err){
      throw err;
    }
    console.log(filenames);
    console.log('screenshots were saved');
  });
  // await readDir();
  setTimeout(() => readDir(), 10000)
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function fillRandomSS(){
  for (let i = 0; i < 10; i++) {
    ssList.push({number: getRandomArbitrary(0, 8)})
 }
 console.log(ssList)
}

function readDir(){
  let doc = new PDFDocument({ size: 'A4' });
  doc.pipe(fs.createWriteStream('output.pdf'));
  doc.fontSize(25).text('Pantallazos del vídeo', 100, 100);
  let count = 0;
  const directoryPath = path.join(__dirname, 'ss');
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
      //ssList[count].path = `ss/${file}`;
      console.log(file); 
      doc.addPage()
        .text(`Momento de la captura: ${ssList[count].number} segundos`)
        .image(`ss/${file}`, {
          fit: [250, 300],
          align: 'center',
          valign: 'center'})
      count++;
    });
    doc.end();
    console.log('Listo...')
    sendEmail(emailCurrent,'./output.pdf')
    //createPDF()
  });
}

function createPDF(){
  let doc = new PDFDocument({ size: 'A4' });
  doc.pipe(fs.createWriteStream('output.pdf'));
  doc.fontSize(25).text('Pantallazos del vídeo', 100, 100);
  ssList.forEach(element => {
    doc.addPage()
    .text(`Momento de la captura: ${element.number} segundos`)
    .image(element.path, {
      fit: [250, 300],
      align: 'center',
      valign: 'center'})
  })
  doc.end();
}

function sendEmail(mail, file){
  transporter.sendMail({
      from: 'fuera.deo.tunja@gmail.com',
      to: mail,
      subject: 'Envio de reporte PDF',
      text: 'Reporte Sistemas Distribuidos Proyecto',
      attachments: [
          {
              filename: 'Reporte Distribuidos Proyecto',
              path: file,                                         
              contentType: 'application/pdf'
          }]
  });
}

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})