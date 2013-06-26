var sb = sb || {};
(function(){

	sb.G = 0.29; // cette constante intègre la gravitation et le poids de la fusée

	var stage;
	var bullet;
	sb.planets = [];

	function tick(event) {
		stage.update(event);
	}

	function addPlanets() {
		var planet = new sb.Planet(17);
		planet.x = sb.xc-130; planet.y = sb.yc-20;
		stage.addChild(planet);
		sb.planets.push(planet);
		
		planet = new sb.Planet(8);
		planet.x = sb.xc+220; planet.y = 240;
		stage.addChild(planet);
		sb.planets.push(planet);

		planet = new sb.Planet(7);
		planet.x = sb.xc-200; planet.y = 50;
		stage.addChild(planet);
		sb.planets.push(planet);		

		planet = new sb.Planet(20);
		planet.x = sb.xc; planet.y = 170;
		stage.addChild(planet);
		sb.planets.push(planet);		

	}

	sb.start = function(){
		var canvas = document.getElementById('main_canvas');
		sb.w = canvas.width = canvas.clientWidth;
		sb.h = canvas.height = canvas.clientHeight;
		sb.xc = sb.w/2; sb.yc = sb.h/2;
		sb.stage = stage = new createjs.Stage("main_canvas");
		
		ImgLoader.done(function(){
			sb.bullet = bullet = new sb.Bullet();
			stage.addChild(bullet);
			
			addPlanets();
			
			createjs.Ticker.setFPS(30);
			createjs.Ticker.addEventListener("tick", tick);
				
			console.log('started');
		});
	}
	
})();


