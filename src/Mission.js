var sb = sb || {};
(function(){

	function Mission(id){
		this.id = id;
	}
	var proto = Mission.prototype;
		
	function addPlanet(r, x, y, fixed) {
		var planet = new sb.Planet(r, !!fixed);
		planet.x = x; planet.y = y;
		stage.addChild(planet);
		sb.planets.push(planet);
		sb.roundThings.push(planet);
	}
	function addStation(x, y) {
		var station = new sb.Station(x,y);
		stage.addChild(station);
		sb.stations.push(station);
		sb.roundThings.push(station);
	}
	
	proto.load = function(){
		var m = this;
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					m.data = eval('('+httpRequest.responseText+')');
					if (m.data['description']) {
						sb.dialog({
							title: "Mission "+m.id,
							html: m.data['description'],
							buttons: {"Start": m.start.bind(m)}
						});
					} else {
						m.start();
					}
				}
			}
		};
		httpRequest.open('GET', 'missions/mission-'+this.id+'.json?time='+(new Date().getTime()));
		httpRequest.send();
	}

	proto.start = function() {
		var m = this;
		var data = m.data;
		sb.stage.removeAllChildren();
		sb.stage.addChild(sb.net);
		sb.roundThings = [];
		sb.planets = [];
		if (data['planets']) {
			for (var i=data['planets'].length; i-->0;) {
				var p = data['planets'][i];
				addPlanet(p['r'], p['x'], p['y'], p['fixed']);
			}
		}
		sb.bullet = new sb.Bullet();
		sb.nbBullets = 1;
		stage.addChild(sb.bullet);
		sb.stations = [];
		if (data['stations']) {
			for (var i=data['stations'].length; i-->0;) {
				var s = data['stations'][i];
				addStation(s['x'], s['y']);
			}
		}
		sb.nets = [];
		sb.guns = [];
		for (var i=0; i<data['guns'].length; i++) {
			var dg = data['guns'][i];
			var g = new sb.Gun(dg['x'], dg['y'], dg['showPath']);
			g.rotation = dg['r'];
			g.visible = !dg['invisible'];
			sb.stage.addChild(g.path);
			if (dg['lines']) {
				var net = new sb.Net(g, dg['lines']);
				sb.nets.push(net);
				stage.addChild(net);
			}
			stage.addChild(g);
			sb.roundThings.push(g);
			sb.guns.push(g);
		}
		sb.gun = sb.guns[0];
		sb.bullet.launch();
		console.log('Mission '+m.id+' started');		
	}
	proto.remove = function() {
		sb.stage.removeAllChildren();		
	}
	proto.lose = function(){
		var m = this;
		if (m.data['offgame']) return; // this isn't a gaming mission
		sb.dialog({
			title: "Mission "+m.id,
			html:
				"<p class=lose>You lose.</p>" +
				"<p>You lost the bullet. Travelers died. That's very unfortunate.</p>",
			buttons: {
				"Retry": m.start.bind(m)
			}
		});
	}
	proto.win = function(){
		var m = this;
		if (m.data['offgame']) return; // this isn't a gaming mission
		sb.dialog({
			title: "Mission "+m.id,
			html:
				"<p class=win>You win !</p>" +
				"<p>All travelers reached their destination.</p>",
			buttons: {
				"Retry": m.start.bind(m),
				"Go to next mission": function(){ sb.startMission(m.id+1) }				
			}
		});
		
	}


	sb.Mission = Mission;	
})();


