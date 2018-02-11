const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const movieSchema = new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: 'Please enter a movie name!'
    },
    slug: String,
    description: {
      type: String,
      trim: true
    },
    tags: [String],
    created: {
      type: Date,
      default: Date.now
    },
    service: {
      type: String,
      trim: true,
      required: 'Please enter a service name!' //Netflix or Apple or Amazon ...
    }
  });
  
  // Define our indexes
  movieSchema.index({
    name: 'text',
    description: 'text'
  });
  
  
  movieSchema.pre('save', async function(next) {
    if (!this.isModified('name')) {
      next(); // skip it
      return; // stop this function from running
    }
    this.slug = slug(this.name);
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const moviesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (moviesWithSlug.length) {
      this.slug = `${this.slug}-${moviesWithSlug.length + 1}`;
    }
    next();
  });
  
  movieSchema.statics.getTagsList = function() {
    return this.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  };
  
  movieSchema.statics.getTopmovies = function() {
    return this.aggregate([
      // Lookup movies and populate their reviews
      { $lookup: { from: 'reviews', localField: '_id', foreignField: 'movie', as: 'reviews' }},
      // filter for only items that have 2 or more reviews
      { $match: { 'reviews.1': { $exists: true } } },
      // Add the average reviews field
      { $project: {
        name: '$$ROOT.name',
        reviews: '$$ROOT.reviews',
        slug: '$$ROOT.slug',
        averageRating: { $avg: '$reviews.rating' }
      } },
      // sort it by our new field, highest reviews first
      { $sort: { averageRating: -1 }},
      // limit to at most 10
      { $limit: 10 }
    ]);
  }
  
  // find reviews where the movies _id property === reviews movie property
  movieSchema.virtual('reviews', {
    ref: 'Review', // what model to link?
    localField: '_id', // which field on the movie?
    foreignField: 'movie' // which field on the review?
  });
  
  function autopopulate(next) {
    this.populate('reviews');
    next();
  }
  
  movieSchema.pre('find', autopopulate);
  movieSchema.pre('findOne', autopopulate);
  
  module.exports = mongoose.model('Movie', movieSchema);
  