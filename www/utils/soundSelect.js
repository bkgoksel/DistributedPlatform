/*
This jsaSound Code is distributed under LGPL 3
Copyright (C) 2012 National University of Singapore
Inquiries: director@anclab.org

This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or any later version.
This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNULesser General Public License for more details.
You should have received a copy of the GNU General Public License and GNU Lesser General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>
*/
require.config({
	paths: {
		"jsaSound": (function(){
			if (! window.document.location.hostname){
				alert("This page cannot be run as a file, but must be served from a server (e.g. animatedsoundworks.com, or localhost:8001)." );
			}

//			if ((window.document.location.hostname).includes("animatedsoundworks.com")){
			var sndhost;
			//if ((window.document.location.hostname).includes("sonicthings.org")){
			if (true){
				sndhost="https://animatedsoundworks.com";//+window.document.location.hostname;
			} else {
				sndhost="https://mockserver.com:8001"
			}
			return (sndhost );
		})(),
		"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min"
	}
});
define(
	["require", "jsaSound/jsaSndLib/sliderBox", "jsaSound/jsaSndLib/config", "jsaSound/jsaSndLib/utils", "jquery"],
	function (require, makeSliderBox, jsaSoundConfig, utils) {

		// This funciton just needs to be run once when a program is loaded. 
		// After that, uses can listen for "changes" to the selector element on the DOM, and then call the getModelName we have added to the sector in order to retreive the model name. 

		var soundSelectorInterface={};


		var soundSelectorElem, param1Elem, param2Elem;  

		var currentSndModel;
		var soundServer = jsaSoundConfig.resourcesPath;
		var soundList;

		var m_cb;

		soundSelectorInterface.setCallback=function(selector, user_cb){
			soundSelectorElem = document.getElementById(selector);
			makeSoundListSelector();
			m_cb=user_cb;
			soundSelectorElem.addEventListener("change", soundChoice);
		}

		soundSelectorInterface.getModelName=function(){
			var retval;
			if (soundSelectorElem.selectedIndex <1) {
				retval =  undefined;  // we added a "blank" to the selector list.
			} else {
				retval = soundList[soundSelectorElem.selectedIndex-1].fileName;
			}
			soundSelectorElem.options[soundSelectorElem.selectedIndex].selected="true";
			return retval;
		}




		var doNotUseList=["requiredURL", "mic"];
		// Create the html select box using the hard-coded soundList above
		function makeSoundListSelector() {
			var i;
			var currOptionName;


			//$.getJSON("soundList/TestModelDescriptors", function(data){
				//alert("sound list served from " + soundServer+"soundList/ModelDescriptors")
			$.getJSON(soundServer+"soundList/ModelDescriptors",  function(data){

				//alert("got descriptors");
				var items = data.jsonItems;
				soundList=[];
				//console.log("Yip! sound list is " + soundList);
				soundSelectorElem.options.length=0;
				soundSelectorElem.add(new Option('Choose Sound'));
				for (i = 0; i < items.length; i += 1) {
					if ((! items[i].modelKeys) || (! intersectionP(items[i].modelKeys, doNotUseList))){
						currOptionName = items[i].displayName || "";
						soundSelectorElem.add(new Option(currOptionName));

						soundList.push(data.jsonItems[i]);
					}
					soundSelectorElem.options[0].selected="true";
				}

			});
		}

		function intersectionP(a1, a2){
			for(var i=0;i<a1.length;i++){
				for(var j=0;j<a2.length;j++){
					if (a1[i]===a2[j]) return true;
				}
			}
			return false;
		}

		// When a sound is selected from the drop-down selector
		function soundChoice() {
			var sb;
			if (soundSelectorElem.selectedIndex <1) return;  // we added a "blank" to the selector list.
			soundSelectorInterface.loadSound(soundList[soundSelectorElem.selectedIndex-1].fileName, function(sndFactory){
				m_cb(sndFactory); // pass the soundFactory back to the main program once it is loaded
				initializeParamSelection(sndFactory);
			});
		}

		// Called from soundChoice or from program
		soundSelectorInterface.loadSound=function(shortPath, callback){
			var fullPath = "jsaSound/" + shortPath;
			loadSoundFromPath(fullPath, function(sndFactory){callback(sndFactory);});
		}

		function initializeParamSelection(currentSMFactory){
			var snd=currentSMFactory(); // make a snd just to get its parameters. 

			param1Elem = document.getElementById("param1Selector"); 
			param2Elem = document.getElementById("param2Selector"); 

			// clear old lists
			while( param1Elem.options.length > 0) { param1Elem.options.remove(0); }
			while( param2Elem.options.length > 0) { param2Elem.options.remove(0); }


			for(var i=1;i<snd.getNumParams();i++){ // paramater 0 is always play/release, so start from 1
				if (snd.getParam(i,"type") === "range"){
					param1Elem.add(new Option(snd.getParam(i,"name")));
					param2Elem.add(new Option(snd.getParam(i,"name")));
				}
			}
			param1Elem.add(new Option("not used"));
			param2Elem.add(new Option("not used"));

			param1Elem.options[0].selected="true";
			if (snd.getNumParams() >1) {
				param2Elem.options[1].selected="true";
			} else{
				param2Elem.options[0].selected="true"; // "no used" is the only option on the list
			}

			snd.destroy();
		}


		soundSelectorInterface.getSelectedParamName = function (num){
			if (num===1) return param1Elem.value;
			if (num===2) return param2Elem.value;
		}


		function loadSoundFromPath(path, cb) {
			require(
				// Get the model
				[path], // -1 since we added a blank first element to the selection options
				// And open the sliderBox
				function (currentSMFactory) {
					if (path.indexOf("jsaSound/") === 0){
						path = path.substr("jsaSound/".length);
						console.log("loadSoundFromPath: " + path);
						cb(currentSMFactory);
					}
				}
			);
		}

		return soundSelectorInterface;
}
);
