let express = require('express')
let http = require('http')
let app = express()
let server = http.createServer(app)
let io = require('socket.io').listen(server);

app.use(express.static(__dirname))

server.listen(process.env.PORT || '8081');

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/views/index.html');
});

io.sockets.on('connection', (socket)=>{
    socket.on('message', (data)=>{
        io.sockets.emit("message",
        {
            msg: data.message,
            name: data.name
        })
    })
})