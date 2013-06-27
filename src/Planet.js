var sb = sb || {};
(function(){

	function Planet(r){
		this.radius = r;
		this.density = 1;
		this.weight = this.density * r * r * r;
		this.initialize();
	}
	var proto = Planet.prototype = new createjs.Container();
	
	proto.Container_initialize = proto.initialize;
	proto.initialize = function(){
		var p = this;
		p.Container_initialize();
		var circle = new createjs.Shape();
		circle.graphics.beginFill("#FFE4B5").drawCircle(0, 0, p.radius);
		circle.y = p.radius;
		p.addChild(circle);
		this.regY = p.radius;
		
		p.addEventListener("mousedown", function(evt) {
			var offset = {x:evt.target.x-evt.stageX, y:evt.target.y-evt.stageY};
			evt.addEventListener("mousemove",function(ev) {
				var x = ev.stageX+offset.x;
				var y = ev.stageY+offset.y;
				if (sb.net.testHitCircle(x, y, p.radius+2)) {
					console.log('collision with rails');
				} else {
					p.x = x; p.y = y;
				}
			});
		});
	}
	
	sb.Planet = Planet;
})();


