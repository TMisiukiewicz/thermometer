const app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var weather = require('weather-js');

var jfive = require('johnny-five');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function() {
    console.log('Listening on port 3000');
});


var board = new jfive.Board();

board.on('ready', function() {
    var led = new jfive.Led(13);
    
    var thermometer = new jfive.Thermometer({
        controller: "DS18B20",
        pin: 2
    });

    io.on('connection', function(socket){
        console.log('a user connected');
        
        weather.find({search: 'Bialystok, Poland', degreeType: 'C'}, function(err, result) {
            if(err) console.log(err);

            io.emit('outside', {celsius: result[0].current.temperature});
          });

        thermometer.on('change', function() {
            console.log(this.celsius)
            led.pulse();
            io.emit('temperature', {celsius: this.celsius});
        });

      });

});