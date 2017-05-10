define(
    ["config", "soundLoader", "../utils/utils", "../utils/phaseTrigger"],
    function (config, soundLoader, utils, phaseTrigger) {
		var msgbox = document.getElementById("msg");
		var mvt = config.mvt;
		var m_currentMvt=-1;

		var m_soundsLoaded=false;


		var sndlist=[

			//"jsaSound/jsaModels/dong",
			"jsaSound/jsaModels/CrowdLaughingLoop",	
			//"../slorksounds/MyRisset",			
			"jsaSound/jsaModels/jsaDistributedDrone2",
			"jsaSound/jsaModels/Ame/RandomBirdSample",
			"../slorksounds/slorkMonster",

			"jsaSound/jsaModels/LA_Ah",
			"jsaSound/jsaModels/LA_2Ah",
			"../slorksounds/GrannyBabble",
			//"jsaSound/jsaModels/jsaFMnative2",
			//"jsaSound/jsaModels/SoD/Dragster",
			//"jsaSound/jsaModels/peeperSyllable",
			//"jsaSound/jsaModels/jsaPluck",
			//"jsaSound/jsaModels/peeperSyllable"
		]; // sound files to use for the piece, hardcoded



		//convenient sound model list, order needs to correspond to sndlist order
		var sm = {
			"CrowdLaughingLoop" : 0,
			"DRONE" : 1,
			"BIRDS" : 2,
			"SLORKMONSTER" : 3,
			"LA_AH" : 4,
			"LA_2AH" : 5,
			"GRANNYBABBLE" : 6
		}

		// one place to control the relative gains of all the sounds
		var setSndGain=function(i, eGain){
			switch(i) {
				case sm.CrowdLaughingLoop :
					snds[i].setParamNorm("Gain", .4*eGain);
				break;
				case sm.DRONE :
					snds[i].setParamNorm("Gain", 1.5*eGain);
				break;
				case sm.BIRDS :
					snds[i].setParamNorm("Gain", .8*eGain);
				break;
				case sm.SLORKMONSTER :
					snds[i].setParamNorm("Gain", 1.2*eGain);
				break;
				case sm.LA_AH :
					snds[i].setParamNorm("Gain", .8*eGain);
				break;
				case sm.LA_2AH :
					snds[i].setParamNorm("Gain", .4*eGain);
				break;
				case sm.GRANNYBABBLE :
					snds[i].setParamNorm("Gain", .8*eGain);
				break;

			}

		}


		// convenient movement designation 
		var mvt = {
			"CROWD" : 0,
			"BIRDS" : 1,
			"BABBLE" : 5,
			"LA_AH" : 4,
			"SLORKMONSTER" : 3,
			"DRONE" : 2,
			"ALLOFF" : 6

		}

		var m_playingP=false;

		var m_role;
		var m_roles;


		var IPlayer={};

		m_groupGain=0;
		m_personalGain=.6;

		IPlayer.getAudioContext=function(){
			return snds[0].getAudioContext();
		}

		// trigger whatever process are appropriate for the current movement
		IPlayer.trigger=function(info=null){
			console.log('trigger');
			switch(m_currentMvt){
				case mvt["DRONE"]:
					setSndGain(sm.DRONE, m_groupGain*m_personalGain);
					snds[sm.DRONE].setParamNorm("play", 1);
					setTimeout(function(){
						snds[sm.DRONE].setParamNorm("play", 0);
					}, 1600)
					break;

				case mvt["SLORKMONSTER"] :
					break;
				}

		}

		setPersonalGain=function(val){
			m_personalGain=val;
			for (i=0;i<sndlist.length;i++){
				snds[i] && setSndGain(i, m_groupGain*m_personalGain);
			}
		}
		

		IPlayer.setGain=function(nval){
			m_groupGain=nval;
			for (i=0;i<sndlist.length;i++){
				snds[i] && setSndGain(i, m_groupGain*m_personalGain);
			}
		}

		IPlayer.play=function(idx=0){
			//console.log("player: play");
			//snds[sm.DRONE].setParam("play", 1);
			snds[idx].setParam("play", 1)
			m_playingP=true;
		}

		IPlayer.release=function(idx=0){
			//console.log("player: release");
			//snds[sm.DRONE].setParam("play", 0);
			snds[idx].setParam("play", 0)
			m_playingP=false;
		}

		IPlayer.isPlaying=function(){
			return m_playingP;
		}

		IPlayer.setRole=function(i_role, i_roles){
			m_role=i_role;
			m_roles=i_roles;
			console.log("....my role is now "+ m_role + "of " + i_roles);		

			snds[sm.DRONE].setParam("Number of Generators", 4-Math.min(3, i_roles));
		}

		IPlayer.setSndParam=function(i_pname, i_val){
			sndParams[i_pname]=i_val;

			if (i_pname==="noteNum"){
				snds[sm.DRONE].setParam("First Note Number", i_val);
			}
			if (i_pname==="Detune"){ // [-1,1]
				//msgbox.value="Pitch: " + i_val;
				// map [-.5, .5] to 
				//snds[sm.DRONE].setParam("Detune", i_val);
				setPersonalGain(Math.max(Math.min(utils.map(-.5, .5, 0, 1, i_val),1),0))
			}	
			if (i_pname==="Roll"){ // [-1,1]
				msgbox.value="Roll : " + i_val;
				switch(m_currentMvt){
					case mvt.LA_AH :
							snds[sm.LA_AH].ptrigger.setRPS(snds[sm.LA_AH].baseRPS)
						break;
					
					default:
						break;
					}
			}	

		}

		var sndParams = { // these are piece-specific
			"rissetSpacing": .25,
			"ref_microCycles": 30, 
			"microCycles": 0,
			"noteNum": 0
		}

		//---------------------
		// Bird stuff
		var birdsPlayingP=false;
		var birdInterval=10000;
		var birdTimer;


		IPlayer.setDensity=function(nval){
			birdInterval=1000*Math.pow(2,2+3*nval); //[4secs, 32saecs]
			if (birdsPlayingP) {
				birdTimer && clearTimeout(birdTimer);
				birdTimer=setTimeout(birdTrigger, Math.max(2000, birdInterval*Math.random()));
			}
		}

		IPlayer.playBirds=function(){
			console.log("play bird");
			var foot;
			birdsPlayingP=true;
			birdTimer && clearTimeout(birdTimer);
			foot = Math.max(2000, birdInterval*Math.random());
			birdTimer=setTimeout(birdTrigger, foot);
			console.log('bird set to play in ms from now: ' + foot);
		}

		var birdTrigger = function(){
			if (birdsPlayingP) {
				console.log("trigger bird");
				snds[sm.BIRDS].setParam("play", 1);
				birdTimer && clearTimeout(birdTimer); // don't let timers overlap (can happen with these random intervals)
				birdTimer=setTimeout(birdTrigger, Math.max(2000, birdInterval*Math.random()));
			}		
		}

		IPlayer.stopBirds=function(){
			console.log("stop bird");
			birdsPlayingP=false;
			snds[sm.BIRDS].setParam("play", 0);

		}

		//--------------

		IPlayer.setDensity=function(nval){

		}


		var laplay=function(ph, id){
			
			if (id == 0){
				console.log('playing 1Ah')
				snds[sm.LA_AH].setParam("play", 1);
				setTimeout(function(){
	    			snds[sm.LA_AH].setParam("release", 1);
	    		}, 300);
			} else { // play the double Ah sound
				
				console.log('playing 2Ah')
				snds[sm.LA_2AH].setParam("play", 1);
				setTimeout(function(){
	    			snds[sm.LA_2AH].setParam("release", 1);
	    		}, 300);

			}
		}


		var stopLA=function(){
			if (snds[sm.LA_AH].ptrigger){
				snds[sm.LA_AH].ptrigger.stop();
			}
			if (snds[sm.LA_2AH].ptrigger){
				snds[sm.LA_2AH].ptrigger.stop();
			}
		}

			
		var snds;
		var k_numSnds=0;

		var m_nextSnd; // for cycling through different sounds
		var m_oldMicroPhase=0;

		IPlayer.loadSounds=function(i_cb){
			soundLoader(sndlist, function(i_snds){
				snds=i_snds;
				k_numSnds=sndlist.length;
				console.log("all sounds loaded, snds.length = " + snds.length);
				msgbox.value="all sounds loaded";
				m_soundsLoaded=true;
				//snds[sm.DRONE].setParam("Number of Generators", 1);
				IPlayer.setGain(0);
				i_cb();

			}); // sb will be an array of sounds in the order specified by sndList
		}
		//var myrequestAnimationFrame = utils.getRequestAnimationFrameFunc();
		var m_mvtStartTime=Date.now(); //performance.now();

		var m_mvt=0;
		var m_mvtDur=5000;//just a default

		var m_myMicroPlayPhase=0;
		var m_myMicroStopPhase=.7;

		var stopAllSounds=function(){
			for (var i = 0; i<k_numSnds; i++){
				snds[i] && snds[i].release();
			}
			IPlayer.stopBirds();
			stopLA();
			m_playingP=false;

		}

		IPlayer.allOff=function(){
			IPlayer.setMvtPhase(mvt.ALLOFF);
		}

		var fcount=0;
		var temp;
		IPlayer.setMvtPhase=function(i_mvt,i_mvtDur=999999){
			//msgbox.value="mvt " + i_mvt + ", dur = " + i_mvtDur;
			if (! m_soundsLoaded) {
				fcount++
				msgbox.value="Sounds Not Loaded!! " + fcount;
				return;
			}


			if (m_playingP && (m_mvt===i_mvt)) return;
			console.log("movement Duration will be=" + i_mvtDur);
			m_mvtStartTime=Date.now(); //performance.now();
			m_mvtDur=i_mvtDur;
			m_currentMvt = i_mvt;

			//console.log("----------------------------play mvt " + i_mvt)
			stopAllSounds();
			m_playingP=true;

			document.getElementById('voiceID').style.display='none';

			switch(i_mvt){

				case mvt.CROWD:
					foo = Math.random();
					console.log('set crown loop phase to ' + foo)
					snds[sm.CrowdLaughingLoop].setParam("Loop Start Phase", foo);
					snds[sm.CrowdLaughingLoop].setParam("play", 1);
					setSndGain(sm.CrowdLaughingLoop, m_groupGain*m_personalGain);
					break;
				case mvt.BIRDS:
					IPlayer.playBirds();
					break;


				case mvt.SLORKMONSTER :
					document.getElementById('voiceID').style.display='block';
					snds[sm.SLORKMONSTER].setParamNorm("play", 1);
					setSndGain(sm.SLORKMONSTER, m_groupGain*m_personalGain)
					break;



				case mvt.LA_AH :
					console.log('laurie setup')

					if ((m_role%2)==0){
						setTimeout(function(){
							snds[sm.LA_AH].baseRPS=2;
							snds[sm.LA_AH].ptrigger = phaseTrigger(0,snds[sm.LA_AH].baseRPS,
							[{phase : 2*Math.PI*Math.random(),
								cb: laplay,
								id: 0} // even/odd role will be used to decide which sound to play
							], 40, true);
						}, 6000*Math.random());
					} else {
						setTimeout(function(){
							snds[sm.LA_AH].baseRPS=1;
							basePhase=2.*Math.PI*Math.random();
							snds[sm.LA_2AH].ptrigger = phaseTrigger(0,snds[sm.LA_AH].baseRPS,
							[{phase : basePhase,
								cb: laplay,
								id: 1}, // even/odd role will be used to decide which sound to play
							 {phase : (basePhase+Math.PI)%(2.*Math.PI),
								cb: laplay,
								id: 1},
							 {phase : (basePhase+1.25*Math.PI)%(2.*Math.PI),
								cb: laplay,
								id: 1}

							], 40, true);
						}, 7000+6000*Math.random());
					}

					break;

				case mvt.DRONE:
					document.getElementById('voiceID').style.display='block';
					/*
					switch (m_roles){
						case 1:
							snds[sm.DRONE].setParam("Number of Generators", 3);
						break;

						case 2:
							snds[sm.DRONE].setParam("Number of Generators", 2);
						break;

						default:
							snds[sm.DRONE].setParam("Number of Generators", 1);
						break;
					}
					*/

					break;

				case mvt.BABBLE:
					setTimeout(function(){
						snds[sm.GRANNYBABBLE].setParam("Pitch", -.1 + .2*Math.random());
						snds[sm.GRANNYBABBLE].setParam("Step Size", .2 + .25*Math.random());
						snds[sm.GRANNYBABBLE].setParam("Grain Play Interval", .25 + .5*Math.random()); // audience controllable
						snds[sm.GRANNYBABBLE].setParam("play", 1);
					},3000*Math.random());
					break;

					case mvt.ALLOFF:
						// just so that no sounds are triggered by other events if we are in this state.
						break;


				default: 
					//if (m_playingP===false){
						//snds[i_mvt].setParam("play", 1);
						//snds[i_mvt].setParamNorm("Gain", 1);
						//console.log("PLAY");

					//} 
			}
							

			m_mvt=i_mvt;
		}



		
		return IPlayer;
    });