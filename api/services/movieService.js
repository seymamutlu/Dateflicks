const mongoose = require('mongoose');
const movie = mongoose.model('movie');
const User = mongoose.model('User');
const multer = require('multer');
const uuid = require('uuid');
const cote = require('cote');


const movieResponder = new cote.Responder({
  name: 'movie responder',
  namespace: 'movie',
  respondsTo: ['list']
});

const moviePublisher = new cote.Publisher({
  name: 'movie publisher',
  namespace: 'movie',
  broadcasts: ['update']
});

movieResponder.on('list', (req) => {
  console.log('movie responder on list');
  console.log(req);
  const page = req.page || 1;
  const limit = 4;
  const skip = (page * limit) - limit;

  // 1. Query the database for a list of all movies
  const moviesPromise = movie
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc' });

  const countPromise = movie.count();

  return Promise.all([moviesPromise, countPromise]);
  const pages = Math.ceil(count / limit);
  if (!movies.length && skip) {
    res.json({info: `Hey! You asked for page ${page}. But that doesn't exist. So I put you on page ${pages}`});
  }
  //console.log(movies);
  res.send(movies);
 // res.json({movies: movies, page: page, pages: pages, count: count});
});


movieResponder.on('create', async (req, res) => {
  req.body.author = req.user._id;
  const movie = await (new movie(req.body)).save();
  res.json(movie);
  updatemovies();
});


movieResponder.on('getBySlug', async (req, res, next) => {
  const movie = await movie.findOne({ slug: req.params.slug }).populate('author reviews');
  if (!movie) return next();
  res.json(movie);
});

movieResponder.on('getByTag', async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true, $ne: [] };

  const tagsPromise = movie.getTagsList();
  const moviesPromise = movie.find({ tags: tagQuery });
  const [tags, movies] = await Promise.all([tagsPromise, moviesPromise]);

  res.json(movies);
});


movieResponder.on('search', async (req, res) => {
  const movies = await movie
  // first find movies that match
  .find({
    $text: {
      $search: req.query.q
    }
  }, {
    score: { $meta: 'textScore' }
  })
  // the sort them
  .sort({
    score: { $meta: 'textScore' }
  })
  // limit to only 5 results
  .limit(5);
  res.json(movies);
});


movieResponder.on('addToFavorite', async (req, res) => {
  const favoriteMovies = req.user.favoriteMovies.map(obj => obj.toString());

  const operator = favoriteMovies.includes(req.params.id) ? '$pull' : '$addToSet';
  const user = await User
    .findByIdAndUpdate(req.user._id,
      { [operator]: { favoriteMovies: req.params.id } },
      { new: true }
    );
  res.json(user);
});

movieResponder.on('getFavoriteMovies', async (req, res) => {
    const user = User.findById(req.params.userId);
    const movies = await movie.find({
    _id: { $in: user.favoriteMovies }
  });
  res.json(movies);
});

movieResponder.on('getTopMovies', async (req, res) => {
  const movies = await movie.getTopmovies();
  res.json(movies);
});
