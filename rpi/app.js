
var Gpio = require('pigpio').Gpio;
var Servo = new Gpio(4, {mode: Gpio.OUTPUT});
var RaspiCam = require("raspicam");

/*var pwidth = 500;
var inc = 200;

setInterval(function(){
	Servo.servoWrite(pwidth);
	pwidth += inc;
	console.log(pwidth);
	if (pwidth >= 2500)
		inc = -200;
	else if (pwidth <= 500)
		inc = 200;
}, 1000);*/

var start = 800;
var inc = 400;
var pos = 0;

var syncData = function(){
	console.log(start+' + ('+inc+' * '+pos+')');
	Servo.servoWrite(start + inc*pos);
	pos += 1;
	//
	if (pos == 4)
		pos = 0;
	//
	setTimeout(function(){
		// Take picture and add to buffer
		//
		// Move to next position
		setTimeout(syncData, 1000);
	}, 500);
	//pos == 0 ? 1500 : 500
}
syncData();


