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

        snd.setParam("play", 1);
        snd.setParam("Pitch", -0.17);
        snd.setParam("Randomize Pitch", 0.28);
        snd.setParam("Grain Size", 0.9);
        snd.setParam("Step Size", 0.21);
        snd.setParam("Grain Play Interval", 0.64);
        snd.setParam("File Loop Start", 0);
        snd.setParam("File Loop Length", 1);
        snd.setParam("Gain", 0.4);
        cb && cb(snd);
    });
  }
});
