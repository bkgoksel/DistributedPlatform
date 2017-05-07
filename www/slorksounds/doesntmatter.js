require.config({
    paths: {
      "jsaSound": (function(){
      if (! window.document.location.hostname){
        alert("This page cannot be run as a file, but must be served from a server (e.g. animatedsoundworks.com, or localhost:8001)." );
      }
        // hardcoded to read sounds served from jsaSound listening on port 8001 (on the same server as the AnticipatoryScore server is running)
      var sndhost;
      if ((window.document.location.hostname).includes("sonicthings.org")){
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
 ["jsaSound/jsaModels/Distributed/GrannyVoice"],

function(sndFactory){
  return function(cb){
    return sndFactory(function(snd){

        snd.setParam("play", 0);
        snd.setParam("Pitch", -0.6);
        snd.setParam("Randomize Pitch", 0.69);
        snd.setParam("Grain Size", 0.13);
        snd.setParam("Step Size", 0.14);
        snd.setParam("Grain Play Interval", 0.06);
        snd.setParam("File Loop Start", 0.04);
        snd.setParam("File Loop Length", 0.4);

  //URL params can take some time to load - when done, they trigger the "resourceLoaded" event. 
        snd.on("resourceLoaded", function(){
          console.log("----- sound loaded, so Play!");
          cb && cb(snd);
  // snd.setParam("play", 1);
        });
        //snd.setParam("Sound URL", "https://animatedsoundworks.com//jsaResources/sounds/milloyGlobalWarming_sm.mp3");

        snd.setParam("Gain", 0.4);
    });
  }
});
