var sb = sb || {};
(function(){
	
	sb.homeIcon = "&#9664;";
	
	var $d;
	
	// opens a dialog
	// Properties of the d object :
	//  title (optional)
	//  html
	//  buttons ( map name->func )
	//  cssClass (optional)
	sb.dialog = function(d){
		if ($d) $d.remove();
		$d = $('<div id=dialog/>').hide();
		if (d.cssClass) $d.addClass(d.cssClass);
		$d.append($('<div id=dialog_title/>').text(d.title||''));
		$d.append($('<div id=dialog_content/>').html(d.html));
		var $buttons = $('<div id=dialog_buttons/>').appendTo($d);
		$.each(d.buttons, function(name, func){
			//~ if (name=="HOME") name="<img src=img/home.png height=18 valign=middle>"; // I'll probably make that cleaner
			$buttons.append($('<span>').html(name).click(function(){
				$d.fadeOut(func);
			}));
		});
		$d.appendTo(document.body).fadeIn();
	}
	
})();


