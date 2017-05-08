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
			"jsaSound/jsaModels/Leonardo/jsaDistributedDrone2Leonardo",
			"jsaSound/jsaModels/Ame/RandomBirdSample",
			"../slorksounds/slorkMonster",
			"jsaSound/jsaModels/RainLoop",
			"../slorksounds/MyGrannySwing",
			"jsaSound/jsaModels/LA_Ah",
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
			"RAIN" : 4,
			"GRANNYSWING" : 5,
			"LA_AH" : 6
		}

		// convenient movement designation 
		var mvt = {
			"CROWD" : 0,
			"BIRDS" : 1,
			"DRONE" : 2,
			"SLORKMONSTER" : 3,
			"LA_AH" : 4
		}

		var m_playingP=false;

		var m_role;
		var m_roles;


		var IPlayer={};

		m_groupGain=0;
		m_personalGain=1;

		IPlayer.getAudioContext=function(){
			return snds[0].getAudioContext();
		}

		// trigger whatever process are appropriate for the current movement
		IPlayer.trigger=function(info=null){
			console.log('trigger');
			switch(m_currentMvt){
				case mvt["DRONE"]:
					snds[sm.DRONE].setParamNorm("Gain", .5);
					snds[sm.DRONE].setParamNorm("play", 1);
					setTimeout(function(){
						snds[sm.DRONE].setParamNorm("play", 0);
					}, 1200)
					break;

				case mvt["SLORKMONSTER"] :
					break;
				}

		}

		setPersonalGain=function(val){
			m_personalGain=val;
			for (i=0;i<sndlist.length;i++){
				snds[i].setParamNorm("Gain", 2*m_groupGain*m_personalGain);
			}
		}
		

		IPlayer.setGain=function(nval){
			m_groupGain=nval;
			for (i=0;i<sndlist.length;i++){
				snds[i].setParamNorm("Gain", 2*m_groupGain*m_personalGain);
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
				//snds[sm.DRONE].setParam("Detune", i_val);
				setPersonalGain((i_val+1)/2.)
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
		var grannyPlayingP=false;
		var grannyInterval=10000;
		var grannyTimer;


		IPlayer.setDensity=function(nval){
			grannyInterval=1000*Math.pow(2,2+3*nval); //[4secs, 32saecs]
			if (grannysPlayingP) {
				grannyTimer && clearTimeout(grannyTimer);
				grannyTimer=setTimeout(grannyTrigger, Math.max(2000, grannyInterval*Math.random()));
			}
		}

		IPlayer.playgrannys=function(){
			console.log("play granny");
			var foot;
			grannysPlayingP=true;
			grannyTimer && clearTimeout(grannyTimer);
			foot = Math.max(2000, grannyInterval*Math.random());
			grannyTimer=setTimeout(grannyTrigger, foot);
			console.log('granny set to play in ms from now: ' + foot);
		}

		var grannyTrigger = function(){
			if (grannysPlayingP) {
				console.log("trigger granny");
				snds[sm.GRANNYSWING].setParam("play", 1);
				grannyTimer && clearTimeout(grannyTimer); // don't let timers overlap (can happen with these random intervals)
				grannyTimer=setTimeout(grannyTrigger, Math.max(2000, grannyInterval*Math.random()));
			}		
		}

		IPlayer.stopgrannys=function(){
			console.log("stop granny");
			grannysPlayingP=false;
			snds[sm.GRANNYSWING].setParam("play", 0);

		}

		var laplay=function(id){
			console.log('laurie play');
			snds[sm.LA_AH].setParam("play", 1);
			setTimeout(function(){
    			snds[sm.LA_AH].setParam("release", 1);
    		}, 300);
		}


		var stopLA=function(){
			if (snds[sm.LA_AH].ptrigger){
				snds[sm.LA_AH].ptrigger.stop();
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

		IPlayer.allOff=function(){
			for (var i = 0; i<k_numSnds; i++){
				snds[i] && snds[i].release();
			}
			IPlayer.stopBirds();
			IPlayer.stopgrannys();
			stopLA();
			m_playingP=false;
		}


		var fcount=0;
		var temp;
		IPlayer.setMvtPhase=function(i_mvt,i_mvtDur=999999){
			msgbox.value="mvt " + i_mvt + ", dur = " + i_mvtDur;
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
			IPlayer.allOff();
			m_playingP=true;

			switch(i_mvt){

				case mvt.CROWD:
					foo = Math.random();
					console.log('set crown loop phase to ' + foo)
					snds[sm.CrowdLaughingLoop].setParam("Loop Start Phase", foo);
					snds[sm.CrowdLaughingLoop].setParam("play", 1);
					break;
				case mvt.BIRDS:
					IPlayer.playBirds();
					break;

				case mvt.GRANNYSWING :
					IPlayer.playgrannys();
					snds[sm.GRANNYSWING].setParamNorm("Pitch", .2+.5*Math.random());

					break;


				case mvt.SLORKMONSTER :
					snds[sm.SLORKMONSTER].setParamNorm("play", 1);
					break;



				case mvt.LA_AH :
					console.log('laurie setup')

					snds[sm.LA_AH].ptrigger = phaseTrigger(0,2,
						[{phase : 2*Math.PI*Math.random(),
							cb: laplay,
							id: 0}
						], 50, true);

					break;



				case mvt.DRONE:

					//snds[sm.DRONE].setParamNorm("Gain", .5);
					//snds[sm.DRONE].setParamNorm("play", 1);

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


					break;
				case mvt.RISSET:
					msgbox.value="risset" + snds[sm.osc];
					snds[sm.osc].setParam("Attack Time", 5);
					snds[sm.osc].setParam("play", 1);
					snds[sm.osc].setParam("Frequency", 60+m_role*sndParams["rissetSpacing"]);
					snds[sm.osc].setParamNorm("Gain", .1);
					break;
				case mvt.THUNDER:
					msgbox.value="rain" + snds[sm.rainLoop];
					snds[sm.rainLoop].setParam("Attack Time", 5);
					snds[sm.rainLoop].setParam("Loop Start Phase", Math.random());
					snds[sm.rainLoop].setParam("play", 1);
					break;
				case mvt.SWING:
					m_myMicroPlayPhase=Math.random();
					m_nextSnd = sm.swing1;
					snds[sm.swing1].setParamNorm("Gain", .6);
					snds[sm.swing2].setParamNorm("Gain", .2);

					console.log("My microphase playtime is " + m_myMicroPlayPhase);
					break;
				case mvt.GRANNYVOICE:
					msgbox.value="grannyvoice" + snds[sm.grannyvoice];
					snds[sm.grannyvoice].setRole(m_role, m_roles);
					snds[sm.grannyvoice].setParam("play", 1);
					snds[sm.grannyvoice].setParamNorm("Gain", .25);
					break;
				case mvt.PEEPER:
					sndParams.ref_microCycles=30- Math.min(m_roles, 10);
					console.log("ref_microCycles=" + sndParams.ref_microCycles);
					m_myMicroPlayPhase=Math.random();
					m_myMicroStopPhase=(m_myMicroPlayPhase + (.16 -.01*Math.min(m_roles, 10))+ .06*Math.random()) % 1;
					console.log("peeper start phase is " + m_myMicroPlayPhase + ", and stop phase is " + m_myMicroStopPhase);

					temp = Math.random();  // for cf and volume (higher cf needs more volume)
					snds[sm.peeper].setParamNorm("Gain", .10+.1*temp);

					// for ChirpExp
					//snds[sm.peeper].setParam("Carrier Frequency", 4400 + 600*temp);
					//snds[sm.peeper].setParam("Modulator Frequency", 16+8*Math.random());
					snds[sm.peeper].setParam("Center Frequency (octaves)", 3.25 + .2*temp);
					snds[sm.peeper].setParam("Chirp Rate", 16+8*Math.random());


					sndParams.microCycles=sndParams.ref_microCycles+6*(Math.random()-.5);
					console.log("microCycles=" + sndParams.microCycles);
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

		var granny = {
			"ref":.1,  //reference value for parameters
			"interval": 1,  // baseline factor rel ref
			"grainSizeFactor": 2, // relative to ref
			"stepSizeFactor": 1, // relative to ref
		}



		
		return IPlayer;
    });