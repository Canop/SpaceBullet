var sb = sb || {};
(function(){

	var lastKey;
	var devMode = false;

	window.addEventListener('keyup', function(e) {
		var key = e.keyCode;
		console.log('Key press : ', key);
		switch (key) {
		case 27: // esc
			if (sb.mission && sb.mission.id) {
				sb.paused = true;
				sb.dialog({
					html: 'hint : if you just want to pause the game, you may hit <kbd>P</kbd> instead.',
					buttons: {
						"&#9650;": sb.openGrid,
						"Retry": sb.mission.start.bind(sb.mission),
						"Resume": sb.togglePause
					}
				});
			}
			break;
		case 68: // d
			if (lastKey==68 && /dev.html$/.test(location.pathname)) {
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


