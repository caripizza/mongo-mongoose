/* eslint-disable no-console */
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/tweets', { useNewUrlParser: true });

// First mongoose model
const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});
// create a Tweet model
const Tweet = mongoose.model('Tweet', tweetSchema);
// Create a new tweet
/*
Tweet
  .create({ handle: 'caripizza', text: 'dis ma first tweet' })
  .then(createdTweet => console.log(createdTweet));
*/

// Query a model ~ use singular version!
// * Query with find
/*
Tweet 
  .find()
  .then(tweets => console.log(tweets));
// * Query with findById
Tweet
  .create({ handle: 'pizzapizza', text: 'a very first tweet' })
  .then(createdTweet => {
    return Tweet.findById(createdTweet._id);
  })
  .then(foundTweet => console.log(foundTweet));
*/

// Update a model
// * Update a tweet
/*
// Tweet
//   .create({ handle: 'ryan', text: 'my first tweet' })
//   .then(createdTweet => {
//     return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'hi there' });
//   })
//   .then(updatedTweet => console.log(updatedTweet));
Tweet
  .create({ handle: 'ryan', text: 'my first tweet' })
  .then(createdTweet => {
    return Tweet.findByIdAndUpdate(createdTweet._id, { text: 'hi there' },  { new: true });
  })
  .then(updatedTweet => console.log(updatedTweet));
// ^ whats the difference?
// * above update method doesn't print updated tweet text to console; bottom method DOES
*/

// Delete a tweet
Tweet
  // .findByIdAndDelete(FOUND_ID)
  .findByIdAndDelete('5c479ebed03ca164d0cac21a')
  .then(deleted => console.log(deleted));
