
var fs = require('fs');
var mysql = require('mysql');
var qs = require('querystring');
var express = require('express');

var config = JSON.parse(fs.readFileSync(__dirname+'/config.json', 'UTF-8'));

//	-----------------------------------------------------------------------------
//	Keep a persistant connection to the database (reconnect after an error or disconnect)
//	-----------------------------------------------------------------------------
if (typeof config.databaseConnection == 'undefined' || typeof config.databaseConnection.retryMinTimeout == 'undefined')
	config.databaseConnection = {retryMinTimeout: 2000, retryMaxTimeout: 60000};
var connection, retryTimeout = config.databaseConnection.retryMinTimeout;
function persistantConnection(){
	connection = mysql.createConnection(config.database);
	connection.connect(
		function (err){
			if (err){
				console.log('Error connecting to database: '+err.code);
				setTimeout(persistantConnection, retryTimeout);
				console.log('Retrying in '+(retryTimeout / 1000)+' seconds');
				if (retryTimeout < config.databaseConnection.retryMaxTimeout)
					retryTimeout += 1000;
			}
			else{
				retryTimeout = config.databaseConnection.retryMinTimeout;
				console.log('Connected to database');
			}
		});
	connection.on('error',
		function (err){
			console.log('Database error: '+err.code);
			if (err.code === 'PROTOCOL_CONNECTION_LOST')
				persistantConnection();
		});
}
persistantConnection();

var app = express();

//	-----------------------------------------------------------------------------
//	Deliver the base template of SPA
//	-----------------------------------------------------------------------------
app.get('/', function (req, res){
	res.send(loadTemplatePart('base.html', req));
});

//	-----------------------------------------------------------------------------
//	API Endpoint to receive data
//	-----------------------------------------------------------------------------
app.get('/api/put', function (req, res){
	//	Needs to authenticate the RPi module
	//
	handlePost(req, function(data){
		console.log(data);
	});
});



app.listen(config.listenPort, function (){
	console.log('RainCatcher server is listening on port '+config.listenPort);
});

// --------------------------------------------------------------------------

//	Handler for multipart POST request/response body
function handlePost(req, callback){
	var body = '';
	req.on('data', function (data){
		body += data;
		if (body.length > 1e6)
			req.connection.destroy();
	});
	req.on('end', function (data){
		var post = body;
		try{
			post = JSON.parse(post);
		}
		catch(e){
			try{
				post = qs.parse(post);
			}
			catch(e){}
		}
		callback(post);
	});
}

function loadTemplatePart(template, req){
	try{
		return fs.readFileSync('./templates/'+template, 'utf8');
	}
	catch(e){
		return '<h2>Page Not Found</h2>';
	}
}

Date.prototype.sqlFormatted = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString();
	var dd  = this.getDate().toString();
	return yyyy +'-'+ (mm[1]?mm:"0"+mm[0]) +'-'+ (dd[1]?dd:"0"+dd[0]);
};

function isset(obj){
	return typeof obj != 'undefined';
}
