var sb = sb || {};
(function(){

	// stores the state of mission in localStorage.
	// Yes I know it's easy for the user to change it.
	// Existing mission states :
	// null, "done"
	// (this will change)
	
	// each time this is changed, the local storage must be cleaned.
	// In the future a more subtle solution might be chosen.
	var ArmageddonKey = "hexapodes huileux";
	
	sb.saveMissionState = function (id, state) {
		localStorage['missions.'+id+'.state'] = state;
	}
	sb.getMissionState = function (id) {
		if (localStorage['storage.key']!=ArmageddonKey) {
			console.log('Armageddon!');
			localStorage.clear();
			localStorage['storage.key']=ArmageddonKey;
		}
		return localStorage['missions.'+id+'.state'];
	}
	sb.checkPreviousMissionsAreDone = function (id) {
		id = +id;
		if (!id) return false;
		if (id<2) return true;
		for (var i=1; i<id; i++) {
			if (sb.getMissionState(i)!='done') return false;
		}
		return true;
	}
	sb.getFirstNotDone = function(id) {
		for (var i=1; ; i++) {
			if (sb.getMissionState(i)!='done') return i;
		}
	}
})();


