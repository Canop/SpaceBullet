var sb = sb || {};
(function(){

	var $menu, $menu_content;
	var visible = false, open=false, devMode=false;

	sb.menu = {};
	sb.menu.hide = function(){
		$menu.hide();
		visible = false;
	}
	sb.menu.show = function(){ // shows the opener, not the open menu
		visible = true;
		$menu.show();
	}	
	sb.menu.toggle = function() {
		open = !open;
		sb.pause(open);
		$menu_content.toggle();		
	}
	sb.menu.close = function() {
		open = false;
		$menu_content.hide();
	}

	sb.menu.funcs = {};
	
	$(document.body).click(function(e){
		console.log({X:e.pageX+sb.stage.regX, Y:e.pageY+sb.stage.regY});
	});
	
	// must be called once, after the DOM is ready
	sb.menu.init = function() {
		sb.menu.funcs['D'] = function(){
			devMode = !devMode;
			if (devMode) {
				if (sb.isDev) {
					sb.guns.forEach(function(gun){
						gun.path.on();
					});
				}
				$(document.body).on('click', sb.ondevclick);
			} else {
				sb.guns.forEach(function(gun){
					gun.path.off();
				});
				$(document.body).off('click', sb.ondevclick);
			}
		}
		sb.menu.funcs['J'] = function(){
			console.log(JSON.stringify(sb.toMissionData()));
		}
		sb.menu.funcs['S'] = function() {
			if (sb.mission && sb.mission.playable && !sb.mission.played) {
				sb.dialog.closeAll();
				sb.mission.startGame();
			}
		}
		sb.menu.funcs['N'] = function() {
			if (sb.mission && sb.mission.std) {
				sb.dialog.closeAll();
				sb.startMission(+sb.mission.id+1);
			}
		}
		var add = function($to, name,key,func){
			sb.menu.funcs[key] = func;
			$('<span class=menu_item>'+name+' <kbd>'+key+'</kbd>').click(func).appendTo($to);
		}
		$menu = $('<div id=menu/>').hide().appendTo(document.body);
		add($menu, 'Menu', 'esc', function(){
			if (sb.mission && sb.mission.playable && sb.mission.played) sb.menu.toggle();
		});
		$menu_content = $('<div id=menu_content/>').hide().appendTo($menu);
		add($menu_content, '(Un)pause', 'P', function(){
			if (sb.mission && sb.mission.playable && sb.mission.played) sb.pause(!sb.paused);
		});
		add($menu_content, 'Restart mission', 'R', function(){
			sb.dialog.closeAll();
			if (sb.mission) sb.mission.startGame();
		});
		add($menu_content, 'Missions', 'M', function(){
			sb.menu.hide();
			sb.pause(false);
			sb.dialog.closeAll();
			sb.openGrid();
		});
		add($menu_content, 'Home', 'H', function(){
			sb.menu.hide();
			sb.pause(false);
			sb.dialog.closeAll();
			sb.intro();
		});
		window.addEventListener('keyup', function(e) {
			var key = e.keyCode;
			if (sb.isDev) console.log('Key press : ', key);
			var fun = sb.menu.funcs[key==27 ? 'esc' : String.fromCharCode(key)];
			if (fun) fun();
		});
	}

})();
