
var fs = require('fs');

var RaspiCam = require("raspicam");
var Camera = new RaspiCam({mode: 'photo', output: 'temp.png', encoding: 'png', timeout: 500, 'nopreview': true});

var syncData = function(){
	setTimeout(function(){
		//
		Camera.start();
		Camera.on("read", function(err, timestamp, filename){
			fs.createReadStream('temp.png').pipe(fs.createWriteStream((new Date()).getTime() + '.png'));
			console.log(filename);
			setTimeout(syncData, 1000);
			Camera.stop();
		});
		//
	}, 500);
}
syncData();


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

