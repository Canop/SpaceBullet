var sb = sb || {};
(function(){

	var NB_BLUE_PLANET_IMAGES = 6;
	for (var i=0; i<NB_BLUE_PLANET_IMAGES; i++) ImgLoader.add('blue-planet-'+i, 'img/blue-planet-'+i+'.png');
	var NB_DEAD_PLANET_IMAGES = 15;
	for (var i=0; i<NB_DEAD_PLANET_IMAGES; i++) ImgLoader.add('dead-planet-'+i, 'img/dead-planet-'+i+'.png');

	var bpindex = 0, dpindex = 0;

	function Planet(r, fixed){
		this.initialize();
		this.radius = r;
		this.density = 1;
		this.fixed = fixed;
		this.weight = this.density * r * r * r;
		var p = this;

		var img = this.fixed ? ImgLoader.get('blue-planet-'+((bpindex++)%NB_BLUE_PLANET_IMAGES)) : ImgLoader.get('dead-planet-'+((dpindex++)%NB_DEAD_PLANET_IMAGES));
		var bmp = new createjs.Bitmap(img);
		bmp.scaleX = bmp.scaleY = 2 * p.radius / img.height;
		bmp.x = -p.radius;
		bmp.y = -p.radius;
		this.addChild(bmp);

		this.collisionCircle = new createjs.Shape();
		this.collisionCircle.graphics.beginFill("red").drawCircle(0, 0, this.radius);
		this.collisionCircle.alpha = 0.4;
		this.collisionCircle.visible = false;
		this.addChild(this.collisionCircle);

		if (p.fixed) return;
		var max_step = (1.2*p.radius);

		p.addEventListener("mousedown", function(evt) {
			if (sb.bullet.isFlying() /*&& !sb.isDev*/) {
				var $warning = $("<div class=warning>").append(
					$("<p>").text(
						"For safety reasons you can't move planets while the Bullet is flying."
					),
					$("<p>").text(
						"Hit the P key to pause the bullet when it's on a rail."
					)
				).appendTo(document.body);
				setTimeout(function(){
					$warning.remove();
				}, 3000);
				return;
			}
			var offset = {x:evt.target.x-evt.stageX/sb.scale, y:evt.target.y-evt.stageY/sb.scale};
			var mousemove = function(ev) {
				if (sb.bullet.isFlying()) {
					return;
				}
				var fx = ev.stageX/sb.scale+offset.x;
				var fy = ev.stageY/sb.scale+offset.y;
				var dx = fx - p.x;
				var dy = fy - p.y;
				var norm = Math.sqrt(dx*dx+dy*dy);
				var n = Math.ceil(norm/max_step);
				dx /= n; dy /= n;
				var x=p.x, y=p.y;
				for (; n-->0;) {
					x += dx; y += dy;
					for (var i=sb.roundThings.length; i-->0;) {
						var pi = sb.roundThings[i];
						if (pi==p) continue;
						if ((pi.x-x)*(pi.x-x)+(pi.y-y)*(pi.y-y) <= (pi.radius+p.radius)*(pi.radius+p.radius)) {
							p.collisionCircle.visible = true;
							return
						}
					}
					for (var i=sb.nets.length; i-->0;) {
						if (sb.nets[i].testHitCircle(x, y, p.radius)) {
							p.collisionCircle.visible = true;
							return;
						}
					}
				}
				p.collisionCircle.visible = false;
				p.x = x; p.y = y;
			};
			evt.addEventListener("mousemove", mousemove);
			evt.addEventListener("mouseup", function(evt) {
				p.collisionCircle.visible = false;
				evt.removeEventListener("mousemove", mousemove);
			});
		});
	}
	var proto = Planet.prototype = new createjs.Container();

	sb.Planet = Planet;
})();


