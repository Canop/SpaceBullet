var sb = sb || {};
(function(){

	// the "grid" is the screen where you can see the available missions and start one
		
	var $d;

	sb.openGrid = function() {
		if ($d) $d.remove();
		if (sb.mission && sb.mission.id) sb.mission.remove(); // this ensures the mission doesn't go on
		$d = $('<div id=grid/>').hide();
		var fnd = sb.getFirstNotDone();
		$('<h1>Choose a mission</h1>').appendTo($d);
		$d.append($('<span>').addClass('mission').html("&#9650;")
			.addClass('home')
			.click(function(){
				$d.fadeOut(sb.intro);
			})
		);
		for (var i=1; i<=fnd && i<=sb.NB_MISSIONS; i++) {
			(function(i) {
				$d.append($('<span>').text(i)
					.addClass('mission').addClass(i==fnd ? 'not_done' : 'done')
					.click(function(){
						$d.fadeOut(function(){
							sb.startMission(i);
						});
					})
				);
			})(i);
		}
		$('<p>or</p>').appendTo($d).append($('<span class=button>create your own mission</span>')
			.addClass('button')
			.click(function(){
				$d.fadeOut(sb.openEditor);
			})
		);
		$d.appendTo(document.body).fadeIn();
	}
	
})();
