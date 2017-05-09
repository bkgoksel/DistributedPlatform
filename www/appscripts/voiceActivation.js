define(
    ["config", "meter"],
    function (config) {

        function didntGetStream() {
            alert('Stream generation failed.');
        }

        var msgbox = document.getElementById("msg");

        va = {}

        va.mediaStreamSource = null;
        va.rafID = null;
        va.meter =null;

        va.audioContext=null;
        va.audioContext=null;
        va.level=null;
        va.dur=null;
        va.cb=null;        

        va.init=function(ac, cb){
            va.audioContext=ac;
            //va.level=level;
            //va.dur=dur;
            va.cb=cb;
            msgbox.value="init VA";

             navigator.mediaDevices.getUserMedia = 
                navigator.mediaDevices.getUserMedia ||
                navigator.mediaDevices.webkitGetUserMedia ||
                navigator.mediaDevices.mozGetUserMedia;

            if (! navigator.mediaDevices.getUserMedia){
                alert('No voice activation availabe from what is probably an iOS device')
            } else {
            // ask for an audio input
                navigator.mediaDevices.getUserMedia(
                {
                    audio: true
                    /*{
                            "googEchoCancellation": "false",
                            "googAutoGainControl": "false",
                            "googNoiseSuppression": "false",
                            "googHighpassFilter": "false"

                    },*/
                }).then(function(stream){
                    va.gotStream(stream);
                }).catch(function(err){
                    alert(err);
                    didntGetStream();
                });
            }
        }
        


        va.gotStream=function(stream) {
            msgbox.value="got stream!"
            // Create an AudioNode from the stream.
            va.mediaStreamSource = va.audioContext.createMediaStreamSource(stream);

            // Create a new volume meter and connect it.
            va.meter = meter.createAudioMeter(va.audioContext, .3, .95, 750);
            va.mediaStreamSource.connect(va.meter);
            msgbox.value="got meter(?)!"

            // kick off the visual updating
            va.pollLoop();
        }

        var clippingP=false;
        va.pollLoop=function ( time ) {
            // check if we're currently clipping
            if (va.meter.checkClipping()) {
                if (!clippingP){  // only trigger on the upward edge
                    msgbox.value="clipping!"
                    clippingP=true;
                    va.cb()
                } 
            }else{ // clipping is averaged, so takes a while to return to not clipping
                //msgbox.value="..."
                msgbox.value=""
                clippingP=false;
            }

            // set up the next visual callback
            va.rafID = window.requestAnimationFrame( va.pollLoop );
        }

        va.quit=function(){
            va.meter.shutdown()
        }

        return va
    }
);
