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
		this.Container_initialize();
		var circle = new createjs.Shape();
		circle.graphics.beginFill("#FFE4B5").drawCircle(0, 0, this.radius);
		circle.y = this.radius;
		this.addChild(circle);
		
		this.addEventListener("mousedown", function(evt) {
			var offset = {x:evt.target.x-evt.stageX, y:evt.target.y-evt.stageY};
			evt.addEventListener("mousemove",function(ev) {
				ev.target.x = ev.stageX+offset.x;
				ev.target.y = ev.stageY+offset.y;
			});
		});
	}
	
	sb.Planet = Planet;
})();


