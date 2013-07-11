var sb = sb || {};
(function(){
	
	var MISSION_SERVER = location.origin+':8012/';
	var NB_MINIMAL_MISSIONS = 5;
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
				"<span class=button id=test_it style='display:none;'>Test your mission</span>" +
				"<span class=button id=share_it style='display:none;'>Share it</span>" +
				"<output id=post_result></output>",
			cssClass: "full_page",
			buttons : {
				"Home" : sb.openGrid
			}
		});
		var $r = $('#file_analysis');
		$('#mission_select').append(Array.apply(0,Array(sb.getFirstNotDone())).map(function(_,i){ return $('<option>').text(i||'Choose a mission') }));
		var check = function(){
			$test_button.hide(); $share_button.hide();
			var data;
			try {
				data = eval('('+$('#mission_text').val()+')');
			} catch (e) {
				$r.addClass('error').html("This doesn't look like a correct JSON string.");
				return;
			}
			if (!(data['Guns']&&data['Guns'].length)) {
				$r.addClass('error').html('A mission needs at least one gun.');
			} else if (!(data['Stations']&&data['Stations'].length)) {
				$r.addClass('error').html('A mission needs at least one destination station.');					
			} else {
				m = new sb.Mission(-1);
				m.edited = true;
				m.data = data;
				$r.removeClass('error').html('Mission seems OK. You may test it.');
				$test_button.show(); $share_button.show();
			}
		}
		$('#load_button').click(function(){
			var m = new sb.Mission($('#mission_select :selected').text());
			m.load(function() {
				m.data['Description'] = "This mission has no description yet";
				m.data['Name'] = "untitled";
				m.data['Author'] = "anonymous";
				$('#mission_text').val(JSON.stringify(m.data, null, '\t'));
				check();
			});
		});
		$('#mission_text').on('keyup', check); // using keyup directly as function is broken when using closure compiler
		var $test_button = $('#test_it').click(function(){
			if (sb.mission) sb.mission.remove();
			if (m) {
				sb.mission = m;
				dialog.hide(m.start.bind(m));
			}
		});
		var $share_button = $('#share_it').click(function(){
			if (m) {
				var httpRequest = new XMLHttpRequest();
				httpRequest.onreadystatechange = function() {
					if (httpRequest.readyState === 4) {
						if (httpRequest.status === 200) {
							var resp = JSON.parse(httpRequest.responseText);
							if (resp['Code']=="ok") {
								var url = location.origin + location.pathname + '?m=' + resp['Text'];
								$('#post_result').removeClass('error').html('Mission saved. Direct URL :<br><a target=_blank href='+url+'>'+url+'</a>');																
							} else {
								$('#post_result').addClass('error').html('There was a problem. ' + resp['Text']);								
							}
						} else {
							$('#post_result').addClass('error').html('There was an error sending your mission to the server.');
						}
					}
				}
				httpRequest.open('POST', MISSION_SERVER);
				//~ httpRequest.setRequestHeader("Content-type", "application/x-javascript");
				httpRequest.send(JSON.stringify({"Code":"save", "Mission":m.data}));
			}
		});
		$('#file_input').on('change', function(e){ // using change directly as function is broken when using closure compiler
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
