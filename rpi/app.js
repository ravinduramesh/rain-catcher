
var fs = require('fs');
var Gpio = require('pigpio').Gpio;
var Servo = new Gpio(4, {mode: Gpio.OUTPUT});

var RaspiCam = require("raspicam");

var start = 800;
var inc = 400;
var pos = 3;

var TimeStamp;// = parseInt((new Date()).getTime() / 1000);
var dataPacket = false;// = {};

var step = function(){
	pos += 1;
	//
	if (pos == 4){
		pos = 0;
		TimeStamp = parseInt((new Date()).getTime() / 1000);
		if (dataPacket != false)
			upload_data(JSON.stringify(dataPacket));
		dataPacket = JSON.parse(fs.readFileSync(__dirname+'/data.json')) || {};
		dataPacket.timestamp = TimeStamp;
		dataPacket.images = {};
	}
	Servo.servoWrite(start + inc*pos);
	//console.log(start+' + ('+inc+' * '+pos+')');
	//
	//	Give time to servo to move
	setTimeout(function(){
		var FileName = TimeStamp+'-'+pos+'.png';
		// Take picture and add to buffer
		new take_photo(FileName,
			function(image){
				//console.log(image);
				dataPacket.images[pos] = image;
				// Move to next position
				setTimeout(function(){step();}, 1000);
			});
	}, 360);
}
step();

//	Takes a photo from webcam and returns BASE64
var take_photo = function(filename, callback){
	var Camera = new RaspiCam({mode: 'photo', output: filename, encoding: 'png', timeout: 200, 'nopreview': true});
	var calledback = false;
	Camera.start();
	Camera.on("read", function(err, timestamp, filename){
		//console.log(filename);
		//
		if (calledback)
			return false;
		calledback = true;
		//
		setTimeout(function(){
			try{
				var bitmap = fs.readFileSync(__dirname+'/'+filename.substr(0, filename.length-1));
				bitmap = new Buffer(bitmap).toString('base64');
				fs.unlink(__dirname+'/'+filename.substr(0, filename.length-1));
			}catch(e){
				bitmap = false;
				fs.unlink(__dirname+'/'+filename);
			}
			callback(bitmap);
			Camera.stop();}, 1600);
	});
}

var upload_data = function(data){
	console.log(data);
}



