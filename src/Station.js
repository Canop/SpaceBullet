var sb = sb || {};
(function(){
	ImgLoader.add('station', 'img/station.svg');
	
	var showCollisionRadius = false;

	function Station(x, y){
		this.initialize();
		this.x = x; this.y = y;
		this.radius = 40;
		this.full = false; // true when a bullet is docked
		var s = this;
		var img = ImgLoader.get('station');
		var bmp = new createjs.Bitmap(img);
		bmp.scaleX = bmp.scaleY = 2 * s.radius / img.width;
		s.regX = s.radius; s.regY = s.radius;
		s.addChild(bmp);
		sb.re.register(s);
	}
	var proto = Station.prototype = new createjs.Container();
	
	proto.tick = function() {
		if (this.full) return;
		var b = sb.bullet;
		var dx = b.x-this.x, dy = b.y-this.y;
		var d = Math.sqrt(dx*dx + dy*dy);
		if (d<37) {
			this.full = true;
			b.reach(this);
		} else {
			if (dx==0) {
				this.rotation = dy < 0 ? -180 : 0;
			} else {
				if (dy<0) this.rotation = 270 - Math.acos(dx/d)*180/Math.PI;
				else this.rotation = Math.acos(dx/d)*180/Math.PI+ 270;
			}
		}
	}

	sb.Station = Station;	
})();


