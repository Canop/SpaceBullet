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
			p.addEventListener("mousedown", function(evt) {
				var offset = {x:evt.target.x-evt.stageX, y:evt.target.y-evt.stageY};
				evt.addEventListener("mousemove",function(ev) {
					var x = ev.stageX+offset.x;
					var y = ev.stageY+offset.y;
					var collision = false;
					for (var i=sb.roundThings.length; i-->0;) {
						var pi = sb.roundThings[i];
						if (pi==p) continue;
						if ((pi.x-x)*(pi.x-x)+(pi.y-y)*(pi.y-y) <= (pi.radius+p.radius)*(pi.radius+p.radius)) {
							collision = true;
							break;
						}
					}
					if (collision) {
						console.log('collision with another round thing');
					} else if (sb.net.testHitCircle(x, y, p.radius+2)) {
						console.log('collision with rails');
					} else {
						p.x = x; p.y = y;
					}
				});
			});
		}
	}
	
	sb.Planet = Planet;
})();


