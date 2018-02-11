const mongoose = require('mongoose');
const playback = mongoose.model('Playback');
const cote = require('cote');

const playbackResponder = new cote.Responder({
  name: 'playback responder',
  namespace: 'playback',
  respondsTo: ['create']
});

const playbackPublisher = new cote.Publisher({
  name: 'playback publisher',
  namespace: 'playback',
  broadcasts: ['update','resume request','stop request']
});

const playbackSubscriber = new cote.Subscriber({
    name: 'playback subscriber',
    namespace: 'playback'
  });

playbackResponder.on('*', console.log);

//Status in onStart at the beginning
playbackResponder.on('create', async (req, res) => {
  const newplayback = new playback(req.playback); 
  playback = await newplayback.save();
  updatePlaybacks();
  res.send(playback);
});

/* playbackResponder.on('stop request', async(req, res) => {
    console.log("Publishing stop request for your partner!");
    playbackPublisher.publish('stop request', req);
});

playbackResponder.on('resume request', async(req, res) => {
    console.log("Publishing resume request for your partner!");
    playbackPublisher.publish('resume request', req);
}); */

playbackResponder.on('stop accepted', async(req, res) => {
    console.log("Stopping the playback!");
    req.playback.status = "onPause";
    updatePlaybacks();
});

playbackResponder.on('resume accepted', async(req, res) => {
    console.log("Resuming the playback!");
    req.playback.status = "onPlay";
    updatePlaybacks();
});

playbackResponder.on('finish', async (req, res) => {
    req.playback.status = "onEnd"
    updatePlaybacks();
    res.send(playback);
  });
  

async function updatePlaybacks() {
    playbacks = await playback.find();
    playbackPublisher.publish('update', playbacks);
}