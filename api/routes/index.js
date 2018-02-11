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
const userRequester = new cote.Requester({
    name: 'user requester',
    namespace: 'user'
});
const movieRequester = new cote.Requester({
    name: 'movie requester',
    namespace: 'movie'
});
const reviewRequester = new cote.Requester({
    name: 'review requester',
    namespace: 'review'
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


  router.get('/movies/page/:page', function(req, res) {
    movieRequester.send({type: 'list', page: req.params.page})
    .then(movies =>  console.log(movies))
        .then(process.exit)
    });

  router.get('/movies', function(req, res) {
    movieRequester.send({type: 'list'})
        .then(movies =>  console.log(movies))
        .then(process.exit)
    });
  
  router.post('movies/add', function(req, res) {
    movieRequester.send({type: 'list'})
    .then(movie =>  console.log(movie))
        .then(process.exit)
    });
  
  
  router.get('/movie/:slug', function(req, res) {
    movieRequester.send({type: 'getBySlug', slug: req.params.slug})
    .then(movie =>  console.log(movie))
        .then(process.exit)
    });

  router.get('/tags', function(req, res) {
    movieRequester.send({type: 'getByTag'})
    .then(movies =>  console.log(movies))
        .then(process.exit)
    });

  router.get('/tags/:tag', function(req, res) {
    movieRequester.send({type: 'getByTag', tag: req.params.tag})
    .then(movies =>  console.log(movies))
    .then(process.exit)
});
  
  router.get('/favoriteMovies/:userId', function(req, res) {
    movieRequester.send({type: 'getfavoriteMovies', userId: req.params.userId})
    .then(movies =>  console.log(movies))
        .then(process.exit)
    });
  
  router.post('/reviews/:id',function(req, res) {
    reviewRequester.send({type: 'add', movieId: req.params.id, body: req.body})
    .then(review =>  console.log(review))
        .then(process.exit)
    });
  
  router.get('/top', function(req, res) {
    movieRequester.send({type: 'getTopmovies'})
    .then(movies =>  console.log(movies))
    .then(process.exit)
});
router.post('/register', function(req, res) {
    userRequester.send({type: 'create', user: req.body.user})
    .then(user =>  console.log(user))
        .then(process.exit)
    });
module.exports = router;
