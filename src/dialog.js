var sb = sb || {};
(function(){
	
	sb.homeIcon = "&#9664;";
	
	// opens a dialog
	// Properties of the d object :
	//  title (optional)
	//  html
	//  buttons ( map name->func )
	//  cssClass (optional)
	sb.dialog = function(d){
		var $d = $('<div class=dialog/>').hide().addClass(d.cssClass||'small');
		$d.append($('<div class=dialog_title/>').text(d.title||''));
		$d.append($('<div class=dialog_content/>').html(d.html));
		var $buttons = $('<div class=dialog_buttons/>').appendTo($d);
		var close = function(callback){
			$d.fadeOut(callback).remove();
		}
		$.each(d.buttons, function(name, func){
			$buttons.append($('<span>').addClass('button').html(name).click(function(){
				close(func);
			}));
		});
		$d.appendTo(document.body).fadeIn();
		return {
			close: close, // removes the dialog
			hide: function(callback){ $d.fadeOut(callback) }, // just hides it so that it can be reopened (be careful not to let them accumulate)
			show: function(callback){ $d.fadeIn(callback) }, // shows a previously hidden dialog
			exists: function() { return !!$d.parent().length } // if false, it won't be possible to show it
		}
	}
	
})();


