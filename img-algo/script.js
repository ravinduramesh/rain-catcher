
//var img1 = document.getElementById('img1');

var cvs1 = document.getElementById('cvs1');
var cvs2 = document.getElementById('cvs2');

var cumulus = new Image();
var id = cvs1.getContext('2d').createImageData(1, 1);
var d  = id.data;

cumulus.src = 'cumulus_1.jpg';
cumulus.onload = function(){

	cvs1.height = cumulus.height;
	cvs1.width = cumulus.width;
	cvs1.getContext('2d').drawImage(cumulus, 0, 0, cumulus.width, cumulus.height);
	//
	cvs2.height = cumulus.height;
	cvs2.width = cumulus.width;
	//
	var pixel;
	var totals = [0, 0, 0, 0];
	var count = 0;
	for (var i = 0; i < cumulus.width; i++)
		for (var j = 0; j < cumulus.height; j++){
			pixel = cvs1.getContext('2d').getImageData(i, j, 1, 1).data;
			for (var k = 0; k < 4; k++)
				totals[k] += pixel[k] / 16;
			count += 1;
			d[0] = 128 * parseInt(pixel[0] / 128);
			d[1] = 128 * parseInt(pixel[1] / 128);
			d[2] = 128 * parseInt(pixel[2] / 128);
			d[3] = 200;
			cvs2.getContext('2d').putImageData(id, i, j);
		}

	//console.log(totals);
	//console.log(count);
	for (var k = 0; k < 4; k++)
		totals[k] = parseInt(16 * totals[k] / count);
	console.log(totals);
	document.body.style.backgroundColor = 'rgb('+totals[0]+', '+totals[1]+', '+totals[2]+')';

}
