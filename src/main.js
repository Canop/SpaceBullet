var sb = sb || {};
window['sb']=sb; // so that minification doesn't prevent not minified files to find sb
(function(){
	
	sb.isDev = /dev.html$/.test(location.pathname); // more debug options and more logs if the page is dev.html

	// a shim for the missing console.log in IE
	if (!window.console) window.console = {log: function(){}};


	sb.G = 0.29; // sets the attraction strenght (technically the weight of the bullet is inside)
	sb.scale = 1; // can be changed by missions
	sb.paused = false; // if true, the bullet and sb.re timers are paused but other animations or user interactions can go on
	sb.NB_MISSIONS = 19; // mission-0 isn't counted so it's also the max id

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

	sb.resize = function() {
		sb.w = sb.canvas.width = sb.canvas.clientWidth;
		sb.h = sb.canvas.height = sb.canvas.clientHeight;		
		sb.stage.scaleX = sb.stage.scaleY = sb.scale;
		stage.regX = -sb.w/(sb.scale*2); stage.regY = -sb.h/(sb.scale*2); 
	}

	sb.start = function(){
		sb.canvas = document.getElementById('main_canvas');
		sb.stage = stage = new createjs.Stage("main_canvas");
		window.addEventListener('resize', sb.resize);
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


