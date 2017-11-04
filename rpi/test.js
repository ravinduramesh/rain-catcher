
var fs = require('fs');
var http = require('http');

//var RaspiCam = require("raspicam");

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
//syncData();


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

var apiCall = http.request(
	//{port: 80, method: 'POST', host: 'api.sky.info.lk', path: '/api/put', headers: {'Content-Type': 'application/json'}},
	{port: 8088, method: 'POST', host: '192.168.43.226', path: '/api/put', headers: {'Content-Type': 'application/json'}},
	function(response){
		/*response.setEncoding('utf8');
		handle_post(response, function(api_response){
			console.log(api_response);
		});*/
	})
.on('error', function(err){
	console.log(err);
});
//	Write data to request stream
apiCall.write('{"sdfghdfh": "eruyjertyed"}');
apiCall.end();


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

