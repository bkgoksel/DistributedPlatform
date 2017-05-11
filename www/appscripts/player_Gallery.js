define(
    ["config", "soundLoader", "../utils/utils"],
    function (config, soundLoader, utils) {
		var msgbox = document.getElementById("msg");
		var mvt = config.mvt;
		var m_currentMvt=-1;

		var m_soundsLoaded=false;

		var sndlist=[

			//"jsaSound/jsaModels/dong",	
			"../slorksounds/MyRisset",

			"jsaSound/jsaModels/Leonardo/jsaDistributedDrone2Leonardo",
			
			//"jsaSound/jsaModels/jsaFMnative2",
			"../slorksounds/mynoisyfm",

			"jsaSound/jsaModels/SoD/Dragster",

			"jsaSound/jsaModels/peeperSyllable",

			//"jsaSound/jsaModels/jsaPluck",
			"../slorksounds/doesntmatter"


		]; // sound files to use for the piece, hardcoded

		var sm = {
			"risset" : 0,
			"metaDrone" : 1,
			"noisyfm" : 2,
			"dragster" : 3,
			"peer" : 4,				
			"swing2" : 5,
			"grannyvoice" : 6,
			"peeper" : 7
		}

		var m_playingP=false;

		var m_role;
		var m_roles;

		var IPlayer={};


		IPlayer.play=function(idx=0){
			//console.log("player: play");
			//snds[sm.metaDrone].setParam("play", 1);
			snds[idx].setParam("play", 1)
			m_playingP=true;
		}

		IPlayer.release=function(idx=0){
			//console.log("player: release");
			//snds[sm.metaDrone].setParam("play", 0);
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

			snds[sm.metaDrone].setParam("Number of Generators", 4-Math.min(3, i_roles));

			if (m_currentMvt === mvt.GRANNYVOICE){
					snds[sm.grannyvoice].setRole(m_role, m_roles);
				}
		}

		// for slork
		IPlayer.setParam=function(sndNum,pNum, nVal){
			snds[sndNum].setParamNorm(pNum, nVal);
		}

		IPlayer.setSndParam=function(i_pname, i_val){
			sndParams[i_pname]=i_val;

			if (i_pname==="noteNum"){
				snds[sm.metaDrone].setParam("First Note Number", i_val);
			}
			if (i_pname==="Detune"){
				snds[sm.metaDrone].setParam("Detune", i_val);
			}
			
		}

		var sndParams = { // these are piece-specific
			"rissetSpacing": .25,
			"ref_microCycles": 30, 
			"microCycles": 0,
			"noteNum": 0
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
				snds[sm.metaDrone].setParam("Number of Generators", 6);
				snds[sm.metaDrone].setParam("Number of Generators", 6);
				i_cb();

			}); // sb will be an array of sounds in the order specified by sndList
		}
		//var myrequestAnimationFrame = utils.getRequestAnimationFrameFunc();
		var m_mvtStartTime=Date.now(); //performance.now();

		var m_mvt=-1;
		var m_mvtDur=5000;//just a default

		var m_myMicroPlayPhase=0;
		var m_myMicroStopPhase=.7;

		IPlayer.allOff=function(){
			for (var i = 0; i<k_numSnds; i++){
				snds[i] && snds[i].release();
			}
			m_playingP=false;
		}


		var fcount=0;
		var temp;
		IPlayer.setMvtPhase=function(i_mvt,i_mvtDur=99999){
			msgbox.value="mvt " + i_mvt + ", dur = " + i_mvtDur;

							
			m_mvt=i_mvt;
		}

		IPlayer.getMvt=function(){
			return m_mvt;
		}

		
		return IPlayer;
    });