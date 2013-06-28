var sb = sb || {};
(function(){

	function Gun(x,y){
		this.x = x; this.y = y;
		this.initialize();
	}
	var proto = Gun.prototype = new createjs.Container();
	
	proto.Container_initialize = proto.initialize;
	proto.initialize = function(){
		this.Container_initialize();
		this.radius = 40;
		var barrel = new createjs.Shape();
		barrel.graphics.beginFill("#aaa").drawRect(0, 0, 70, 34);
		barrel.regX = 40; barrel.regY = 20;
		this.addChild(barrel);
	}
	
	sb.Gun = Gun;	
})();


