var sb = sb || {};
(function(){

	var lastKey;
	var devMode = false;

	window.addEventListener('keyup', function(e) {
		var key = e.keyCode;
		console.log('Key press : ', key);
		switch (key) {
		case 68: // d
			if (lastKey==68) {
				key = 0;
				devMode = !devMode;
				if (devMode) {
					sb.guns.forEach(function(gun){
						gun.path.on();
					});
				} else {
					sb.guns.forEach(function(gun){
						gun.path.off();
					});
				}
			}
			break;
		case 80: // p
			sb.togglePause();
			break;
		}
		lastKey = key;
	});
	
})();


