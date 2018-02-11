const cote = require('cote');

const responder = new cote.Responder({ name: 'notification responder' });
const subscriber = new cote.Subscriber({ name: 'playback subscriber' });
const notificationRequester = new cote.Requester({ name: 'notification requester' });
const playbackRequester = new cote.Requester({ name: 'playback requester' }); 

subscriber.on('resume request', (req,res) => {
    console.log('Notify the resume request to the other user!');
    notificationRequester.send({type: 'send resume request', notification: req.body});
});

subscriber.on('stop request', (req,res) => {
    console.log('Notify the stop request to the other user!');
    notificationRequester.send({type: 'send stop request', notification: req.body});
});

responder.on('resume request', (req, res) => {
    console.log(`Resume request sent to the user`);
});

responder.on('stop request', (req, res) => {
    console.log(`Stop request sent to the user`);
});

