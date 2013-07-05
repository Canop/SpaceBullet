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
		var boum = this;
		this.Container_initialize();
		var star = new createjs.Shape();
		star.graphics.beginFill("#ff0000").beginStroke("#FF0").setStrokeStyle(5).drawPolyStar(0,0,20,5,0.6).closePath();
		boum.addChild(star);
		boum.addEventListener('tick', function(e) {
			boum.scale += 0.03;
			boum.scaleX = boum.scaleY = boum.scale;
			boum.alpha -= 0.05;
			boum.rotation ++;
			if (boum.alpha <=0.05) {
				sb.stage.removeChild(boum); // to check : does that remove the event listener ?
			}
		});
	}

	sb.Explosion = Explosion;	
})();


