var sb = sb || {};
(function(){
	ImgLoader.add('bullet', 'img/bullet.svg');

	var IDLE = 0, FLYING = 1, DOCKED = 2, ONRAIL = 3, DEAD = 4;
	var showCollisionRadius = false;

	function Bullet(){
		this.initialize();
		this.vx = 0; this.vy = 0;
		this.ax = 0; this.ay = 0;
		this.state = IDLE;
		this.size = 80;
		this.radius = this.size/10 - 2; // collision detection
		var img = ImgLoader.get('bullet');
		var bmp = new createjs.Bitmap(img);
		bmp.regX = img.width*.3; bmp.regY = img.height/2;
		bmp.scaleX = bmp.scaleY = this.size / img.height;
		this.addChild(bmp);
		if (showCollisionRadius) {
			var circle = new createjs.Shape();
			circle.graphics.beginFill("red").drawCircle(0, 0, this.radius/this.scaleX);
			circle.y = this.radius;
			this.addChild(circle);
		}
		sb.re.register(this)
	}
	var proto = Bullet.prototype = new createjs.Container();

	// be fired from a gun
	proto.launch = function(gun) {
		gun = gun || sb.gun;
		this.x = gun.x; this.y = gun.y;
		this.v = 7;
		this.vx = Math.cos(gun.rotation*Math.PI/180)*this.v;
		this.vy = Math.sin(gun.rotation*Math.PI/180)*this.v;
		this.state = FLYING;
		this.dest = null;
		gun.fire();
	}

	// calcule l'accéleration en fonction des masses, vérifie aussi la non collision
	proto.updateFlyAcceleration = function() {
		this.ax = 0; this.ay = 0;
		for (var i=sb.planets.length; i-->0;) {
			var p = sb.planets[i];
			var dx = p.x - this.x, dy = p.y - this.y;
			var d2 = dx*dx + dy*dy
			var d = Math.sqrt(d2);
			if (d<p.radius+this.radius) {
				sb.stage.addChild(new sb.Explosion(
					this.x, this.y
				));
				this.die();
				return;
			}
			this.ax += p.weight*dx/(d*d2); this.ay += p.weight*dy/(d*d2);
		}
		this.ax *= sb.G; this.ay *= sb.G;
	}
	proto.updateFlySpeed = function() {
		this.vx += this.ax; this.vy += this.ay;
		this.v = Math.sqrt(this.vx*this.vx+this.vy*this.vy);
	}
	proto.updateFlyPos = function() {
		this.x += this.vx; this.y += this.vy;
		if (this.x*this.x+this.y*this.y > 1000*1000) {
			this.die();
			return;
		}
		for (var i=sb.nets.length; i-->0;) {
			var node = sb.nets[i].testHitCircle(this.x, this.y, this.radius);
			if (node) {
				this.dest = node;
				this.state = ONRAIL;
				while (node.dest) node = node.dest;
				node.bulletEntersNet();
				return;
			}
		}
	}
	proto.updateDirection = function() {
		if (this.vx==0) {
			this.rotation = this.vy < 0 ? 0 : -180;
		} else {
			if (this.vy<0) this.rotation = 90 - Math.acos(this.vx/this.v)*180/Math.PI;
			else this.rotation = Math.acos(this.vx/this.v)*180/Math.PI+ 90;
		}
	}
	proto.moveOnRails = function() {
		var dx = this.dest.x - this.x, dy = this.dest.y - this.y;
		var d = Math.sqrt(dx*dx + dy*dy);
		if (d<10) {
			if (this.dest.dest) {
				this.dest = this.dest.dest;
			} else { // means that this.dest is a gun
				this.launch(this.dest);
				return;
			}
		}
		this.v = 9;
		this.vx = this.v * dx / d; this.vy = this.v * dy / d;
		this.x += this.vx; this.y += this.vy;
	}

	proto.reach = function(station) {
		this.state = DOCKED;
		this.rotation = station.rotation;
		this.x = station.x; this.y = station.y;
		sb.mission.win();
	}

	proto.die = function() {
		this.state = DEAD;
		sb.stage.removeChild(this);
		sb.nbBullets--;
		if (sb.nbBullets==0) sb.mission.lose();
	}

	proto.tick = function() {
		if (sb.paused) return;
		switch (this.state) {
		case FLYING :
			this.updateFlyAcceleration();
			this.updateFlySpeed();
			this.updateFlyPos();
			this.updateDirection();
			break;
		case ONRAIL :
			this.moveOnRails();
			this.updateDirection();
			break;
		default :
		}
	}

	proto.isFlying = function() {
		return this.state == FLYING;
	}

	sb.Bullet = Bullet;
})();


