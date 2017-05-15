define(
    ["config", "../utils/utils"],
    function (config, utils) {
    	return function(iParent, id, ipt, ilen, iang, irate, icolor){
    		var static_xmlns = "http://www.w3.org/2000/svg";

			var phaseLine = document.createElementNS(static_xmlns,"line");
			phaseLine.setAttributeNS(null, "id", ""+id);
			iParent.appendChild(phaseLine);

			//-----
			var phaseBall = document.createElementNS(static_xmlns,"circle");
			iParent.appendChild(phaseBall);
			phaseBall.color = "white";
    		phaseBall.r.baseVal.value=.05*ilen;
    		phaseBall.style.fill=icolor;//utils.hslToRgb(Math.random(), 1, .5);// "DarkGreen";
    		phaseBall.setAttributeNS(null, "stroke", icolor);
			phaseBall.setAttributeNS(null, "stroke-width", 1);



			phaseLine.maxRate = .001;
			phaseLine.minRate = 0;
			//phaseLine.accel = 0;

    		phaseLine.rate = irate;//(-1+2*Math.random())/(1000*10),
    		phaseLine.color = "white";
    		phaseLine.lastTick = performance.now();
    		phaseLine.len=ilen;
    		phaseLine.angle=iang;//0;
    		phaseLine.pinPoint=ipt;

    		phaseLine.setAttributeNS(null, "stroke", phaseLine.color);
			phaseLine.setAttributeNS(null, "stroke-width", 1);

			phaseLine.startTime=performance.now();


    		phaseLine.tick =  function(itime){
    				this.angle = (this.angle+(itime-this.lastTick)*this.rate*2*Math.PI)%(2*Math.PI);
    				this.lastTick=itime;
    				return this.angle;
    				
    		}

    		phaseLine.draw=function(){
				var len=(.25+.75*phaseLine.len);
				var ex = this.pinPoint.x + len*Math.cos(-Math.PI/2 + this.angle);
				var ey = this.pinPoint.y + len*Math.sin(-Math.PI/2 + this.angle)

				this.setAttribute("x1",  this.pinPoint.x);
				this.setAttribute("y1",  this.pinPoint.y);
				this.setAttribute("x2",  ex);
				this.setAttribute("y2",  ey); 		

				phaseBall.cx.baseVal.value=ex;
				phaseBall.cy.baseVal.value=ey; 

    		}

            phaseLine.setColor=function(icolor){
                phaseBall.style.fill=icolor;//utils.hslToRgb(Math.random(), 1, .5);// "DarkGreen";
            }


    		phaseLine.setRate=function(ir){
    			phaseLine.rate=ir;
    		}

    		phaseLine.setRateNorm=function(ir){
    			phaseLine.rate=ir*phaseLine.maxRate;
    		}

    		phaseLine.setAccel=function(a){
    			//phaseLine.accel=a;
    		}

    		phaseLine.setCenter=function(pt){
    			if (pt.x == undefined){
					console.log('Whoa nellie!');
				}
                this.pinPoint.x=pt.x;
                if (this.pinPoint.x == undefined){
					console.log('Whoa nellie!');
				}
                this.pinPoint.y=pt.y;
            }

            phaseLine.setLength=function(len){
            	if (len==undefined){
            		console.log('Whoa nellie!');
            	}
                this.len=len;

                phaseBall.r.baseVal.value=.05*len;
            }

            phaseLine.remove=function(){
            	iParent.removeChild(phaseLine);
            	iParent.removeChild(phaseBall);
            }



    		return(phaseLine);

    	}
    }
);
