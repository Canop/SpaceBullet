var sb = sb || {};
(function(){

	var lastKey;
	var debugEntryMode = false;

	window.addEventListener('keyup', function(e) {
		var key = e.keyCode;
		console.log('Key press : ', key);
		switch (key) {
		case 68: // d
			if (lastKey==68) {
				key = 0;
				debugEntryMode = !debugEntryMode;
				if (debugEntryMode) {
					sb.gun.path.on();
				} else {
					sb.gun.path.off();					
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


