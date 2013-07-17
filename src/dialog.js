var sb = sb || {};
(function(){
	
	sb.homeIcon = "&#9664;";
	
	var dialogs = [];
	
	// opens a dialog
	// Properties of the options object :
	//  title (optional)
	//  html
	//  buttons ( map name->func )
	//  cssClass (optional)
	sb.dialog = function(options){
		var $d = $('<div class=dialog/>').hide().addClass(options.cssClass||'small');
		$d.append($('<div class=dialog_title/>').text(options.title||''));
		$d.append($('<div class=dialog_content/>').html(options.html));
		var $buttons = $('<div class=dialog_buttons/>').appendTo($d);
		var close = function(func){
			$d.fadeOut(func).remove();
		}
		$.each(options.buttons, function(name, funcOrMenuKey){
			if (typeof funcOrMenuKey === "string") {
				name += ' <kbd>'+funcOrMenuKey+'</kbd>';
				funcOrMenuKey = sb.menu.funcs[funcOrMenuKey];
			}
			$buttons.append($('<span>').addClass('button').html(name).click(function(){
				close(funcOrMenuKey);
			}));
		});
		$d.appendTo(document.body).fadeIn();
		var d = {
			close: close, // removes the dialog
			hide: function(callback){ $d.fadeOut(callback) }, // just hides it so that it can be reopened (be careful not to let them accumulate)
			show: function(callback){ $d.fadeIn(callback) }, // shows a previously hidden dialog
			exists: function() { return !!$d.parent().length } // if false, it won't be possible to show it
		}
		dialogs.push(d);
		return d;
	}
	
	sb.dialog.closeAll = function(){
		while (dialogs.length) dialogs.pop().close();
	}
	
})();


