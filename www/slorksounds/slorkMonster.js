require.config({
    paths: {"jsaSound": (function(){
            if (! window.document.location.hostname){
                alert("This page cannot be run as a file, but must be served from a server (e.g. animatedsoundworks.com, or localhost:8001)." );
            }
                // hardcoded to read sounds served from jsaSound listening on port 8001 (on the same server as the AnticipatoryScore server is running)
            var sndhost;
            //if ((window.document.location.hostname).includes("sonicthings.org")){
            if (true){
                sndhost="https://animatedsoundworks.com";//+window.document.location.hostname;
            } else {
                sndhost="https://mockserver.com:8001"
            }
                
                //host = "http://"+window.document.location.hostname + ":8001";
                //var host = "http://"+"172.23.68.214" + ":8001";
                //alert("Will look for sounds served from " + host);
                return (sndhost );
            })()
        }
});
// Set path to models served from animatedsoundworks 
// To use the sound on a web page with its current parameters (and without the slider box):
define(
 ["jsaSound/jsaModels/slorkMonsterVoice"],

function(sndFactory){
  return function(cb){
    return sndFactory(function(snd){

        snd.setParam("play", 0);
        snd.setParam("Gain", 0.75);
        snd.setParam("Delay Time", 0.06);
        snd.setParam("Echo Time", 1);
        cb && cb(snd);
    });
  }
});
