var sb = sb || {};
(function(){

	var NB_BLUE_PLANET_IMAGES = 6;
	for (var i=0; i<NB_BLUE_PLANET_IMAGES; i++) ImgLoader.add('blue-planet-'+i, 'img/blue-planet-'+i+'.png');
	var NB_DEAD_PLANET_IMAGES = 15;
	for (var i=0; i<NB_DEAD_PLANET_IMAGES; i++) ImgLoader.add('dead-planet-'+i, 'img/dead-planet-'+i+'.png');
	
	var bpindex = 0, dpindex = 0;

	function Planet(r, fixed){
		this.radius = r;
		this.density = 1;
		this.fixed = fixed;
		this.weight = this.density * r * r * r;
		this.initialize();
	}
	var proto = Planet.prototype = new createjs.Container();
	
	proto.Container_initialize = proto.initialize;
	proto.initialize = function(){
		var p = this;
		p.Container_initialize();
		
		var img = this.fixed ? ImgLoader.get('blue-planet-'+((bpindex++)%NB_BLUE_PLANET_IMAGES)) : ImgLoader.get('dead-planet-'+((dpindex++)%NB_DEAD_PLANET_IMAGES));
		var bmp = new createjs.Bitmap(img);
		bmp.scaleX = bmp.scaleY = 2 * p.radius / img.height;
		bmp.x = -p.radius;
		bmp.y = -p.radius;
		this.addChild(bmp);
		if (!p.fixed) {
			var sq_max_step = (1.8*p.radius)*(1.8*p.radius);
			p.addEventListener("mousedown", function(evt) {
				var offset = {x:evt.target.x-evt.stageX, y:evt.target.y-evt.stageY};
				evt.addEventListener("mousemove",function(ev) {
					var x = ev.stageX+offset.x;
					var y = ev.stageY+offset.y;
					if ((x-p.x)*(x-p.x)+(y-p.y)*(y-p.y)>sq_max_step) return; // too big step, might be some kind of crossing
					for (var i=sb.roundThings.length; i-->0;) {
						var pi = sb.roundThings[i];
						if (pi==p) continue;
						if ((pi.x-x)*(pi.x-x)+(pi.y-y)*(pi.y-y) <= (pi.radius+p.radius)*(pi.radius+p.radius)) {
							console.log('collision with another round thing');
							return
						}
					}
					for (var i=sb.nets.length; i-->0;) {
						if (sb.nets[i].testHitCircle(x, y, p.radius)) {
							console.log('collision with a rail');
							return;
						}
						/*
						if (sb.nets[i].testCrossSeg(p.x, p.y, x, y)) {
							console.log('rail crossing');
							return;
						}*/
					}
					p.x = x; p.y = y;
				});
			});
		}
	}
	
	sb.Planet = Planet;
})();


