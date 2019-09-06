var sb = sb || {};
(function(){

	// Manages
	//  - rules that can be triggered by in game events
	//  - timer based tasks (which are paused when the game is paused and are synchronized
	//                       with the ticks to avoid desynchronization when CPU is missing)

	// For now a rule can have the following fields :
	//  - on : the triggering event
	//  - target : where the event happens
	//  - action : the action
	//  - delay : the optional delay between trigger and action effect
	//  - receiver : the object which will handle the action : it must have a act method

	// Currently supported events as triggers :
	//    - BulletLeavesNet
	//    - BulletEntersNet

	var tickables = [];
	var rules = [];
	var tasks = [];
	var pauseTime; // start of pause
	var paused = false;
	var FPS = 30;

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;

	sb.re = {}; // rules engine

	sb.re.clear = function(){
		rules = [];
		tickables = [];
		for (var i=0; i<tasks.length; i++) clearTimeout(tasks[i].timer);
		tasks = [];
		paused = false;
	}

	sb.re.addRule = function(rule) {
		rules.push(rule);
	}

	sb.re.happen = function(event, target) {
		for (var i=0; i<rules.length; i++) {
			var r = rules[i];
			if (r.on==event && r.target==target) r.receiver.act(r.action, r.delay);
		}
	}

	// returns a tasks which can be canceled
	sb.re.schedule = function(func, delay) {
		var now = Date.now();
		var task = {f:func, ticks : delay*FPS/1000};
		tasks.push(task);
		task.cancel = function() {
			if (task.done) return;
			var i = tasks.indexOf(task);
			if (~i) tasks.splice(tasks.indexOf(task),1);
		}
		return task;
	}

	// registers an object which wants to be ticked
	sb.re.register = function(tickable) {
		tickables.push(tickable);
	}
	// removes a temporary object from the tickables
	sb.re.forget = function(tickable) {
		var i = tickables.indexOf(tickable);
		if (i>=0) tickables.splice(i, 1);
	}

	sb.re.tick = function() {
		if (!sb.paused) {
			for (var i=0; i<tasks.length; i++) {
				var task = tasks[i];
				if (task.ticks--==0) {
					tasks.splice(tasks.indexOf(task),1);
					task.f();
					task.done = true;
				}
			}
		}
		for (var i=tickables.length; i-->0;) tickables[i].tick();
		sb.stage.update();
	}

	sb.re.start = function() {
		var interval;
		// I can't use requestAnimationFrame because this would make slight difference in computations of
		//  the bullet position and it's chaotic. I need the followed path to be reproductible.
		function start() {
			if (interval) return;
			interval = setInterval(sb.re.tick, 1000/FPS);
		}
		vis(function(){
			if (vis()) {
				start();
			} else {
				if (sb.mission && sb.mission.playable && !sb.bragging) {
					sb.pause(true);
					clearInterval(interval);
					interval = 0;
				}
			}
		});
		start();
	}

})();
