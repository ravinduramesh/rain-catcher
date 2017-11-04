
var station = 8;
var images = document.querySelectorAll('img.img');

function refreshImages(){
	var t = (new Date()).getTime();
	for (var i = 0; i < 4; i++)
		images[3-i].setAttribute('src', 'static/images/'+station+'/'+i+'.png?t='+t);
	setTimeout(refreshImages, 30000);
}
refreshImages();
