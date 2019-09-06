var sb = sb || {};
window['sb']=sb; // so that minification doesn't prevent not minified files to find sb
(function(){

	sb.isDev = /dev.html$/.test(location.pathname); // more debug options and more logs if the page is dev.html

	sb.G = 0.29; // sets the attraction strenght (technically the weight of the bullet is inside)
	sb.scale = 1; // can be changed by missions
	sb.autoPauseOn = false; // if true, we'll pause when reaching a rail
	sb.paused = false; // if true, the bullet and sb.re timers are paused but other animations or user interactions can go on
	sb.bragging = false;
	sb.NB_MISSIONS = 30; // mission-0 isn't counted so it's also the max id

	sb.startMission = function(id) {
		if (sb.mission) sb.mission.remove();
		if (id==+id) {
			if (id>sb.NB_MISSIONS) {
				sb.dialog({
					html :
						"<p>Damn. No more mission :(</p>" +
						"<p>Ping me on Miaou if you finished all the previous ones!</p>",
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

	sb.resize = function(){
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

	sb.autoPause = function(bool){
		sb.autoPauseOn = bool;
		if (!sb.autoPauseOn) {
			$("#auto-pause").remove();
			return;
		}
		var $autoPauseDiv = $('<div id=auto-pause>').appendTo(document.body);
		$("<p>").text("Auto Pause On").appendTo($autoPauseDiv);
	}

	sb.pause = function(bool){
		sb.paused = bool;
		$("#pause").remove();
		if (!sb.paused) {
			return;
		}
		var $pauseDiv = $('<div id=pause>').appendTo(document.body);
		$("<h3>").text("Mission " + sb.mission.id).appendTo($pauseDiv);
		$("<h1>").text("Game Paused").appendTo($pauseDiv);
		$("<p>").text("You can move the planets while in pause.").appendTo($pauseDiv);
	}

	sb.brag = function(bool){
		if (sb.bragging==bool) return;
		sb.bragging = bool;
		if (!sb.bragging) {
			$("#brag").remove();
			return;
		}
		sb.dialog.closeAll();
		sb.pause(false);
		var $bragDiv = $('<div id=brag>').appendTo(document.body);
		$("<h1>").text("SpaceBullet Brag Time!").appendTo($bragDiv);
		$("<h3>").text("Mission " + sb.mission.id).appendTo($bragDiv);
		$("<p>").text("Take a screenshot now and post it online.").appendTo($bragDiv);
		$("<p>").html("Suggestion: <a target=miaou href=https://miaou.dystroy.org/1260?SpaceBullet>Miaou</a>").appendTo($bragDiv);
		$("<p>").html("Hit <kbd>esc</kbd> when you're done.").appendTo($bragDiv);
		sb.guns.forEach(function(gun){
			gun.path.on();
		});
		sb.planets.forEach(function(planet){
			if (!planet.fixed) planet.visible = false;
		});
	}

})();


