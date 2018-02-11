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
  broadcasts: ['update']
});

playbackResponder.on('*', console.log);

playbackResponder.on('start', async (req, res) => {
  const newplayback = new playback(req.playback);
  playback = await newplayback.save();
  updatePlaybacks();
  res.send(playback);
});

playbackResponder.on('stop request', async(req, res) => {
    console.log("Publishing stop request for your partner!");
    playbackPublisher.publish('stopRequest', req);
});

playbackResponder.on('resume request', async(req, res) => {
    console.log("Publishing resume request for your partner!");
    playbackPublisher.publish('resumeRequest', req);
});

playbackResponder.on('stop', async(req, res) => {
    console.log("Stopping the playback!");
    req.playback.status = 0;
    updatePlaybacks();
});

playbackResponder.on('resume', async(req, res) => {
    console.log("Resuming the playback!");
    req.playback.status = 1;
    updatePlaybacks();
});


async function updatePlaybacks() {
    playbacks = await playback.find();
    playbackPublisher.publish('update', playbacks);
}