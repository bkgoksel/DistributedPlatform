define(
    ["../utils/utils", "lollipop"],
    function (utils, lollipop) {
		var static_xmlns = "http://www.w3.org/2000/svg";

        return function (i_svgelmt){  // input arg is the dom element to use as parent

        	// Returned interface
        	var  me = {};


			var svgelmt=i_svgelmt;
        	var m_width, m_height;

        	var bgColor="black";
        	var m_myColor="green" // This will get set differently for each client


        	// SVG elements
			var circ;
			var tick=[];


			var bgrect;

			var myCirc={
				"cx": 0,
				"cy": 0,
				"r": 0
			};


			//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			var playButton=document.createElementNS(static_xmlns,"circle");
			//playButton.cx.baseVal.value=ix;
			//playButton.cy.baseVal.value=iy;
			//playButton.r.baseVal.value=ir;
     		playButton.mycolor = "black";
			playButton.style.fill="gray";
			playButton.setAttributeNS(null, "stroke", playButton.mycolor);
			playButton.setAttributeNS(null, "stroke-width", 1);

	 		var playText=document.createElementNS(static_xmlns,"text");

			
	 		var playText=document.createElementNS(static_xmlns,"text");
			playText.style.fill="black";
			playText.setAttributeNS(null,"font-size",18);
			playText.setAttributeNS(null,"text-anchor","middle");
			playText.setAttributeNS(null,"alignment-baseline","middle");
			playText.setAttributeNS(null,"pointer-events","none");
			playText.txt=document.createTextNode("");//"PLAY");
			playText.appendChild(playText.txt);


			playButton.pushedP=false;
			playButton.resize=function(ix, iy, ir){
    			playButton.cx.baseVal.value=ix;
				playButton.cy.baseVal.value=iy;
				playButton.r.baseVal.value=ir/8;

				playText.setAttributeNS(null,"x",ix );
				playText.setAttributeNS(null,"y",iy );

    		}

    		document.addEventListener("touchstart", function(e){
				console.log('mouse pos ' + e.screenX + ", " + e.screenY)
				m_msg.value='mouse pos ' + e.screenX + ", " + e.screenY
			});
			document.addEventListener("touchmove", function(e){
				console.log('mouse pos ' + e.screenX + ", " + e.screenY)
				m_msg.value='mouse pos ' + e.screenX + ", " + e.screenY
			});
    		document.addEventListener("mousedown", function(e){
				console.log('mouse pos ' + e.screenX + ", " + e.screenY)
				m_msg.value='mouse pos ' + e.screenX + ", " + e.screenY
			});
			document.addEventListener("mousemove", function(e){
				console.log('mouse pos ' + e.screenX + ", " + e.screenY)
				m_msg.value='mouse pos ' + e.screenX + ", " + e.screenY
			});
    		/*
    		playButton.addEventListener("mousedown", function(){
				playButton.style.fill="blue";
				playButton.pushedP=true;
				me.fire("play");
				phaseLine.start();
			});
			playButton.addEventListener("touchstart", function(e){
				playButton.style.fill="blue";
				playButton.pushedP=true;
				me.fire("play");
				phaseLine.start();
				e.preventDefault();
			});

			playButton.addEventListener("mouseup", function(){
				playButton.pushedP=false;
				me.fire("release");
				phaseLine.stop();
				playButton.style.fill="gray";
			});
			playButton.addEventListener("touchend", function(){
				playButton.pushedP=false;
				me.fire("release");
				phaseLine.stop();
				playButton.style.fill="gray";
			});

			// (need this to prevent touchcancel events from firing with held buttons)
			playButton.addEventListener("touchmove", function(e){
				e.preventDefault();
			});
			*/

			


			
			//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

			//var phaseLine=document.createElementNS(static_xmlns,"line");
			var phaseLine={
				lolli: null 
			}

			phaseLine.start=function(){
				phaseLine.lolli = lollipop(svgelmt, 0, {x: myCirc.cx , y: myCirc.cy}, myCirc.r, 0, 0, m_myColor)
			}

			phaseLine.stop=function(){
				if (phaseLine.lolli){
					phaseLine.lolli.remove();
				}
			}


			phaseLine.tick=function(itime){
				if (phaseLine.lolli){
					phaseLine.lolli.tick(itime);
				}
			}

			phaseLine.draw=function(){
				if (phaseLine.lilli){
					phaseLine.lolli.draw();		
				}		  			
			}

			phaseLine.setRate=function(i_a){
				if (phaseLine.lolli){
					phaseLine.lolli.setRate(i_a*.000005);
				}
			}

			phaseLine.setColor=function(c){
				if (phaseLine.lolli){
					phaseLine.setColor(c)
				}
			}


			var maxPitch=45;
			var minPitch=-15;
			var lastPitch=30; // degrees in [-90, 90]
			var lastAngle=0; // degrees in [0,360]

			var m_msg = window.document.getElementById("msg");


    	var makeCircle=function(ix,iy,ir,iParent){

    		//console.log("making new circle of radius " + ir)
			var c = document.createElementNS(static_xmlns,"circle");
			iParent.appendChild(c);

			c.cx.baseVal.value=ix;
			c.cy.baseVal.value=iy;
			c.r.baseVal.value=ir;

     		c.mycolor = "gray";

			c.style.fill="black";
			//c.setAttributeNS(null, "fill", "none");
			c.setAttributeNS(null, "stroke", c.mycolor);
			c.setAttributeNS(null, "stroke-width", 1);

    		return(c);
    	}

    	var k_numNoteCircles=9; // one more than the number of pitches since the innermost circle is a button
    	var m_annulusSize=1;

    	var m_noteCircles=[];
    	m_noteCircles.resize=function(ix, iy, ir){
    		for (i=0;i<k_numNoteCircles;i++){
    			m_annulusSize=(ir-ir/4)/k_numNoteCircles;
    			m_noteCircles[i].cx.baseVal.value=ix;
				m_noteCircles[i].cy.baseVal.value=iy;
				m_noteCircles[i].r.baseVal.value=ir/4 + (i+1)*m_annulusSize;
    		}
    	}

    	m_noteCircles.active=4;
    	m_noteCircles.setPitchCircle=function(ir){
    		var foo;
    		//if (playButton.pushedP) return; // note only changes when not playing
    		m_noteCircles[m_noteCircles.active].style.fill="black";

 			foo = (ir-(circ.r.baseVal.value/4))/(3*circ.r.baseVal.value/4);
 			m_noteCircles.active=Math.min(k_numNoteCircles-1, Math.floor(foo*k_numNoteCircles));
    		m_noteCircles[m_noteCircles.active].style.fill=m_myColor;
    		
    	}




			var toRadians = function(angle) {
				 //m_msg.value="angle " + angle + " is " + angle * (Math.PI / 180) + " rads";
                return angle * (Math.PI / 180);
            }



 			var setTicks = function(i_circle,i_a){
				for (var i=0;i<4;i++){
					tick[i].len=myCirc.r/8;
					tick[i].setAttribute("x1",  myCirc.cx + (myCirc.r-tick[i].len/2)*Math.cos(toRadians(i*90)));
					tick[i].setAttribute("y1",  myCirc.cy + (myCirc.r-tick[i].len/2)*Math.sin(toRadians(i*90)));
					tick[i].setAttribute("x2",  myCirc.cx + (myCirc.r+tick[i].len/2)*Math.cos(toRadians(i*90)));
					tick[i].setAttribute("y2",  myCirc.cy + (myCirc.r+tick[i].len/2)*Math.sin(toRadians(i*90)));
				} 				
 			}

			// Listeners ----------------------------------------------------------

			svgelmt.onresize = function(e){
				//console.log("resize");

				// This address a bug in iOs (only) where svgelmt.width.baseVal.value are not set by CSS styling
				svgelmt.setAttributeNS(null,"width",svgelmt.clientWidth);
				svgelmt.setAttributeNS(null,"height",svgelmt.clientHeight);

				m_width = svgelmt.width.baseVal.value;
				m_height = svgelmt.height.baseVal.value;

				//bgrect --------------------------
				bgrect.setAttributeNS(null, "x", 0);
				bgrect.setAttributeNS(null, "y", 0);
				bgrect.setAttributeNS(null, "width", m_width);
				bgrect.setAttributeNS(null, "height", m_height);

				//circle --------------------------
				myCirc.cx=m_width/2;
				myCirc.cy=m_height/2;
				//console.log("myCirc.cx=" + myCirc.cx + ", and myCirc.cy=" + myCirc.cy);
				circ.r.baseVal.value=.9*Math.min(m_width,m_height)/2;
				myCirc.r=circ.r.baseVal.value;

				m_noteCircles.resize(myCirc.cx, myCirc.cy, myCirc.r);


				circ.cx.baseVal.value=myCirc.cx;
				circ.cy.baseVal.value=myCirc.cy;

				phaseLine.pitch2Radius = utils.makeMap(minPitch, maxPitch, circ.r.baseVal.value/4,  circ.r.baseVal.value);


				playButton.resize(myCirc.cx, myCirc.cy, myCirc.r);

				setTicks(myCirc, 0);


    			phaseLine.radius=phaseLine.pitch2Radius(lastPitch);
    			phaseLine.draw();

			};

			svgelmt.addEventListener("SVGResize", svgelmt.onresize, false);
			
			try 
			 { 
			  //since neither svgelmt.resize nor  svgelmt.addEventListener("SVGResize" ... seem to work
			  window.addEventListener('resize', svgelmt.onresize, false); 
			  //console.log("adding resize event on window....")
			 } 
			 catch(er){
			 	alert("error in adding event listener for display resize")
			 }

			svgelmt.onmousedown = function(e){
				//console.log("svg element mouse down!");
			};


        	// Initialize  -----------------------------------------------
        	(function init(){
        		
        		bgrect=document.createElementNS(static_xmlns,"rect");
        		bgrect.setAttributeNS(null, "fill", bgColor);
				svgelmt.appendChild(bgrect);

				circ=document.createElementNS(static_xmlns,"circle");

	        	for (var i=0;i<4;i++){
					tick[i]=document.createElementNS(static_xmlns,"line");
					tick[i].len=0;
				}


        		// circle ----------
				circ.style.fill="black";
				circ.setAttributeNS(null, "fill", "none");
    			circ.setAttributeNS(null, "stroke", "white");
    			circ.setAttributeNS(null, "stroke-width", 2);

				svgelmt.appendChild(circ);

				m_noteCircles[k_numNoteCircles-1] = makeCircle(myCirc.cx, myCirc.cy, myCirc.r, svgelmt);
				for (var i=k_numNoteCircles-2;i>=0;i--){
																					// (i+1) so biggest circles fills the whole reference circle
					m_noteCircles[i]=makeCircle(myCirc.cx, myCirc.cy, myCirc.r/4 + (i+1)*(myCirc.r-myCirc.r/4)/k_numNoteCircles, svgelmt)
				}
				
				// phaseLine
				//svgelmt.appendChild(phaseLine);

				// play button
				svgelmt.appendChild(playButton);
				svgelmt.appendChild(playText);


				svgelmt.onresize();

				for (var i=0;i<4;i++){
   					tick[i].setAttributeNS(null, "stroke", "white");
    				tick[i].setAttributeNS(null, "stroke-width", 2);
					svgelmt.appendChild(tick[i]);
				}


				setTicks(myCirc, 0);

				// doesn't seem to work, even if we get a match on one of the if statements...
				utils.launchFullscreen(document.documentElement);



        	})();

        	// Interface -----------------------------------------------


        	me.tick=function(i_time){
        		phaseLine.tick(i_time);
        		phaseLine.draw();
			}

			me.setColor=function(col){
				m_myColor=col;
				phaseLine.setColor(col);
			}
			me.getColor=function(){
				return m_myColor;
			}

        	me.setBackground=function(col){
        		bgColor=col;
				bgrect.setAttributeNS(null,"fill",col);
        	}
 
 			me.setPitch = function (i_pitch){
				lastPitch=Math.max(minPitch, Math.min(maxPitch,i_pitch));

    			phaseLine.radius=phaseLine.pitch2Radius(lastPitch); //circ.r.baseVal.value*lastPitch/maxPitch;
    			m_noteCircles.setPitchCircle(phaseLine.radius);
    			phaseLine.draw();

 			}

 			me.setAngle=function(i_ang){
				lastAngle=i_ang;

				//setTicks(myCirc, 0);
				phaseLine.setRate(i_ang);
 			}


 			me.getRingIndex = function(){
 				return m_noteCircles.active;
 			}

 			me.getNormedRadius = function(){
 				return m_noteCircles.active/(k_numNoteCircles-1);
 			}

 			me.getAngle = function(){
 				return phaseLine.angle;
 			}

 			me.getRate = function(){
 				return phaseLine.rate;
 			}


 			utils.eventuality(me);
            return me;
        }
    }
);
