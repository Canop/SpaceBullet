var sb = sb || {};
(function(){

	sb.G = 0.29; // cette constante intègre la gravitation et le poids de la fusée
	var NB_MISSIONS = 3; // mission-0 isn't counted

	function tick(event) {
		stage.update(event);
	}
	
	function intro() {
		sb.dialog({
			html :
				"<img src=img/bullet.svg align=left height=400>" +
				"<h1>Welcome to SpaceBullet !</h1>" + 
				"<p>You know what's unsafe with rockets ?</p>" +
				"<p>Fuel, that's what's unsafe. Rockets can explode at any time because of the fuel they carry.</p>" + 
				"<p>But the <span class=sbname>SpaceBullet</span> space travel company has the solution !</p>" +
				"<p>Instead of carrying fuel, our ships are simply put into a big gun, fired, and then diriged using the gravity of nearby planets.</p>" +
				"<p>Your task is to move planets around so that SpaceBullet ships reach their destination.</p>",
			class: "big",
			buttons : {
				"Start" : function() {
					sb.startMission(1);
				}
			}
		});
	}

	sb.startMission = function(id) {
		if (sb.mission) sb.mission.remove();
		if (id>NB_MISSIONS) {
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
		sb.w = canvas.width = canvas.clientWidth;
		sb.h = canvas.height = canvas.clientHeight;
		sb.xc = sb.w/2; sb.yc = sb.h/2;
		sb.stage = stage = new createjs.Stage("main_canvas");
		stage.regX = -sb.w/2; stage.regY = -sb.h/2; 
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", tick);
		sb.startMission(0);
		intro();
	}
	
})();


