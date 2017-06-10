
var Gpio = require('pigpio').Gpio;
var servo = new Gpio(4, {mode: Gpio.OUTPUT});
var pwidth = 500;
var inc = 200;

setInterval(function(){
	servo.servoWrite(pwidth);
	pwidth += inc;
	console.log(pwidth);
	if (pwidth >= 2500)
		inc = -200;
	else if (pwidth <= 500)
		inc = 200;
}, 1000);