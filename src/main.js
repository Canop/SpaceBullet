var sb = sb || {};
(function(){

	sb.G = 0.29; // cette constante intègre la gravitation et le poids de la fusée

	function tick(event) {
		stage.update(event);
	}

	function addPlanet(r, x, y) {
		var planet = new sb.Planet(r);
		planet.x = x; planet.y = y;
		stage.addChild(planet);
		sb.planets.push(planet);
	}
	function addPlanets() {
		addPlanet(24, -20, -150);
		addPlanet(15, 100, 30);
		addPlanet(22, 180, 180);
		addPlanet(25, -120, 200);
	}

	sb.start = function(){
		var canvas = document.getElementById('main_canvas');
		sb.w = canvas.width = canvas.clientWidth;
		sb.h = canvas.height = canvas.clientHeight;
		sb.xc = sb.w/2; sb.yc = sb.h/2;
		sb.stage = stage = new createjs.Stage("main_canvas");
		stage.regX = -sb.w/2; 
		stage.regY = -sb.h/2; 
		
		ImgLoader.done(function(){
			createjs.Ticker.setFPS(30);
			createjs.Ticker.addEventListener("tick", tick);
			new sb.Mission(1).load();			
		});
	}
	
})();


