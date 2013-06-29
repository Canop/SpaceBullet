// simple utility to load images and wait for their availability
// author : denys.seguret@gmail.com - public domain
var ImgLoader = (function(){
	var images = {};
	var callbacks = [];
	function checkAll() {
		for (var key in images) {
			if (!images[key].width) return false;
		}
		while (callbacks.length) callbacks.shift()();
		return true;
	}
	return {
		add: function(key, src) {
			var img = new Image();
			img.onload = checkAll;
			img.src = src;
			images[key] = img;
		},
		get: function(key) {
			return images[key];
		},
		done: function(callback) {
			callbacks.push(callback);
			checkAll();
		}
	}
})();
