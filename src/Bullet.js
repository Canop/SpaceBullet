var sb = sb || {};
(function(){
	ImgLoader.add('bullet', 'img/bullet.svg');
	
	var showCollisionRadius = false;

	function Bullet(){
		this.initialize();
		this.vx = 0; this.vy = -3;
		this.ax = 0; this.ay = 0;
		this.alive = true;
	}
	var proto = Bullet.prototype = new createjs.Container();
	
	proto.Container_initialize = proto.initialize;
	proto.initialize = function(){
		this.Container_initialize();
		this.size = 80;
		this.radius = this.size/10; // collision detection
		var img = ImgLoader.get('bullet');
		var bmp = new createjs.Bitmap(img);
		bmp.regX = img.width*.3; bmp.regY = img.height/2;
		this.addChild(bmp);

		this.x = sb.xc; this.y = sb.h;
		this.scaleX = this.scaleY = this.size / img.height;

		if (showCollisionRadius) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("red").drawCircle(0, 0, this.radius/this.scaleX);
			circle.y = this.radius;
			this.addChild(circle);
		}
		
		this.addEventListener('tick', this.tick.bind(this));
	}
	
	// calcule l'accéleration en fonction des masses, vérifie aussi la non collision
	proto.updateAcceleration = function() {
		this.ax = 0; this.ay = 0;
		for (var i=sb.planets.length; i-->0;) {
			var p = sb.planets[i];
			var dx = p.x - this.x, dy = p.y - this.y;
			var d2 = dx*dx + dy*dy
			var d = Math.sqrt(d2);
			if (d<p.radius+this.radius) {
				sb.stage.addChild(new sb.Explosion(
					this.x+this.radius*(p.x-this.x)/d, this.y+this.radius*(p.y-this.y)/d
				));
				this.die();
				return;
			}
			this.ax += p.weight*dx/(d*d2); this.ay += p.weight*dy/(d*d2);
		}
		this.ax *= sb.G; this.ay *= sb.G;
	}
	proto.updateSpeed = function() {
		this.vx += this.ax;
		this.vy += this.ay;		
		this.v = Math.sqrt(this.vx*this.vx+this.vy*this.vy);
	}
	proto.updatePos = function() {
		this.x += this.vx;
		this.y += this.vy;
	}
	proto.updateDirection = function() {
		if (this.vx==0) {
			this.rotation = this.vy < 0 ? 0 : -180;
		} else {
			if (this.vy<0) this.rotation = 90 - Math.acos(this.vx/this.v)*180/Math.PI;
			else this.rotation = Math.acos(this.vx/this.v)*180/Math.PI+ 90;
		}
	}
	proto.die = function() {
		console.log('BOUM');
		this.alive = false;
		sb.stage.removeChild(this);
	}
	
	proto.tick = function(e) {
		this.updateAcceleration();
		this.updateSpeed();
		this.updatePos();
		this.updateDirection();
	}

	sb.Bullet = Bullet;	
})();


