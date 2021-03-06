var sb = sb || {};
(function(){

	var $menu, $menu_content;
	var visible = false, open=false, devMode=false;
	var gameWasPausedAtMenuOpening;

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
		if (open) {
			gameWasPausedAtMenuOpening = sb.paused;
			sb.pause(true);
		} else {
			if (!gameWasPausedAtMenuOpening) sb.pause(false);
		}
		$menu_content.toggle();
		sb.brag(false);
	}

	sb.menu.funcs = {};


	// must be called once, after the DOM is ready
	sb.menu.init = function() {
		sb.menu.funcs['B'] = function(){ // brag
			if (!sb.mission.won) return;
			if (sb.bragging) return;
			sb.brag(true);
		}
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
				sb.pause(false);
				sb.brag(false);
				sb.dialog.closeAll();
				sb.mission.startGame();
			}
		}
		sb.menu.funcs['N'] = function() {
			if (sb.mission && sb.mission.std) {
				sb.pause(false);
				sb.brag(false);
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
			if (sb.bragging) {
				sb.pause(false);
				sb.brag(false);
				sb.dialog.closeAll();
				sb.startMission(+sb.mission.id+1);
				return;
			}
			if (sb.mission && sb.mission.playable && sb.mission.played) sb.menu.toggle();
		});
		$menu_content = $('<div id=menu_content/>').hide().appendTo($menu);
		add($menu_content, 'Auto-Pause', 'A', function(){
			sb.pause(false);
			if (sb.bragging) return;
			sb.autoPause(!sb.autoPauseOn);
		});
		add($menu_content, '(Un)pause', 'P', function(){
			sb.autoPause(false);
			if (sb.bragging) return;
			if (sb.mission && sb.mission.playable && sb.mission.played) {
				sb.pause(!sb.paused);
			}
		});
		add($menu_content, 'Restart mission', 'R', function(){
			if (sb.mission && sb.mission.playable) {
				sb.mission.startGame();
				sb.dialog.closeAll();
			}
		});
		add($menu_content, 'Missions', 'M', function(){
			sb.menu.hide();
			sb.brag(false);
			sb.pause(false);
			sb.dialog.closeAll();
			sb.openGrid();
		});
		add($menu_content, 'Home', 'H', function(){
			sb.menu.hide();
			sb.brag(false);
			sb.pause(false);
			sb.dialog.closeAll();
			sb.intro();
		});
		window.addEventListener('keyup', function(e) {
			var tag = e.target.tagName;
			if (tag=="TEXTAREA" || tag=="INPUT") return;
			var key = e.keyCode;
			if (sb.isDev) console.log('Key press : ', key);
			var fun = sb.menu.funcs[key==27 ? 'esc' : String.fromCharCode(key)];
			if (fun) fun();
		});
	}

})();
