
var fs = require('fs');

var RaspiCam = require("raspicam");

var syncData = function(){
	var TimeStamp = (new Date()).getTime();
	var Camera = new RaspiCam({mode: 'photo', output: TimeStamp+'.png', encoding: 'png', timeout: 200});//, 'nopreview': true
	Camera.start();
	Camera.on("read", function(err, timestamp, filename){
		setTimeout(function(){
			syncData();
		}, 8000);
	});
}
syncData();


function copyFile(source, target, cb){
	var cbCalled = false;

	var rd = fs.createReadStream(source);
		rd.on("error", function(err) {
		done(err);
	});
	var wr = fs.createWriteStream(target);
		wr.on("error", function(err) {
		done(err);
	});
	wr.on("close", function(ex) {
		done();
	});
	rd.pipe(wr);

	function done(err) {
		if (!cbCalled) {
			cb(err);
			cbCalled = true;
		}
	}
}


/*/	Clean-up before program exits
process.stdin.resume();
function exitHandler(options, err){
	if (options.cleanup){
		console.log('clean');
	}
	//
	if (err)
		console.log(err.stack);
	//
	if (options.exit)
		process.exit();
}
process.on('exit', exitHandler.bind(null,{cleanup:true}));
//*/

