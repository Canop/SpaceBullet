var sb = sb || {};
window['sb']=sb; // so that minification doesn't prevent not minified files to find sb
(function(){
	
	sb.isDev = /dev.html$/.test(location.pathname); // more debug options and more logs if the page is dev.html

	// a shim for the missing console.log in IE
	if (!window.console) window.console = {log: function(){}};

	sb.G = 0.29; // sets the attraction strenght (technically the weight of the bullet is inside)
	sb.paused = false; // if true, the bullet and sb.re timers are paused but other animations or user interactions can go on
	sb.NB_MISSIONS = 18; // mission-0 isn't counted so it's also the max id

	var $pauseDiv;

	sb.startMission = function(id) {
		if (sb.mission) sb.mission.remove();
		if (id==+id) {
			if (id>sb.NB_MISSIONS) {
				sb.dialog({
					html :
						"<p>Damn. No more mission :(</p>" +
						"<p>I'm sorry, but I just started developping SpaceBullet, come back later for more.</p>",
					buttons : { "Home": sb.openGrid }
				});	
				return;
			}
			if (id && !sb.checkPreviousMissionsAreDone(id)) {
				sb.dialog({
					html :
						"<p>You must win previous missions before starting this one.</p>",
					buttons : { "Home": sb.openGrid }
				});					
				return;
			}
		}
		ImgLoader.done(function(){
			sb.mission = new sb.Mission(id);
			sb.mission.load(function(){sb.mission.start()});
		});
	}

	sb.start = function(){
		var canvas = document.getElementById('main_canvas');
		sb.stage = stage = new createjs.Stage("main_canvas");
		var onresize = function(){
			sb.w = canvas.width = canvas.clientWidth;
			sb.h = canvas.height = canvas.clientHeight;
			stage.regX = -sb.w/2; stage.regY = -sb.h/2; 
		}
		onresize();
		window.addEventListener('resize', onresize);
		sb.re.start();
		
		var matches = location.search.match(/\bm=([^&]+)/);
		if (matches) {
			sb.startMission(matches[1]);
		} else {
			sb.startMission(0);
			sb.intro();
		}
		sb.menu.init();
	}
	
	sb.pause = function(bool) {
		sb.paused = bool;
		if (!$pauseDiv) {
			$pauseDiv = $('<div id=pause><h1>Game Paused</h1><p>You can still move the planets</p></div>').hide().appendTo(document.body);
		}
		$pauseDiv.toggle(bool)
	}
	
})();


