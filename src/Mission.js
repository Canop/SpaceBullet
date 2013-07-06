var sb = sb || {};
(function(){

	function Mission(id){
		this.id = id; // mission id is -1 for user submitted missions (for now, maybe later they'll be in user submitted sets)
		this.name = ''+id;
		this.edited = false; // true when the mission is open in editor
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
	
	sb.fetchMissionFile = function(id, callback) {
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4 && httpRequest.status === 200) {
				callback(httpRequest.responseText);
			}
		}
		httpRequest.open('GET', 'missions/mission-'+id+'.json?time='+(new Date().getTime()));
		httpRequest.send();
	}
	
	proto.load = function(){
		var m = this;
		sb.fetchMissionFile(m.id, function(text){
			m.data = eval('('+text+')');
			if (m.data['description']) {
				sb.dialog({
					title: "Mission "+m.id,
					html: m.data['description'],
					buttons: {"Start": m.start.bind(m)}
				});
			} else {
				m.start();
			}
		});
	}

	proto.start = function() {
		// note that the order of stage addition is so for the display order
		var m = this;
		sb.paused = false;
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
			sb.roundThings.push(g);
			sb.guns.push(g);
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
		for (var i=0; i<sb.guns.length; i++) stage.addChild(sb.guns[i]);
		sb.gun = sb.guns[0];
		sb.bullet.launch();
		trackEvent('Mission '+m.id, 'start');
	}
	proto.remove = function() {
		sb.stage.removeAllChildren();		
	}
	proto.lose = function(){
		var m = this;
		if (m.data['offgame']) return; // this isn't a gaming mission
		trackEvent('Mission '+m.name, 'lose');
		var buttons = {
			"Home": sb.openGrid,
			"Retry": m.start.bind(m)
		}
		if (m.edited) buttons["Back to editor"] = sb.openEditor;
		sb.dialog({
			title: "Mission "+m.name,
			html:
				"<p class=lose>You lose.</p>" +
				"<p>You lost the bullet. Travelers died. That's very unfortunate.</p>",
			buttons: buttons
		});
	}
	proto.win = function(){
		var m = this;
		if (m.data['offgame']) return; // this isn't a gaming mission
		trackEvent('Mission '+m.name, 'win');
		sb.saveMissionState(m.id, 'done');
		var buttons = {
			"Home": sb.openGrid,
			"Retry": m.start.bind(m)
		}
		if (id>0) buttons["Go to next mission"] = function(){ sb.startMission(m.id+1) };
		if (m.edited) buttons["Back to editor"] = sb.openEditor;
		sb.dialog({
			title: "Mission "+m.name,
			html:
				"<p class=win>You win !</p>" +
				"<p>All travelers reached their destination.</p>",
			buttons: buttons
		});
	}


	sb.Mission = Mission;	
})();


