require.config({
    paths: {"jsaSound": "https://animatedsoundworks.com"}
});
// Set path to models served from animatedsoundworks 
// To use the sound on a web page with its current parameters (and without the slider box):
define(
 ["jsaSound/jsaModels/Distributed/GrannyBabble"],

function(sndFactory){
  return function(cb){
    return sndFactory(function(snd){

        snd.setParam("play", 0);
        snd.setParam("Pitch", 0);
        snd.setParam("Randomize Pitch", 0.44);
        snd.setParam("Grain Size", 0.9);
        snd.setParam("Step Size", 0.45);
        snd.setParam("Grain Play Interval", 0.5);
        snd.setParam("File Loop Start", 0);
        snd.setParam("File Loop Length", 1);
        snd.setParam("Gain", 0.4);
        cb && cb(snd);
    });
  }
});
