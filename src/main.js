var sb = sb || {};
window['sb']=sb; // so that minification doesn't prevent not minified files to find sb
(function(){
	
	// a shim for the missing console.log in IE
	if (!window.console) window.console = {log: function(){}};

	sb.G = 0.29; // cette constante intègre la gravitation et le poids de la fusée
	sb.paused = false;
	sb.NB_MISSIONS = 8; // mission-0 isn't counted

	function tick(event) {
		stage.update(event);
	}
	
	sb.intro = function() {
		if (sb.mission && sb.mission.id) sb.mission.remove();
		sb.dialog({
			html :
				"<img src=img/bullet.svg align=left height=400>" +
				"<h1>Welcome to SpaceBullet !</h1>" + 
				"<p>You know what's unsafe with rockets ?</p>" +
				"<p>Fuel, that's what's unsafe. Rockets can explode at any time because of the fuel they carry.</p>" + 
				"<p>But the <span class=sbname>SpaceBullet</span> space travel company has the solution !</p>" +
				"<p>Instead of carrying fuel, our ships are simply put into a big gun, fired, and then diriged using the gravity of nearby planets.</p>" +
				"<p>Your task is to move planets around so that SpaceBullet ships reach their destination.</p>",
			cssClass: "big",
			buttons : {
				"Go to project page" : function() {
					location.href="project.html";
				},				
				"Start the game" : function() {
					if (sb.getFirstNotDone()>1) sb.openGrid();
					else sb.startMission(1);
				}
			}
		});
	}

	sb.startMission = function(id) {
		if (sb.mission) sb.mission.remove();
		if (id>sb.NB_MISSIONS) {
			console.log(id + " > NB_MISSIONS");
			sb.dialog({
				html :
					"<p>Damn. No more mission :(</p>" +
					"<p>I'm sorry, but I just started developping SpaceBullet, come back later for more.</p>",
				buttons : {
					"Go to start" : function() {
						window.location.reload();
					}
				}
			});			
		} else {
			ImgLoader.done(function(){
				sb.mission = new sb.Mission(id);
				sb.mission.load();
			});
		}
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
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", tick);
		var matches = location.search.match(/\bm=(\d+)/);
		if (matches && sb.checkPreviousMissionsAreDone(matches[1])) {
			sb.startMission(parseInt(matches[1],10));
		} else {
			sb.startMission(0);
			sb.intro();
		}
	}
	
	sb.togglePause = function() {
		sb.paused = !sb.paused;
	}
	
})();


