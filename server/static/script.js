
var station = 8;
var images = document.querySelectorAll('img.img');

function refreshImages(){
	var t = (new Date()).getTime();
	for (var i = 0; i < 4; i++)
		new arc.ajax('static/images/'+station+'/'+i+'.png?t='+t,
			{
				callback: function(data, i){
					images[3-i].setAttribute('src', data.responseText);
				}
			}, i);
	setTimeout(refreshImages, 30000);
}
refreshImages();
