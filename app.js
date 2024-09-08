const express = require('express');
const app = express();
const path = require('path');

const http = require('http');

const socketIo = require('socket.io');   
const server = http.createServer(app); //socket.io ko chalanay k liye http ka server chahiye hota hai
const io = socketIo(server); //io is a socket .io server

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

//request jaha par aayege
io.on("connection", function (socket) {
    console.log("connected");

    //backend pai location send karne hai
    socket.on("send-location", function (data){
        io.emit("receive-location", {id: socket.id, ...data}); //sabko bhejdo location and socket ki ek unique id hoti hai, har individual ki ek socket id hoti hai
    })
   socket.on("disconnect", function(){
       io.emit("user-disconnected", socket.id);
   })
})  

app.get('/', (req, res) => {
    res.render('index');    
})

server.listen(3000,(req, res) => {
    console.log("Server is running on port 3000");
})