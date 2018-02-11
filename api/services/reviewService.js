const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const cote = require('cote');

const reviewResponder = new cote.Responder({
  name: 'review responder',
  namespace: 'review',
  respondsTo: ['create']
});

const reviewPublisher = new cote.Publisher({
  name: 'review publisher',
  namespace: 'review',
  broadcasts: ['update']
});

reviewResponder.on('*', console.log);

reviewResponder.on('add', async (req, res) => {
  req.body.movie = req.movieId;
  const newReview = new Review(req.body);
  review = await newReview.save();
  updateReviews();
  res.send(review);
});

reviewResponder.on('list', async(req, res) => {
  reviews = await Review.find();
  res.send(reviews);
});

async function updateReviews() {
    reviews = await Review.find();
    reviewPublisher.publish('update', reviews);
}