//import express server
let express = require('express');
//import and define file system
let fs = require('fs')
//define express server application
const APP = express();
//define the port (env is for heroku, 6969 is for local)
const PORT = process.env.PORT || 6969;
//import http and create instance using express
let httpServer = require('http').createServer(APP);
//import node static, (for serving static files)
let static = require('node-static');
//import socketIO, bind it to http server
let io = require('socket.io')(httpServer);
//define the login creds for nodemailer
const youtubedl = require('youtube-dl');
let child_process = require("child_process");

io.on("connect", function (socket){
  console.log("new client");
  socket.emit("handshake", "hello from server");
  pipeToClients(socket);
})


//tell the express app to use the current filepath (__dirname) + the public directory (for client-side)
APP.use(express.static(__dirname + '/public'));
//begin listening for incoming requests from the client
httpServer.listen(PORT, function() {
  console.log(`HTTPS server is running on port ${PORT}`);
  console.log(__dirname);
})

const video = youtubedl('https://www.youtube.com/watch?v=a2LFVWBmoiw',
  // Optional arguments passed to youtube-dl.
  ['--format=18'],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname })

  // Will be called when the download starts.
  video.on('info', function(info) {
    // console.log(info);
    console.log('Download started')
    console.log('filename: ' + info._filename)
    console.log('size: ' + info.size)
  })

  video.on('error', function(err){
    console.log(err);
  })

video.pipe(fs.createWriteStream('myvideo.mp4'))
video.on("end", function(info){
})




function pipeToClients(socket){
  let vid = fs.readFile('myvideo.mp4', function(err,data){
    if (err) throw err;
    let theData = new Buffer(data).toString('base64');
    socket.emit('vidData', theData);

  });
}
