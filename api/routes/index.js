const express = require('express');
const router = express.Router();
const playbackService = require('../services/playbackService');
//const { catchErrors } = require('../api/handlers/errorHandlers');
const cote = require('cote');

const playbackRequester = new cote.Requester({
    name: 'playback requester',
    namespace: 'playback'
});

router.all('*', function(req, res, next) {
    console.log(req.method, req.url);
    next();
});
router.post('/playbacks/create', function(req, res) {
    storeRequester
        .send({type: 'start', page: req.body.playback})
        .then(playback =>  console.log(playback))
        .then(process.exit)
  });



module.exports = router;
