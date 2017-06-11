
var Gpio = require('pigpio').Gpio;
var Servo = new Gpio(4, {mode: Gpio.OUTPUT});

var RaspiCam = require("raspicam");

var start = 800;
var inc = 400;
var pos = 0;

var TimeStamp = parseInt((new Date()).getTime() / 1000);

var syncData = function(){
	console.log(start+' + ('+inc+' * '+pos+')');
	Servo.servoWrite(start + inc*pos);
	pos += 1;
	//
	if (pos == 4){
		pos = 0;
		TimeStamp = parseInt((new Date()).getTime() / 1000);
	}
	//
	//	Give time to servo to move
	setTimeout(function(){
		var FileName = TimeStamp+'-'+pos+'.png';
		// Take picture and add to buffer
		new takePhoto(FileName,
			function(){
				// Move to next position
				setTimeout(function(){syncData();}, 1000);
			});
	}, 800);
}
syncData();

var takePhoto = function(filename, callback){
	var Camera = new RaspiCam({mode: 'photo', output: filename, encoding: 'png', timeout: 200, 'nopreview': true});
	var calledback = false;
	Camera.start();
	Camera.on("read", function(err, timestamp, filename){
		console.log(filename);
		//
		if (calledback)
			return false;
		calledback = true;
		//
		setTimeout(function(){
			callback();
			Camera.stop();}, 1000);
	});
}



