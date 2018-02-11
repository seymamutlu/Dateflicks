const express = require('express');
const router = express.Router();
const playbackService = require('../services/playbackService');
const notificationService = require('../services/notificationService');

const cote = require('cote');

const playbackRequester = new cote.Requester({
    name: 'playback requester',
    namespace: 'playback'
});

const notificationRequester = new cote.Requester({
    name: 'notification requester',
    namespace: 'playback'
});

router.all('*', function(req, res, next) {
    console.log(req.method, req.url);
    next();
});
router.post('/playback/start', function(req, res) {
    playbackRequester
        .send({type: 'start', page: req.body.playback})
        .then(playback =>  console.log(playback))
        .then(process.exit)
  });
  router.post('/playback/:id/resume/1', function(req, res) {
    playbackRequester
        .send({type: 'resume accepted', page: req.body.playback})
        .then(playback =>  console.log(playback))
        .then(process.exit)
  });
  
  router.post('/playback/:id/stop/1', function(req, res) {
    playbackRequester
        .send({type: 'stop accepted', page: req.body.playback})
        .then(playback =>  console.log(playback))
        .then(process.exit)
  });
  
  router.post('/playback/:id/resumeRequest', function(req, res) {
    notificationRequester
        .send({type: 'resume request', page: req.body.playback})
        .then(playback =>  console.log(playback))
        .then(process.exit)
  });
  router.post('/playback/:id/stopRequest', function(req, res) {
    notificationRequester
        .send({type: 'stop request', page: req.body.playback})
        .then(playback =>  console.log(playback))
        .then(process.exit)
  });

module.exports = router;
