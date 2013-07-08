var sb = sb || {};
(function(){

	var devMode = false;

	window.addEventListener('keyup', function(e) {
		var key = e.keyCode;
		console.log('Key press : ', key);
		switch (key) {
		case 27: // esc
			if (sb.mission && sb.mission.id && sb.mission.played) {
				sb.paused = true;
				var buttons = {
					"Home": sb.openGrid,
					"Retry": sb.mission.startGame.bind(sb.mission),
					"Resume": sb.togglePause
				}
				if (sb.mission.edited) buttons["Back to editor"] = sb.openEditor;
				sb.dialog({
					title: 'Game Paused',
					html: 'Hint : if you just want to pause the game, you may hit <kbd>P</kbd> instead.',
					buttons: buttons
				});
			}
			break;
		case 68: // d  -  enter dev mode
			if (/dev.html$/.test(location.pathname)) {
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
		case 77: // m  -  dumps mission data (to help make new mission files)
			console.log(JSON.stringify(sb.toMissionData()));
			break;
		case 80: // p  -  pause
			sb.togglePause();
			break;
		case 82: // r  -  resets bullet position
			if (sb.mission) sb.bullet.launch();
			break;
		}
	});
	
})();


