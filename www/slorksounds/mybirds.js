require.config({
    paths: {"jsaSound": "https://animatedsoundworks.com/"}
});
// Set path to models served from animatedsoundworks 
// To use the sound on a web page with its current parameters (and without the slider box):
define(
 ["jsaSound/jsaModels/Ame/RandomBirdSample"],

function(sndFactory){
  return function(cb){
    return sndFactory(function(snd){

        snd.setParam("play", 0);
        snd.setParam("Gain", 1);

  //URL params can take some time to load - when done, they trigger the "resourceLoaded" event. 
        snd.on("resourceLoaded", function(){
          console.log("----- sound loaded, so Play!");
          cb && cb(snd);
  // snd.setParam("play", 1);
        });
        snd.setParam("Sound URL", "https://animatedsoundworks.com//jsaResources/sounds/birds/240249_2.mp3");

    });
  }
});
