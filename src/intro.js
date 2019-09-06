var sb = sb || {};
(function(){

	var dialog;

	sb.intro = function() {
		if (sb.mission && sb.mission.id) sb.mission.remove(); // because rails under the intro make the text less readable
		dialog = sb.dialog({
			html :
				"<img src=img/bullet.svg align=left height=400>" +
				"<h1>Welcome to SpaceBullet !</h1>" +
				"<p>You know what's unsafe with rockets ?</p>" +
				"<p>Fuel, that's what's unsafe. Rockets can explode at any time because of the fuel they carry.</p>" +
				"<p>But the <span class=sbname>SpaceBullet</span> space travel company has the solution !</p>" +
				"<p>Instead of carrying fuel, our ships are simply put into a big gun, fired, and then steered using the gravity of nearby planets.</p>" +
				"<p>Your task is to move planets around so that SpaceBullet ships reach their destination.</p>",
			cssClass: "big",
			buttons : {
				//"Go to project page" : function() {
				//	location.href="project.html";
				//},
				"Come chat on Miaou" : function() {
					location.href="https://miaou.dystroy.org/1260?SpaceBullet";
				},
				"Start the game" : function() {
					if (sb.getFirstNotDone()>1) sb.openGrid();
					else sb.startMission(1);
				}
			}
		});
	}
	sb.intro.close = function() {
		if (dialog) dialog.close();
	}

})();


