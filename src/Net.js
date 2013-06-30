var sb = sb || {};
(function(){

	function Net(gun, lines){
		this.x = 0; this.y = 0;
		this.gun = gun;
		this.lines = lines;
		this.initialize();
	}
	var proto = Net.prototype = new createjs.Container();
	
	proto.Container_initialize = proto.initialize;
	proto.initialize = function(){
		this.Container_initialize();
		for (var i=0; i<this.lines.length; i++) {
			var railline = this.lines[i];
			var lastPoint = this.gun;
			for (var j=0; j<railline.length; j++) {
				var node = railline[j];
				node.dest = lastPoint;
				var seg = new createjs.Shape();
				seg.graphics.beginStroke("#ddd").setStrokeStyle(3).moveTo(lastPoint['x'], lastPoint['y']).lineTo(node['x'], node['y']);
				this.addChild(seg);
				var circle = new createjs.Shape();
				circle.graphics.beginFill("#bbb").drawCircle(node['x'], node['y'], 5);
				this.addChild(circle);
				lastPoint = node;
			}
		}
	}
	
	// tests if the passed circle hits the rail network.
	// returns the upstream node in the hit segment if so.
	proto.testHitCircle = function(x, y, r) {
		for (var i=0; i<this.lines.length; i++) {
			var railline = this.lines[i];
			var p1 = this.gun;
			for (var j=0; j<railline.length; j++) {
				var p2 = railline[j];
				if (sb.ptSegDistSq(p1['x'], p1['y'], p2['x'], p2['y'], x, y)<r*r) { // ? does this ['x'] access due to the json prevents optimization ?
					return p1;
				}
				p1 = p2;
			}
		}
	}
	
	// returns true if the passed segment crosses a rail of the network
	proto.testCrossSeg = function(x1, y1, x2, y2) {
		for (var i=0; i<this.lines.length; i++) {
			var railline = this.lines[i];
			var p1 = this.gun;
			for (var j=0; j<railline.length; j++) {
				var p2 = railline[j];
				if (sb.segsIntersect(p1['x'], p1['y'], p2['x'], p2['y'], x1, y1, x2, y2)) { // ? does this ['x'] access due to the json prevents optimization ?
					return true;
				}
				p1 = p2;
			}
		}
		return false;
	}
	
	sb.Net = Net;	
})();


