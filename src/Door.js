var sb = sb || {};
(function(){

	function Door(nodeA, nodeB){
		this.initialize();
		this.a = nodeA;
		this.b = nodeB;
		this.a.door = this; // the upstream node (the one nearest of the gun) points to the door
		this.shape = new createjs.Shape();
		this.alpha = 0.4;
		this.addChild(this.shape);
	}
	var proto = Door.prototype = new createjs.Container();
	
	proto.setState = function(state) { // "closed", "open", "opening", "closing"
		this.state = state;
		var color = "orange";
		if (state=="closed") color = "red";
		else if (state=="open") color = "green";
		this.shape.graphics.clear().beginStroke(color).setStrokeStyle(12,"round").moveTo(this.a.x, this.a.y).lineTo(this.b.x, this.b.y);
		this.a.open = (state=="open"||state=="closing");
		this.b.segment.visible = !this.a.open;
	}
	
	proto.act = function(action, delay) { // action : "open", "close"
		var door = this;
		if (door.state=="open" && action=="open") return;
		if (door.state=="close" && action=="closed") return;
		if (door.timer) door.timer.cancel();
		var f = function(){ door.setState(action=="close"?"closed":"open") };
		if (delay) {
			door.setState(action=="close"?"closing":"opening");
			door.timer = sb.re.schedule(f, delay);
		} else {
			f();
			door.timer = null;
		}
	}
		
	sb.Door = Door;	
})();


