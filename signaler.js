// 2013, Muaz Khan - https://github.com/muaz-khan
// MIT License     - https://www.webrtc-experiment.com/licence/
// Documentation   - https://github.com/muaz-khan/WebRTC-Experiment/blob/master/socketio-over-nodejs

var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(8080);

// ----------------------------------socket.io

var channels = {};

io.sockets.on('connection', function (socket) {
    var initiatorChannel = '';
    if (!io.isConnected)
        io.isConnected = true;

    socket.on('new-channel', function (data) {
        channels[data.channel] = data.channel;
        onNewNamespace(data.channel, data.sender);
    });

    socket.on('presence', function (channel) {
        var isChannelPresent = !! channels[channel];
        socket.emit('presence', isChannelPresent);
        if (!isChannelPresent)
            initiatorChannel = channel;
    });

    socket.on('disconnect', function (channel) {
        if (initiatorChannel)
            channels[initiatorChannel] = null;
    });
});

function onNewNamespace(channel, sender) {
    io.of('/' + channel).on('connection', function (socket) {
        if (io.isConnected) {
            io.isConnected = false;
            socket.emit('connect', true);
        }

        socket.on('message', function (data) {
            if (data.sender == sender)
                socket.broadcast.emit('message', data.data);
        });
    });
}

// ----------------------------------extras

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/static/video-conferencing/index.html');
});

app.get('/conference.js', function (req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendfile(__dirname + '/static/video-conferencing/conference.js');
});

app.get('/conference-ui.js', function (req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendfile(__dirname + '/static/video-conferencing/conference-ui.js');
});

app.get('/chat', function (req, res) {
    res.sendfile(__dirname + '/static/text-chat.html');
});

app.get('/RTCMultiConnection', function (req, res) {
    res.sendfile(__dirname + '/static/RTCMultiConnection/index.html');
});

app.get('/RTCMultiConnection2', function (req, res) {
    res.sendfile(__dirname + '/static/RTCMultiConnection/index2.html');
});



app.get('/broadcast', function (req, res) {
    res.sendfile(__dirname + '/static/mySample/index.html');
});
app.get('/style.css', function (req, res) {
    res.sendfile(__dirname + '/static/mySample/style.css');
});
app.get('/stylex.css', function (req, res) {
    res.sendfile(__dirname + '/static/mySample/stylex.css');
});
app.get('/broadcast.js', function (req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendfile(__dirname + '/static/mySample/broadcast.js');
});
app.get('/app.js', function (req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendfile(__dirname + '/static/mySample/app.js');
});
app.get('/socketio.js', function (req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendfile(__dirname + '/static/mySample/socketio.js');
});
app.get('/RTCPeerConnection-v1.5.js', function (req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendfile(__dirname + '/static/mySample/RTCPeerConnection-v1.5.js');
});



app.get('/socketio.js', function (req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendfile(__dirname + '/static/socket.io.js');
});
