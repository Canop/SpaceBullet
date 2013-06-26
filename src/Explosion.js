var sb = sb || {};
(function(){

	function Explosion(x, y){
		this.initialize();
		this.x = x; this.y = y;
		this.scale = 1;
	}
	var proto = Explosion.prototype = new createjs.Container();
	
	proto.Container_initialize = proto.initialize;
	proto.initialize = function(){
		this.Container_initialize();
		var star = new createjs.Shape();
		star.graphics.beginFill("#ff0000").beginStroke("#FF0").setStrokeStyle(5).drawPolyStar(0,0,20,5,0.6).closePath();
		this.addChild(star);
		this.addEventListener('tick', this.tick.bind(this));
	}
	
	proto.tick = function(e) {
		this.scale += 0.03;
		this.scaleX = this.scaleY = this.scale;
		this.alpha -= 0.05;
		this.rotation ++;
		if (this.alpha <=0.05) {
			sb.stage.removeChild(this);
		}
	}

	sb.Explosion = Explosion;	
})();


