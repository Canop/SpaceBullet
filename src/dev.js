// contains some tools that are useful for mission editing before
//  there is a real mission editor

var sb = sb || {};
(function(){
	
	// extracts the state of the application (that could have been modified in
	//  many ways including direct console manipulations) to build a mission data
	//  object similar to what can be find in the mission-x.json files.
	// This is for now very incomplete.
	sb.toMissionData = function(){
		var md = {};
		md.planets = (sb.planets||[]).map(function(p){ return {x:p.x, y:p.y, r:p.radius, fixed:p.fixed} });
		return md;
	}

})();


