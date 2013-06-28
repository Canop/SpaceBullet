var sb = sb || {};
(function(){
	ImgLoader.add('gun', 'img/gun.svg');

	function Gun(x,y){
		this.x = x; this.y = y;
		this.initialize();
	}
	var proto = Gun.prototype = new createjs.Container();
	
	proto.Container_initialize = proto.initialize;
	proto.initialize = function(){
		this.Container_initialize();
		this.radius = 40;
		
		var img = ImgLoader.get('gun');
		this.bmp = new createjs.Bitmap(img);
		this.regX = 36; this.regY = 72;
		this.stdscale = this.bmp.scaleX = this.bmp.scaleY = 110 / img.width;
		this.addChild(this.bmp);
		
		//~ this.addEventListener('tick', this.tick.bind(this));
	}
	proto.fire = function() {
		//~ this.bmp.scaleX *= 1.5; this.bmp.scaleY *= 1.5;
	}

	proto.tick = function(e) {
		if (this.bmp.scaleX > this.stdscale) {
			var ds = Math.min(0.02, this.bmp.scaleX-this.stdscale);
			this.bmp.scaleX -= ds; this.bmp.scaleY -= ds;
		}
	}
	
	sb.Gun = Gun;	
})();


