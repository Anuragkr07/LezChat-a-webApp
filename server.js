const express=require("express");
const http=require("http");
const { SocketAddress } = require("net");

const app=express();

const server=require("http").createServer(app);
const port=process.env.PORT || 4000;

app.use(express.static(__dirname + '/public'));

app.get('/',(req, res) =>{
    res.sendFile(__dirname +'/index.html')
});


/* Socket.io setup */

const io=require("socket.io")(server);
var users={};

io.on("connect",(socket) =>{
    socket.on("new-user-joined",(username) =>{
        users[socket.id]=username;
        socket.broadcast.emit('user-connected',username);
        io.emit("user-list",users);
    });

    socket.on("disconnect",()=>{
        socket.broadcast.emit('user-disconnected',user=users[socket.id]);
        delete users[socket.id];
        io.emit("user-list",users);
    })

    socket.on('message',(data) => {
        socket.broadcast.emit("message",{user:data.user,msg:data.msg});
    })
});

/* Socket.io setup ends */


server.listen(port,()=>{
    console.log("Server started on port "+port);
}); 