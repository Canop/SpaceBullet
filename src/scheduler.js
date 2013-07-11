var sb = sb || {};
(function(){

	// Manages
	//  - rules that can be triggered by in game events
	//  - timers (which are paused when the game is paused)

	// For now a rule can have the following fields :
	//  - on : the triggering event
	//  - target : where the event happens
	//  - action : the action
	//  - delay : the optional delay between trigger and action effect
	//  - receiver : the object which will handle the action : it must have a act method

	// Currently supported events as triggers :
	//    - BulletLeavesNet
	//    - BulletEntersNet

	var rules = [];
	var tasks = [];
	var pauseTime; // start of pause
	var paused = false;
	
	sb.re = {}; // rules engine
	
	sb.re.clear = function(){
		rules = [];
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
		var now = +new Date();
		var task = {f:func, due:delay+now};
		tasks.push(task);
		task.cancel = function() {
			if (task.done) {
				console.log('task alredy done, nothing to cancel');
				return;
			}
			var i = tasks.indexOf(task);
			if (~i) tasks.splice(tasks.indexOf(task),1);
			else console.log('forgotten task cancellation required : useless');
			clearTimeout(task.timer);
		}
		task.finish = function(){
			if (task.done) {
				console.log('internal scheduler bug : task already done'); // will be removed once I'm sure the scheduler isn't buggy
				return;
			}
			var i = tasks.indexOf(task);
			if (~i) {
				tasks.splice(tasks.indexOf(task),1);
			} else {
				console.log('forgotten task -> action prevented');
				return;
			}
			func();
			task.done = true;
		}
		task.timer = setTimeout(task.finish, delay);
		return task;
	}
	
	// pauses or resumes all tasks
	sb.re.pause = function(bool) {
		if (bool == paused) return;
		var now = +new Date();
		if (bool) { // pause
			pauseTime = now;
			for (var i=0; i<tasks.length; i++) {
				clearTimeout(tasks[i].timer);
			}
		} else { // resume
			for (var i=0; i<tasks.length; i++) {
				tasks[i].due += now-pauseTime;
				tasks[i].timer = setTimeout(tasks[i].finish, tasks[i].due-now);
			}
		}
		paused = bool;
	} 
	
})();


