var mongoose = require('mongoose'),
    Schema = mongoose.Schema();

var storySchema = new mongoose.Schema({
  storyName: String
});

module.exports = mongoose.model('Story', storySchema, 'stories');;
