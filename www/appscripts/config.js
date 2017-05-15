define(
	function () {
		exports = {};
		exports.webkitAudioEnabled=true;

		if (!window.AudioContext && !window.webkitAudioContext) {
			alert("Web Audio API is not supported - you can play, but you your device will not sound.");
			exports.webkitAudioEnabled=false;
		}

		exports.touchMarginOfError = 3; //px, used for "selecting" items on the score
		exports.minSndDuration=60; // must be longer than frame duration so start and stop and not sent to the synthesizer at the same time. 

		exports.maxContourWidth=0; //set this in main 

		exports.resourcesPath = "https://animatedsoundworks.com";
		//exports.resourcesPath = "http://"+window.document.location.hostname + ":8001/";

		return exports;
});

