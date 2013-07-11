var sb = sb || {};
(function(){
	ImgLoader.add('gun', 'img/gun.svg');

	function Gun(x,y, showPath){
		this.initialize();
		this.x = x; this.y = y;
		this.showPath = showPath;
		this.radius = 20;
		this.path = new sb.Path(this);		
		var img = ImgLoader.get('gun');
		this.bmp = new createjs.Bitmap(img);
		this.regX = 36; this.regY = 72;
		this.stdscale = this.bmp.scaleX = this.bmp.scaleY = 110 / img.width;
		this.addChild(this.bmp);
	}
	var proto = Gun.prototype = new createjs.Container();
	
	proto.fire = function() {
		sb.re.happen("BulletLeavesNet", this);
		if (this.showPath) this.path.off();
	}

	proto.tick = function(e) {
		if (this.bmp.scaleX > this.stdscale) {
			var ds = Math.min(0.02, this.bmp.scaleX-this.stdscale);
			this.bmp.scaleX -= ds; this.bmp.scaleY -= ds;
		}
	}
	
	proto.bulletEntersNet = function() {
		sb.re.happen("BulletEntersNet", this);
		if (this.showPath) this.path.on();
	}
	
	sb.Gun = Gun;	
})();


