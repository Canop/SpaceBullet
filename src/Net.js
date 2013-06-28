var sb = sb || {};
(function(){

	function Net(data){
		this.x = 0; this.y = 0;
		this.data = data;
		this.lines = data.lines || [];
		this.initialize();
	}
	var proto = Net.prototype = new createjs.Container();
	
	proto.Container_initialize = proto.initialize;
	proto.initialize = function(){
		this.Container_initialize();
		for (var i=0; i<this.lines.length; i++) {
			var railline = this.lines[i];
			var lastPoint = this.data.gun;
			for (var j=0; j<railline.length; j++) {
				var node = railline[j];
				node.dest = lastPoint;
				var seg = new createjs.Shape();
				seg.graphics.beginStroke("#ddd").setStrokeStyle(3).moveTo(lastPoint.x, lastPoint.y).lineTo(node.x, node.y);
				this.addChild(seg);
				var circle = new createjs.Shape();
				circle.graphics.beginFill("#bbb").drawCircle(node.x, node.y, 5);
				this.addChild(circle);
				lastPoint = node;
			}
		}
	}
	
	proto.testHitCircle = function(x, y, r) {
		var eps = 0.0000001;
		for (var i=0; i<this.lines.length; i++) {
			var railline = this.lines[i];
			var p1 = this.data.gun;
			for (var j=0; j<railline.length; j++) {
				var p2 = railline[j];
				if (sb.ptSegDistSq(p1.x, p1.y, p2.x, p2.y, x, y)<r*r) {
					return p1;
				}
				p1 = p2;
			}
		}
		return null;
	}
	
	sb.Net = Net;	
})();


