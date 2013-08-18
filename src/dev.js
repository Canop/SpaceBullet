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
		md.Planets = (sb.planets||[]).map(function(p){ return {X:p.x, Y:p.y, R:p.radius, Fixed:p.fixed} });
		return md;
	}

	sb.ondevclick = function(e){
		console.log({X:(e.pageX-sb.w/2)/sb.scale, Y:(e.pageY-sb.h/2)/sb.scale});
	};

})();


