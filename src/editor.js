var sb = sb || {};
(function(){
	
	var NB_MINIMAL_MISSIONS = 10;
	var m; // loaded mission, if any
	var dialog;

	sb.openEditor = function(){
		if (sb.getFirstNotDone()<=NB_MINIMAL_MISSIONS) {
			sb.dialog({
				title : 'Mission "Editor"',
				html :
					"The mission editor is only available after you've done the first "+NB_MINIMAL_MISSIONS+" missions.",
				buttons : {
					"OK" : sb.openGrid
				}
			});
			return;
		}
		if (sb.mission && sb.mission.id) sb.mission.remove();
		if (dialog && dialog.exists()) {
			dialog.show();
			return;
		}
		dialog = sb.dialog({
			title : 'Mission "Editor"',
			html :
				"<p>There's no fancy mission editor for now. You have to edit the mission JSON yourself.</p>" +
				"<p>Load from a file on your disk : <input type=file id=file_input></p>" +
				"<p>Load from a standard mission : <select id=mission_select></select> <button id=load_button>Load</button></p>" +
				"<p>Or directly edit : <textarea id=mission_text></textarea></p>" + 
				"<output id=file_analysis></output>" + 
				"<span class=button id=test_it style='display:none;'>Test your mission</span>",
			cssClass: "full_page",
			buttons : {
				"Home" : sb.openGrid
			}
		});
		var $r = $('#file_analysis');
		$('#mission_select').append(Array.apply(0,Array(NB_MINIMAL_MISSIONS)).map(function(_,i){ return $('<option/>').text(i+1) }));
		var check = function(){
			$test_button.hide();
			var data;
			try {
				data = eval('('+$('#mission_text').val()+')');
			} catch (e) {
				$r.addClass('error').html("This doesn't look like a correct JSON string.");
				return;
			}
			if (!(data.guns&&data.guns.length)) {
				$r.addClass('error').html('A mission needs at least one gun.');
			} else if (!(data.stations&&data.stations.length)) {
				$r.addClass('error').html('A mission needs at least one destination station.');					
			} else {
				m = new sb.Mission(-1);
				m.edited = true;
				m.data = data;
				$r.removeClass('error').html('Mission seems OK. You may test it.');
				$test_button.show();
			}
		}
		$('#load_button').click(function(){
			sb.fetchMissionFile($('#mission_select :selected').text(), function(text) {
				var data = eval('('+text+')');
				data.description = "This mission has no description yet";
				$('#mission_text').val(JSON.stringify(data,null,'\t'));
				check();
			});
		});
		$('#mission_text').keyup(check);
		var $test_button = $('#test_it').click(function(){
			if (sb.mission) sb.mission.remove();
			if (m) {
				sb.mission = m;
				dialog.hide(m.start.bind(m));
			}
		});
		$('#file_input').change(function(e){
			var file = e.target.files[0];
			if (!file) return; // I don't know if that may happen
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#mission_text').val(e.target.result);
				check();
			}
			reader.readAsText(file)
		});
	}
	
})();
