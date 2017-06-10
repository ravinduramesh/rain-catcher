
var Gpio = require('pigpio').Gpio;
var servo = new Gpio(4, {mode: Gpio.OUTPUT});

/*var pwidth = 500;
var inc = 200;

setInterval(function(){
	servo.servoWrite(pwidth);
	pwidth += inc;
	console.log(pwidth);
	if (pwidth >= 2500)
		inc = -200;
	else if (pwidth <= 500)
		inc = 200;
}, 1000);*/

var start = 500;
var end = 2500;
var inc = 200;
var pos = 0;

var syncData = function(){
	servo.servoWrite(start + inc*pos);
	pos += 1;
	//
	if (pos == 10)
		pos = 0;
	//
	setTimeout(function(){
		// Take picture and add to buffer
		//
		setTimeout(syncData, 1000);
	}, pos == 0 ? 1500 : 500);
}
