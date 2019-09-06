var sb = sb || {};
(function(){

	// a net contains all the rails leading to a gun

	function Net(gun, lines){
		this.initialize();
		this.x = 0; this.y = 0;
		this.gun = gun;
		this.lines = lines;
		for (var i=0; i<this.lines.length; i++) { // let's draw the rails first
			var railline = this.lines[i];
			var lastPoint = this.gun;
			for (var j=0; j<railline.length; j++) {
				var node = railline[j];
				node.dest = lastPoint;
				var seg = new createjs.Shape();
				seg.graphics.beginStroke("#ddd").setStrokeStyle(3).moveTo(lastPoint.x, lastPoint.y).lineTo(node.x, node.y);
				this.addChild(seg);
				node.segment = seg; // the node points to the segment leading to it
				lastPoint = node;
			}
		}
		for (var i=0; i<this.lines.length; i++) { // and the (over the rails) the junctions
			var railline = this.lines[i];
			var gun=this.gun, lastNode = gun;
			for (var j=0; j<railline.length; j++) {
				var node = railline[j];
				var circle = new createjs.Shape();
				circle.graphics.beginFill("#bbb").drawCircle(node.x, node.y, 5);
				this.addChild(circle);
				if (node.rules) {
					var door = new sb.Door(lastNode, node);
					sb.doors.push(door);
					node.rules.forEach(function(r){
						sb.re.addRule({
							on:r['On'], action:r['Action'], receiver:door, delay:r['Delay'], target: gun
						});
					});
				}
				lastNode = node;
			}
		}
	}
	var proto = Net.prototype = new createjs.Container();

	// tests if the passed circle hits the rail network.
	// returns the upstream node in the hit segment if so.
	proto.testHitCircle = function(x, y, r) {
		for (var i=0; i<this.lines.length; i++) {
			var railline = this.lines[i];
			var p1 = this.gun;
			for (var j=0; j<railline.length; j++) {
				var p2 = railline[j];
				if (!p1.open && sb.ptSegDistSq(p1.x, p1.y, p2.x, p2.y, x, y)<r*r) {
					return p1;
				}
				p1 = p2;
			}
		}
	}

	// returns true if the passed segment crosses a (not open) rail of the network
	proto.testCrossSeg = function(x1, y1, x2, y2) {
		for (var i=0; i<this.lines.length; i++) {
			var railline = this.lines[i];
			var p1 = this.gun;
			for (var j=0; j<railline.length; j++) {
				var p2 = railline[j];
				if (!p1.open && sb.segsIntersect(p1.x, p1.y, p2.x, p2.y, x1, y1, x2, y2)) {
					return true;
				}
				p1 = p2;
			}
		}
		return false;
	}

	sb.Net = Net;
})();


