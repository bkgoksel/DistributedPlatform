define(
    [],
    /*
    	This factory makes objects that keep a sorted list  of objects of the form 
    		{phase, callback, id}
    	and exposes a tick(t) method which calls the callback function if stored phase 
    	is between the time time of the last tick and the current tick. 
    */ 
    function(){
    	return function (initPhase, rps=1, events=[], tickPeriodMS=50, auto=false) { // Factor function 
	        var pt = {};
	        pt.lastTickPhase=initPhase;
	    	pt.triggerList=[];

	    	timerID=null;
	    	pt.currentPhase=pt.lastTickPhase;
	    	rpsMS=rps/1000.;


	    	pt.stop=function(){
	    		clearInterval(timerID)
	    	}

	    	pt.setRPS(i_rps){
				rpsMS=i_rps/1000.;
	    	}

	        pt.tick=function(phase){
	        	if ((phase > pt.lastTickPhase) || ((pt.lastTickPhase-phase) > 0)) { // then were stricly going forward}
		        	for (i=0;i<pt.triggerList.length;i++){
		        		if ((pt.lastTickPhase <= pt.triggerList[i].phase) && pt.triggerList[i].phase < phase ) {
		        			console.log('triggering at phase ' + phase);
		        			pt.triggerList[i].cb(pt.triggerList[i].phase, pt.triggerList[i].id)
		        		}
		        		if (pt.lastTickPhase > phase) { // phase wrapped
		        			if ((pt.lastTickPhase <= pt.triggerList[i].phase) || pt.triggerList[i].phase < phase ) {
		        				console.log('triggering at phase ' + phase);
		        				pt.triggerList[i].cb(pt.triggerList[i].phase, pt.triggerList[i].id)
		        			}
		        		}
		        	}
		        } else { // were going backwards
	        		// todo
	        	}
	        	pt.lastTickPhase=phase;
	        }

	        pt.addEvent=function(phase, cb, id=null){
	        	var i=0;
	        	while (i<pt.triggerList.length) {
	        		if (phase > pt.triggerList[i].phase){
	        			i+=1;
	    			} else {
	    				break;
	    			}
	    		}
	    		pt.triggerList.splice(i, 0, {"phase": phase, "cb" : cb, "id" : id});
	    		return;
	    	}

	    	pt.resetlastphase=function(phase){
	    		pt.lastTickPhase=phase;
	    	}

	    	// ----------------------------

	    	console.log('phasetrigger here ');
	    	
	    	for (var i=0;i<events.length;i++){
	    		pt.addEvent(events[i].phase, events[i].cb, events[i].id);
	    		console.log("added event with id = " + events[i].id)
	    	}

	    	if (auto){
	    		timerID=setInterval(function(){ 
	    			pt.currentPhase= (pt.currentPhase + rpsMS*2*Math.PI*(tickPeriodMS))%(2*Math.PI);
	    			pt.tick(pt.currentPhase);
	    			 }, tickPeriodMS);
	    	}
	
			
	        return pt;
	    }
    }
);