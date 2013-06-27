var sb = sb || {};
(function(){

	function Mission(id){
		this.id = id;
	}
	var proto = Mission.prototype;
		
	function addPlanet(r, x, y) {
		var planet = new sb.Planet(r);
		planet.x = x; planet.y = y;
		stage.addChild(planet);
		sb.planets.push(planet);
	}
	
	proto.load = function(){
		var m = this;
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					var data = eval('('+httpRequest.responseText+')');
					sb.stage.removeAllChildren();
					sb.net = new sb.Net(data);
					sb.stage.addChild(sb.net);
					sb.planets = [];
					for (var i=data.planets.length; i-->0;) {
						var p = data.planets[i];
						addPlanet(p.r, p.x, p.y);
					}
					sb.bullet = new sb.Bullet();
					stage.addChild(sb.bullet);
					sb.gun = new sb.Gun(-100, 20);
					sb.gun.rotation = -10;
					stage.addChild(sb.gun);
					sb.bullet.launch();
					console.log('Mission '+m.id+' started');
				}
			}
		};
		httpRequest.open('GET', 'missions/mission-'+this.id+'.json?time='+(new Date().getTime()));
		httpRequest.send();	
	}

	sb.Mission = Mission;	
})();


