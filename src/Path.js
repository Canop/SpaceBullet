var sb = sb || {};
(function(){

	function Path(gun){
		this.initialize();
		var path = this;
		this.gun = gun;
		this.x = 0; this.y = 0;
		this.shape = new createjs.Shape();
		this.addChild(this.shape);
		this.alpha = 0.5;
		this.visible = false;
		
		this.tick = function(e) {
			var g = path.shape.graphics;
			g.clear();
			var gun = path.gun;
			var x = gun.x, y = gun.y;
			var radius = sb.bullet.radius;
			g.beginStroke("red").setStrokeStyle(3).moveTo(x, y);
			var v = 7;
			var vx = Math.cos(gun.rotation*Math.PI/180)*v;
			var vy = Math.sin(gun.rotation*Math.PI/180)*v;
			var finished = false;
			for (var step=0; step<7000 && !finished; step++) {
				var ax = 0, ay = 0;
				for (var i=sb.planets.length; i-->0;) {
					var p = sb.planets[i];
					var dx = p.x - x, dy = p.y - y;
					var d2 = dx*dx + dy*dy
					var d = Math.sqrt(d2);
					if (d<p.radius+radius) {
						finished = true;
						break;
					}
					ax += p.weight*dx/(d*d2); ay += p.weight*dy/(d*d2);
				}
				ax *= sb.G; ay *= sb.G;
				vx += ax; vy += ay;
				v = Math.sqrt(vx*vx+vy*vy);
				x += vx; y += vy;
				if (x*x+y*y > 1000*1000) {
					finished = true;
				} else {
					for (var i=sb.nets.length; i-->0;) {
						var node = sb.nets[i].testHitCircle(x, y, radius);
						if (node) {
							finished = true;
							break;
						}
					}
				}
				g.lineTo(x,y);
			}		
		}
	}
	var proto = Path.prototype = new createjs.Container();
	
	proto.on = function(){
		this.visible = true;
		this.addEventListener('tick', this.tick);
	}
	proto.off = function(){
		this.visible = false;
		this.removeEventListener('tick', this.tick);
	}

	
	sb.Path = Path;	
})();


