var sb = sb || {};
(function(){

	// id can be
	//   - if shorter than 6 characters : a number > 0, one of the standard missions, in order
	//   - else, a user submited mission
	// This scheme might change in the future, for example if I decide not to keep on github the standard missions

	function Mission(id){
		this.id = ''+id; // mission id is -1 for unsaved missions
		this.edited = false; // true when the mission is open in editor
		this.std = false; // standard missions (in sequence)
		this.played = false; // currently played or not
		if (id==-1) {
			this.path = null;
		} else if (this.id.length<6) {
			this.path = 'missions/mission-'+this.id+'.json?time='+(new Date().getTime());
			this.std = true;
		} else {
			this.path = '/spacebullet-missions/' + id[0] + '/' + id[1] + '/' + id;
		}
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
	
	proto.load = function(callback){
		var m = this;
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4 && httpRequest.status === 200) {
				m.data = eval('('+httpRequest.responseText+')');
				if (callback) callback();
			}
		}
		httpRequest.open('GET', this.path);
		httpRequest.send();
	}

	proto.start = function() {
		var m = this;
		var name = m.data['Name'] || m.id;
		if (m.data['Description']) {
			sb.dialog({
				title: "Mission "+name,
				html: m.data['Description'],
				buttons: {"Start": m.startGame.bind(m)}
			});
		} else {
			m.startGame();
		}
	}

	proto.startGame = function() {
		// note that the order of stage addition is so for the display order
		var m = this;
		sb.paused = false;
		var data = m.data;
		sb.stage.removeAllChildren();
		sb.stage.addChild(sb.net);
		sb.roundThings = [];
		sb.planets = [];
		if (data['Planets']) {
			for (var i=data['Planets'].length; i-->0;) {
				var p = data['Planets'][i];
				addPlanet(p['R'], p['X'], p['Y'], p['Fixed']);
			}
		}
		sb.nets = [];
		sb.guns = [];
		for (var i=0; i<data['Guns'].length; i++) {
			var dg = data['Guns'][i];
			var g = new sb.Gun(dg['X'], dg['Y'], dg['ShowPath']);
			g.rotation = dg['R'];
			g.visible = !dg['Invisible'];
			sb.stage.addChild(g.path);
			if (dg['Lines']) {
				var lines = dg['Lines'].map(function(line){
					return line.map(function(p){ return {x:p['X'],y:p['Y']} });
				});
				var net = new sb.Net(g, lines);
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
		(data['Stations']||[]).forEach(function(s) {
			addStation(s['X'], s['Y']);
		});
		for (var i=0; i<sb.guns.length; i++) stage.addChild(sb.guns[i]);
		sb.gun = sb.guns[0];
		m.played = true;
		sb.bullet.launch();
		trackEvent('Mission started', m.id);
	}
	proto.remove = function() {
		this.played = false;
		sb.stage.removeAllChildren();		
	}
	proto.lose = function(){
		var m = this;
		m.played = false;
		if (m.data['Offgame']) return; // this isn't a gaming mission
		trackEvent('Mission lost', m.id);
		var buttons = {
			"Home": sb.openGrid,
			"Retry": m.startGame.bind(m)
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
		m.played = false;
		if (m.data['Offgame']) return; // this isn't a gaming mission
		trackEvent('Mission won', m.id);
		var buttons = {
			"Home": sb.openGrid,
			"Retry": m.startGame.bind(m)
		}
		if (m.std) {
			sb.saveMissionState(m.id, 'done');
			buttons["Go to next mission"] = function(){ sb.startMission(+m.id+1) };
		}
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


